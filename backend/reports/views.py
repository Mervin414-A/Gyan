from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDate, TruncMonth, ExtractHour

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from accounts.views import IsAdminUser
from .models import SystemSetting
from accounts.models import User
from bookings.models import RoomBooking, BookingPermission


class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        today = timezone.localdate()

        total_bookings = RoomBooking.objects.count()

        pending_bookings = RoomBooking.objects.filter(
            status='PENDING'
        ).count()

        approved_bookings = RoomBooking.objects.filter(
            status='APPROVED'
        ).count()

        rejected_bookings = RoomBooking.objects.filter(
            status='REJECTED'
        ).count()

        cancelled_bookings = RoomBooking.objects.filter(
            status='CANCELLED'
        ).count()

        completed_bookings = RoomBooking.objects.filter(
            status='COMPLETED'
        ).count()

        today_bookings = RoomBooking.objects.filter(
            booking_date=today
        ).count()
        total_employees = User.objects.filter(
            role='EMPLOYEE'
        ).count()

        active_employees = User.objects.filter(
            role='EMPLOYEE',
            is_active=True
        ).count()

        inactive_employees = User.objects.filter(
            role='EMPLOYEE',
            is_active=False
        ).count()

        employees_with_booking_permission = BookingPermission.objects.filter(
            employee__role='EMPLOYEE',
            can_book=True
        ).count()

        return Response(
            {
                'total_bookings': total_bookings,
                'pending_bookings': pending_bookings,
                'approved_bookings': approved_bookings,
                'rejected_bookings': rejected_bookings,
                'cancelled_bookings': cancelled_bookings,
                'completed_bookings': completed_bookings,
                'today_bookings': today_bookings,

                'total_employees': total_employees,
                'active_employees': active_employees,
                'inactive_employees': inactive_employees,
                'employees_with_booking_permission':
                    employees_with_booking_permission,
            },
            status=status.HTTP_200_OK
        )

class AdminBookingAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        # --------------------------------
        # Daily Booking Statistics
        # --------------------------------

        daily_bookings = (
            RoomBooking.objects
            .values('booking_date')
            .annotate(total=Count('id'))
            .order_by('booking_date')
        )

        daily_data = []

        for item in daily_bookings:
            daily_data.append({
                'date': item['booking_date'],
                'total': item['total']
            })

        # --------------------------------
        # Monthly Booking Statistics
        # --------------------------------

        monthly_bookings = (
            RoomBooking.objects
            .annotate(
                month=TruncMonth('booking_date')
            )
            .values('month')
            .annotate(total=Count('id'))
            .order_by('month')
        )

        monthly_data = []

        for item in monthly_bookings:
            monthly_data.append({
                'month': item['month'],
                'total': item['total']
            })

        # --------------------------------
        # Most Active Employees
        # --------------------------------

        active_employees = (
            RoomBooking.objects
            .values(
                'employee__id',
                'employee__username',
                'employee__employee_id'
            )
            .annotate(total=Count('id'))
            .order_by('-total')
        )

        employee_data = []

        for item in active_employees:
            employee_data.append({
                'employee_id': item['employee__employee_id'],
                'username': item['employee__username'],
                'total_bookings': item['total']
            })

        # --------------------------------
        # Peak Booking Hours
        # --------------------------------

        peak_hours = (
            RoomBooking.objects
            .annotate(
                hour=ExtractHour('start_time')
            )
            .values('hour')
            .annotate(total=Count('id'))
            .order_by('-total')
        )

        peak_hour_data = []

        for item in peak_hours:
            peak_hour_data.append({
                'hour': item['hour'],
                'total_bookings': item['total']
            })
            chair_usage = (
            RoomBooking.objects
            .values('chairs_required')
            .annotate(total=Count('id'))
            .order_by('chairs_required')
        )

        chair_usage_data = []

        for item in chair_usage:
            chair_usage_data.append({
                'chairs': item['chairs_required'],
                'total_bookings': item['total']
            })

        return Response(
            {
                'daily_bookings': daily_data,
                'monthly_bookings': monthly_data,
                'most_active_employees': employee_data,
                'peak_booking_hours': peak_hour_data,
                'chair_usage': chair_usage_data
            },
            status=status.HTTP_200_OK
        )

class AdminSystemSettingsView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        settings = SystemSetting.objects.first()

        if not settings:
            settings = SystemSetting.objects.create()

        return Response(
            {
                'max_booking_duration_minutes':
                    settings.max_booking_duration_minutes,

                'min_chairs':
                    settings.min_chairs,

                'max_chairs':
                    settings.max_chairs,

                'working_start_time':
                    settings.working_start_time,

                'working_end_time':
                    settings.working_end_time,

                'approval_required':
                    settings.approval_required,

                'email_notifications':
                    settings.email_notifications,

                'employee_cancellation':
                    settings.employee_cancellation,

                'updated_at':
                    settings.updated_at,
            },
            status=status.HTTP_200_OK
        )

    def put(self, request):

        settings = SystemSetting.objects.first()

        if not settings:
            settings = SystemSetting.objects.create()

        max_duration = request.data.get(
            'max_booking_duration_minutes',
            settings.max_booking_duration_minutes
        )

        min_chairs = request.data.get(
            'min_chairs',
            settings.min_chairs
        )

        max_chairs = request.data.get(
            'max_chairs',
            settings.max_chairs
        )

        working_start = request.data.get(
            'working_start_time',
            settings.working_start_time
        )

        working_end = request.data.get(
            'working_end_time',
            settings.working_end_time
        )

        approval_required = request.data.get(
            'approval_required',
            settings.approval_required
        )

        email_notifications = request.data.get(
            'email_notifications',
            settings.email_notifications
        )

        employee_cancellation = request.data.get(
            'employee_cancellation',
            settings.employee_cancellation
        )

        if int(min_chairs) < 1:
            return Response(
                {'message': 'Minimum chairs must be at least 1.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if int(max_chairs) > 7:
            return Response(
                {'message': 'Maximum chairs cannot exceed 7.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if int(min_chairs) > int(max_chairs):
            return Response(
                {'message': 'Minimum chairs cannot exceed maximum chairs.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if int(max_duration) <= 0:
            return Response(
                {'message': 'Maximum booking duration must be greater than 0.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        settings.max_booking_duration_minutes = int(max_duration)
        settings.min_chairs = int(min_chairs)
        settings.max_chairs = int(max_chairs)
        settings.working_start_time = working_start
        settings.working_end_time = working_end
        settings.approval_required = approval_required
        settings.email_notifications = email_notifications
        settings.employee_cancellation = employee_cancellation

        settings.save()

        return Response(
            {
                'message': 'System settings updated successfully.',
                'settings': {
                    'max_booking_duration_minutes':
                        settings.max_booking_duration_minutes,

                    'min_chairs':
                        settings.min_chairs,

                    'max_chairs':
                        settings.max_chairs,

                    'working_start_time':
                        settings.working_start_time,

                    'working_end_time':
                        settings.working_end_time,

                    'approval_required':
                        settings.approval_required,

                    'email_notifications':
                        settings.email_notifications,

                    'employee_cancellation':
                        settings.employee_cancellation,
                }
            },
            status=status.HTTP_200_OK
        )