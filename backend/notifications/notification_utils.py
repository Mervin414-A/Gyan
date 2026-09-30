from .models import Notification


def create_booking_submitted_notification(booking):
    Notification.objects.create(
        user=booking.employee,
        notification_type='BOOKING_SUBMITTED',
        title='Booking Request Submitted',
        message=(
            f'Your GM Conference Hall booking request for '
            f'{booking.booking_date} from '
            f'{booking.start_time} to {booking.end_time} '
            f'has been submitted and is waiting for admin approval.'
        )
    )


def create_booking_approved_notification(booking):
    Notification.objects.create(
        user=booking.employee,
        notification_type='BOOKING_APPROVED',
        title='Booking Approved',
        message=(
            f'Your GM Conference Hall booking for '
            f'{booking.booking_date} from '
            f'{booking.start_time} to {booking.end_time} '
            f'has been approved.'
        )
    )


def create_booking_rejected_notification(booking):
    Notification.objects.create(
        user=booking.employee,
        notification_type='BOOKING_REJECTED',
        title='Booking Rejected',
        message=(
            f'Your GM Conference Hall booking for '
            f'{booking.booking_date} from '
            f'{booking.start_time} to {booking.end_time} '
            f'has been rejected. '
            f'Reason: {booking.rejection_reason}'
        )
    )


def create_booking_cancelled_notification(booking):
    Notification.objects.create(
        user=booking.employee,
        notification_type='BOOKING_CANCELLED',
        title='Booking Cancelled',
        message=(
            f'Your GM Conference Hall booking for '
            f'{booking.booking_date} from '
            f'{booking.start_time} to {booking.end_time} '
            f'has been cancelled.'
        )
    )