from django.contrib.auth import authenticate
from django.db.models import Count
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, BasePermission

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from bookings.models import BookingPermission, RoomBooking


# =========================================================
# LOGIN
# =========================================================

class LoginView(APIView):

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {
                    "message": "Username and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {
                    "message": "Invalid username or password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check whether employee/admin account is active
        if not user.is_active:
            return Response(
                {
                    "message": "Your account is inactive. Please contact admin."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "employee_id": user.employee_id,
                    "email": user.email,
                    "phone": user.phone,
                    "role": user.role,
                }
            },
            status=status.HTTP_200_OK
        )
class RegisterEmployeeView(APIView):
    def post(self, request):
        employee_id = request.data.get("employee_id")
        username = request.data.get("username")
        email = request.data.get("email")
        phone = request.data.get("phone")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        # Check required fields
        if not all([
            employee_id,
            username,
            email,
            password,
            confirm_password
        ]):
            return Response(
                {"message": "All required fields must be filled."},
                status=400
            )

        # Check password
        if password != confirm_password:
            return Response(
                {"message": "Passwords do not match."},
                status=400
            )

        if len(password) < 8:
            return Response(
                {"message": "Password must be at least 8 characters long."},
                status=400
            )

        # Check duplicate employee ID
        if User.objects.filter(employee_id=employee_id).exists():
            return Response(
                {"message": "Employee ID already exists."},
                status=400
            )

        # Check duplicate username
        if User.objects.filter(username=username).exists():
            return Response(
                {"message": "Username already exists."},
                status=400
            )

        # Check duplicate email
        if User.objects.filter(email=email).exists():
            return Response(
                {"message": "Email already exists."},
                status=400
            )

        # Create employee
        employee = User(
            employee_id=employee_id,
            username=username,
            email=email,
            phone=phone,
            role="EMPLOYEE",
            is_active=True,
        )

        # Hash password
        employee.set_password(password)
        employee.save()

        return Response(
            {
                "message": "Employee account created successfully.",
                "employee": {
                    "id": employee.id,
                    "employee_id": employee.employee_id,
                    "username": employee.username,
                    "email": employee.email,
                    "phone": employee.phone,
                    "role": employee.role,
                },
            },
            status=201
        )

