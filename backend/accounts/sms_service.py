
from django.conf import settings
from twilio.rest import Client
import logging


logger = logging.getLogger(__name__)


def send_permission_sms(user):
    """Send SMS when an employee receives booking permission."""
    if not user.phone:
        logger.warning(
            "Permission SMS not sent: employee has no phone number."
        )
        return False

    try:
        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN,
        )

        message = client.messages.create(
            body=(
                "GyanMatrix: Your conference hall booking "
                "permission has been granted. You can now "
                "request a booking."
            ),
            from_=settings.TWILIO_PHONE_NUMBER,
            to=user.phone,
        )

        logger.info("Permission SMS submitted: %s", message.sid)
        return True

    except Exception:
        logger.exception("Failed to send booking permission SMS.")
        return False


def send_booking_approval_sms(user, booking):
    """Send SMS when an admin approves an employee's booking."""
    if not user.phone:
        logger.warning(
            "Booking approval SMS not sent: no phone number."
        )
        return False

    try:
        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN,
        )

        message = client.messages.create(
            body=(
                "GyanMatrix: Your conference hall booking "
                f"for {booking.booking_date}, from "
                f"{booking.start_time.strftime('%I:%M %p')} to "
                f"{booking.end_time.strftime('%I:%M %p')} "
                "has been approved by the admin."
            ),
            from_=settings.TWILIO_PHONE_NUMBER,
            to=user.phone,
        )

        logger.info("Booking approval SMS submitted: %s", message.sid)
        return True

    except Exception:
        logger.exception("Failed to send booking approval SMS.")
        return False
