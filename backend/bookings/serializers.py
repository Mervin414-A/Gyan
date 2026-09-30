from rest_framework import serializers
from django.utils import timezone

from .models import RoomBooking
from reports.models import SystemSetting


class RoomBookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = RoomBooking

        fields = [
            'id',
            'booking_date',
            'start_time',
            'end_time',
            'chairs_required',
            'purpose',
            'status',
            'rejection_reason',
            'approved_by',
            'approved_at',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'status',
            'rejection_reason',
            'approved_by',
            'approved_at',
            'created_at',
        ]

    def validate_booking_date(self, value):

        today = timezone.localdate()

        if value < today:
            raise serializers.ValidationError(
                "Booking date cannot be in the past."
            )

        return value

    def validate(self, data):

        start_time = data.get('start_time')
        end_time = data.get('end_time')

        settings = SystemSetting.objects.first()

        if not settings:
            settings = SystemSetting.objects.create()

        if start_time >= end_time:
            raise serializers.ValidationError(
                "End time must be after start time."
            )

        start_minutes = (
            start_time.hour * 60 +
            start_time.minute
        )

        end_minutes = (
            end_time.hour * 60 +
            end_time.minute
        )

        duration = end_minutes - start_minutes

        if duration > settings.max_booking_duration_minutes:
            raise serializers.ValidationError(
                f"Maximum booking duration is "
                f"{settings.max_booking_duration_minutes} minutes."
            )

        working_start = (
            settings.working_start_time.hour * 60 +
            settings.working_start_time.minute
        )

        working_end = (
            settings.working_end_time.hour * 60 +
            settings.working_end_time.minute
        )

        if start_minutes < working_start:
            raise serializers.ValidationError(
                f"Booking cannot start before "
                f"{settings.working_start_time.strftime('%I:%M %p')}."
            )

        if end_minutes > working_end:
            raise serializers.ValidationError(
                f"Booking cannot end after "
                f"{settings.working_end_time.strftime('%I:%M %p')}."
            )

        chairs = data.get('chairs_required')

        if chairs < settings.min_chairs:
            raise serializers.ValidationError(
                f"Minimum number of chairs is "
                f"{settings.min_chairs}."
            )

        if chairs > settings.max_chairs:
            raise serializers.ValidationError(
                f"Maximum number of chairs is "
                f"{settings.max_chairs}."
            )

        return data