# =========================================================
# PROFILE
# =========================================================

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "employee_id": user.employee_id,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
            },
            status=status.HTTP_200_OK
        )

    def put(self, request):

        user = request.user

        phone = request.data.get("phone")

        if phone is not None:
            user.phone = phone

        user.save()

        return Response(
            {
                "message": "Profile updated successfully.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "employee_id": user.employee_id,
                    "email": user.email,
                    "phone": user.phone,
                    "role": user.role,
                }
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADMIN PERMISSION CLASS
# =========================================================

class IsAdminUser(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
            and request.user.is_active
        )


# =========================================================
# CHANGE PASSWORD
# =========================================================

class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not old_password or not new_password or not confirm_password:

            return Response(
                {
                    "message": (
                        "Old password, new password and "
                        "confirm password are required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):

            return Response(
                {
                    "message": "Old password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:

            return Response(
                {
                    "message": (
                        "New password and confirm password "
                        "do not match."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:

            return Response(
                {
                    "message": (
                        "New password must be at least "
                        "8 characters long."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {
                "message": "Password changed successfully."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADMIN DASHBOARD
# =========================================================

class AdminDashboardView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        return Response(
            {
                "message": "Welcome to Admin Dashboard"
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADMIN DASHBOARD STATISTICS
# =========================================================

class AdminDashboardStatsView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        total_employees = User.objects.filter(
            role="EMPLOYEE"
        ).count()

        total_bookings = RoomBooking.objects.count()

        pending_bookings = RoomBooking.objects.filter(
            status="PENDING"
        ).count()

        approved_bookings = RoomBooking.objects.filter(
            status="APPROVED"
        ).count()

        rejected_bookings = RoomBooking.objects.filter(
            status="REJECTED"
        ).count()

        cancelled_bookings = RoomBooking.objects.filter(
            status="CANCELLED"
        ).count()

        completed_bookings = RoomBooking.objects.filter(
            status="COMPLETED"
        ).count()

        return Response(
            {
                "total_employees": total_employees,
                "total_bookings": total_bookings,
                "pending_bookings": pending_bookings,
                "approved_bookings": approved_bookings,
                "rejected_bookings": rejected_bookings,
                "cancelled_bookings": cancelled_bookings,
                "completed_bookings": completed_bookings,
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADMIN EMPLOYEE LIST
# =========================================================

class AdminEmployeeListView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        employees = User.objects.filter(
            role="EMPLOYEE"
        ).order_by("employee_id")

        data = []

        for employee in employees:

            permission, created = (
                BookingPermission.objects.get_or_create(
                    employee=employee
                )
            )

            data.append(
                {
                    "id": employee.id,
                    "employee_id": employee.employee_id,
                    "username": employee.username,
                    "email": employee.email,
                    "phone": employee.phone,
                    "is_active": employee.is_active,
                    "can_book": permission.can_book,
                }
            )

        return Response(
            {
                "count": len(data),
                "employees": data,
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADMIN BOOKING PERMISSION
# =========================================================

class AdminBookingPermissionView(APIView):

    permission_classes = [IsAdminUser]

    def patch(self, request, employee_id):

        try:

            employee = User.objects.get(
                id=employee_id,
                role="EMPLOYEE"
            )

        except User.DoesNotExist:

            return Response(
                {
                    "message": "Employee not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        can_book = request.data.get("can_book")

        if can_book is None:

            return Response(
                {
                    "message": "can_book is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if isinstance(can_book, str):

            can_book = can_book.lower() == "true"

        if not isinstance(can_book, bool):

            return Response(
                {
                    "message": "can_book must be true or false."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        permission, created = (
            BookingPermission.objects.get_or_create(
                employee=employee
            )
        )

        permission.can_book = can_book
        permission.granted_by = request.user

        if can_book:
            permission.granted_at = timezone.now()
        else:
            permission.granted_at = None

        permission.save()

        return Response(
            {
                "message": (
                    "Booking permission granted."
                    if can_book
                    else "Booking permission revoked."
                ),
                "employee": {
                    "id": employee.id,
                    "employee_id": employee.employee_id,
                    "username": employee.username,
                    "can_book": permission.can_book,
                }
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADMIN EMPLOYEE STATUS
# =========================================================

class AdminEmployeeStatusView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, employee_id):

        try:

            employee = User.objects.get(
                id=employee_id,
                role="EMPLOYEE"
            )

        except User.DoesNotExist:

            return Response(
                {
                    "message": "Employee not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        is_active = request.data.get("is_active")

        if is_active is None:

            return Response(
                {
                    "message": "is_active is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if isinstance(is_active, str):

            is_active = is_active.lower() == "true"

        if not isinstance(is_active, bool):

            return Response(
                {
                    "message": (
                        "is_active must be true or false."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        employee.is_active = is_active
        employee.save()

        return Response(
            {
                "message": (
                    "Employee activated successfully."
                    if is_active
                    else "Employee deactivated successfully."
                ),
                "employee": {
                    "id": employee.id,
                    "employee_id": employee.employee_id,
                    "username": employee.username,
                    "email": employee.email,
                    "is_active": employee.is_active,
                }
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADMIN REPORTS
# =========================================================

class AdminReportsView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        today = timezone.localdate()

        total_bookings = RoomBooking.objects.count()

        pending = RoomBooking.objects.filter(
            status="PENDING"
        ).count()

        approved = RoomBooking.objects.filter(
            status="APPROVED"
        ).count()

        rejected = RoomBooking.objects.filter(
            status="REJECTED"
        ).count()

        cancelled = RoomBooking.objects.filter(
            status="CANCELLED"
        ).count()

        completed = RoomBooking.objects.filter(
            status="COMPLETED"
        ).count()

        today_bookings = RoomBooking.objects.filter(
            booking_date=today
        ).count()

        upcoming_bookings = RoomBooking.objects.filter(
            booking_date__gt=today,
            status="APPROVED"
        ).count()

        employee_bookings = (
            RoomBooking.objects
            .values(
                "employee__employee_id",
                "employee__username"
            )
            .annotate(
                booking_count=Count("id")
            )
            .order_by("-booking_count")
        )

        employee_data = []

        for item in employee_bookings:

            employee_data.append(
                {
                    "employee_id": item[
                        "employee__employee_id"
                    ],
                    "username": item[
                        "employee__username"
                    ],
                    "booking_count": item[
                        "booking_count"
                    ],
                }
            )

        return Response(
            {
                "total_bookings": total_bookings,

                "booking_status": {
                    "pending": pending,
                    "approved": approved,
                    "rejected": rejected,
                    "cancelled": cancelled,
                    "completed": completed,
                },

                "today": {
                    "date": today,
                    "bookings": today_bookings,
                },

                "upcoming_approved_bookings": (
                    upcoming_bookings
                ),

                "employee_booking_report": employee_data,
            },
            status=status.HTTP_200_OK
        )

