from django.db import models
from accounts.models import User


class BookingPermission(models.Model):

    employee = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='booking_permission'
    )

    can_book = models.BooleanField(default=False)

    granted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='granted_booking_permissions'
    )

    granted_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.employee.employee_id} - {self.can_book}"

class RoomBooking(models.Model):

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed'),
    )

    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='room_bookings'
    )

    booking_date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField()

    chairs_required = models.PositiveIntegerField()

    purpose = models.CharField(
        max_length=255
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    rejection_reason = models.TextField(
        blank=True,
        null=True
    )

    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_bookings'
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.employee.employee_id} - {self.booking_date} - {self.start_time}"