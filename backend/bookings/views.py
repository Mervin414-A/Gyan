from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import RoomBooking
from .serializers import RoomBookingSerializer
from accounts.views import IsAdminUser
from reports.models import SystemSetting

from .email_utils import (
    send_booking_submitted_email,
    send_booking_approved_email,
    send_booking_rejected_email,
    send_booking_cancelled_email
)

from notifications.notification_utils import (
    create_booking_submitted_notification,
    create_booking_approved_notification,
    create_booking_rejected_notification,
    create_booking_cancelled_notification
)


class RoomBookingCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        settings = SystemSetting.objects.first()

        if not settings:
            settings = SystemSetting.objects.create()

        # Check employee role
        if user.role != 'EMPLOYEE':
            return Response(
                {
                    'message': 'Only employees can create booking requests.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Check booking permission
        try:
            permission = user.booking_permission
        except Exception:
            permission = None

        if permission is None or not permission.can_book:
            return Response(
                {
                    'message': (
                        'You do not have permission to book '
                        'the GM Conference Hall.'
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = RoomBookingSerializer(
            data=request.data
        )

        if serializer.is_valid():

            booking_date = serializer.validated_data[
                'booking_date'
            ]

            start_time = serializer.validated_data[
                'start_time'
            ]

            end_time = serializer.validated_data[
                'end_time'
            ]

            # Check overlapping bookings
            overlapping_booking = RoomBooking.objects.filter(
                booking_date=booking_date,
                status__in=['PENDING', 'APPROVED'],
                start_time__lt=end_time,
                end_time__gt=start_time
            ).exists()

            if overlapping_booking:
                return Response(
                    {
                        'message': (
                            'GM Conference Hall is already booked '
                            'or requested during this time.'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # ------------------------------------------------
            # IMPORTANT:
            # Every employee booking must wait for admin approval
            # ------------------------------------------------
            booking = serializer.save(
                employee=request.user,
                status='PENDING'
            )

            # Create notification for pending booking
            create_booking_submitted_notification(
                booking
            )

            # Send submitted email
            if settings.email_notifications:
                send_booking_submitted_email(
                    booking
                )

            return Response(
                {
                    'message': (
                        'Booking request submitted successfully. '
                        'Waiting for admin approval.'
                    ),
                    'booking': RoomBookingSerializer(
                        booking
                    ).data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class MyBookingsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        bookings = RoomBooking.objects.filter(
            employee=request.user
        ).order_by(
            '-booking_date',
            '-start_time'
        )

        serializer = RoomBookingSerializer(
            bookings,
            many=True
        )

        return Response(
            {
                'count': bookings.count(),
                'bookings': serializer.data
            },
            status=status.HTTP_200_OK
        )


class AdminBookingsView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        bookings = RoomBooking.objects.all().order_by(
            '-created_at'
        )

        # -----------------------------
        # Filter by status
        # -----------------------------

        booking_status = request.query_params.get(
            'status'
        )

        if booking_status:

            booking_status = booking_status.upper()

            valid_statuses = [
                'PENDING',
                'APPROVED',
                'REJECTED',
                'CANCELLED',
                'COMPLETED'
            ]

            if booking_status not in valid_statuses:
                return Response(
                    {
                        'message': 'Invalid booking status.',
                        'valid_statuses': valid_statuses
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            bookings = bookings.filter(
                status=booking_status
            )

        # -----------------------------
        # Filter by booking date
        # -----------------------------

        booking_date = request.query_params.get(
            'booking_date'
        )

        if booking_date:

            try:
                booking_date = timezone.datetime.strptime(
                    booking_date,
                    '%Y-%m-%d'
                ).date()

            except ValueError:

                return Response(
                    {
                        'message': (
                            'Invalid booking_date format. '
                            'Use YYYY-MM-DD.'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            bookings = bookings.filter(
                booking_date=booking_date
            )

        # -----------------------------
        # Prepare response
        # -----------------------------

        data = []

        for booking in bookings:

            data.append(
                {
                    'id': booking.id,

                    'employee': {
                        'id': booking.employee.id,
                        'employee_id': (
                            booking.employee.employee_id
                        ),
                        'username': (
                            booking.employee.username
                        ),
                        'email': booking.employee.email,
                        'phone': booking.employee.phone,
                    },

                    'conference_hall': 'GM Conference Hall',

                    'booking_date': booking.booking_date,
                    'start_time': booking.start_time,
                    'end_time': booking.end_time,

                    'chairs_required': (
                        booking.chairs_required
                    ),

                    'purpose': booking.purpose,

                    'status': booking.status,

                    'rejection_reason': (
                        booking.rejection_reason
                    ),

                    'approved_by': (
                        booking.approved_by.id
                        if booking.approved_by
                        else None
                    ),

                    'approved_at': booking.approved_at,

                    'created_at': booking.created_at,
                }
            )

        return Response(
            {
                'count': bookings.count(),
                'bookings': data
            },
            status=status.HTTP_200_OK
        )


class AdminApproveBookingView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, booking_id):

        try:
            booking = RoomBooking.objects.get(
                id=booking_id
            )

        except RoomBooking.DoesNotExist:

            return Response(
                {
                    'message': 'Booking not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if booking.status != 'PENDING':

            return Response(
                {
                    'message': (
                        'Only pending bookings can be approved.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'APPROVED'
        booking.approved_by = request.user
        booking.approved_at = timezone.now()

        booking.save()

        settings = SystemSetting.objects.first()

        if not settings:
            settings = SystemSetting.objects.create()

        # Notification
        create_booking_approved_notification(
            booking
        )

        # Email
        if settings.email_notifications:
            send_booking_approved_email(
                booking
            )

        return Response(
            {
                'message': (
                    'Booking approved successfully.'
                ),
                'booking': RoomBookingSerializer(
                    booking
                ).data
            },
            status=status.HTTP_200_OK
        )


class AdminRejectBookingView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, booking_id):

        try:
            booking = RoomBooking.objects.get(
                id=booking_id
            )

        except RoomBooking.DoesNotExist:

            return Response(
                {
                    'message': 'Booking not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if booking.status != 'PENDING':

            return Response(
                {
                    'message': (
                        'Only pending bookings can be rejected.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get(
            'rejection_reason'
        )

        if not reason:

            return Response(
                {
                    'message': 'Rejection reason is required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'REJECTED'
        booking.rejection_reason = reason

        booking.save()

        settings = SystemSetting.objects.first()

        if not settings:
            settings = SystemSetting.objects.create()

        # Notification
        create_booking_rejected_notification(
            booking
        )

        # Email
        if settings.email_notifications:
            send_booking_rejected_email(
                booking
            )

        return Response(
            {
                'message': (
                    'Booking rejected successfully.'
                ),
                'booking': RoomBookingSerializer(
                    booking
                ).data
            },
            status=status.HTTP_200_OK
        )


class MyBookingDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):

        try:

            booking = RoomBooking.objects.get(
                id=booking_id,
                employee=request.user
            )

        except RoomBooking.DoesNotExist:

            return Response(
                {
                    'message': 'Booking not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RoomBookingSerializer(
            booking
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class CancelMyBookingView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):

        try:

            booking = RoomBooking.objects.get(
                id=booking_id,
                employee=request.user
            )

        except RoomBooking.DoesNotExist:

            return Response(
                {
                    'message': 'Booking not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Get system settings
        settings = SystemSetting.objects.first()

        if not settings:
            settings = SystemSetting.objects.create()

        # Check cancellation setting
        if not settings.employee_cancellation:

            return Response(
                {
                    'message': (
                        'Employee cancellation is currently disabled.'
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Only pending or approved bookings can be cancelled
        if booking.status not in [
            'PENDING',
            'APPROVED'
        ]:

            return Response(
                {
                    'message': (
                        'Only pending or approved bookings '
                        'can be cancelled.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'CANCELLED'

        booking.save()

        # Create notification
        create_booking_cancelled_notification(
            booking
        )

        # Send email
        if settings.email_notifications:
            send_booking_cancelled_email(
                booking
            )

        return Response(
            {
                'message': (
                    'Booking cancelled successfully.'
                ),
                'booking': RoomBookingSerializer(
                    booking
                ).data
            },
            status=status.HTTP_200_OK
        )


class MyActivityView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Get all bookings created by the logged-in employee
        bookings = RoomBooking.objects.filter(
            employee=request.user
        ).order_by(
            '-created_at'
        )

        activities = []

        for booking in bookings:

            activities.append(
                {
                    'id': booking.id,

                    'conference_hall': 'GM Conference Hall',

                    'booking_date': booking.booking_date,

                    'start_time': booking.start_time,

                    'end_time': booking.end_time,

                    'chairs_required': booking.chairs_required,

                    'purpose': booking.purpose,

                    'status': booking.status,

                    'rejection_reason': (
                        booking.rejection_reason
                        if booking.rejection_reason
                        else None
                    ),

                    'approved_by': (
                        booking.approved_by.username
                        if booking.approved_by
                        else None
                    ),

                    'approved_at': booking.approved_at,

                    'created_at': booking.created_at,
                }
            )

        return Response(
            {
                'count': len(activities),
                'activities': activities
            },
            status=status.HTTP_200_OK
        )