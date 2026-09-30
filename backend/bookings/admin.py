from django.contrib import admin
from .models import BookingPermission, RoomBooking


@admin.register(BookingPermission)
class BookingPermissionAdmin(admin.ModelAdmin):

    list_display = (
        'employee',
        'can_book',
        'granted_by',
        'granted_at',
        'created_at',
    )

    list_filter = (
        'can_book',
    )

    search_fields = (
        'employee__username',
        'employee__employee_id',
        'employee__email',
    )


@admin.register(RoomBooking)
class RoomBookingAdmin(admin.ModelAdmin):

    list_display = (
        'employee',
        'booking_date',
        'start_time',
        'end_time',
        'chairs_required',
        'purpose',
        'status',
        'approved_by',
    )

    list_filter = (
        'status',
        'booking_date',
    )

    search_fields = (
        'employee__username',
        'employee__employee_id',
        'employee__email',
        'purpose',
    )