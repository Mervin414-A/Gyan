from django.db import models
from accounts.models import User


class Notification(models.Model):

    NOTIFICATION_TYPES = (
        ('BOOKING_SUBMITTED', 'Booking Submitted'),
        ('BOOKING_APPROVED', 'Booking Approved'),
        ('BOOKING_REJECTED', 'Booking Rejected'),
        ('BOOKING_CANCELLED', 'Booking Cancelled'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    notification_type = models.CharField(
        max_length=30,
        choices=NOTIFICATION_TYPES
    )

    title = models.CharField(max_length=255)

    message = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"