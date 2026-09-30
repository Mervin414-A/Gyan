from django.db import models


class SystemSetting(models.Model):

    max_booking_duration_minutes = models.PositiveIntegerField(
        default=120
    )

    min_chairs = models.PositiveIntegerField(
        default=1
    )

    max_chairs = models.PositiveIntegerField(
        default=7
    )

    working_start_time = models.TimeField(
        default='09:00'
    )

    working_end_time = models.TimeField(
        default='18:00'
    )

    approval_required = models.BooleanField(
        default=True
    )

    email_notifications = models.BooleanField(
        default=True
    )

    employee_cancellation = models.BooleanField(
        default=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return "Conference Hall System Settings"