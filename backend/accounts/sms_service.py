from django.conf import settings
from twilio.rest import Client


def send_permission_sms(user):
    if not user.phone:
        print(
            f"SMS not sent: {user.username} has no phone number."
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

        print(f"Permission SMS sent. SID: {message.sid}")
        return True

    except Exception:
        import logging

        logging.getLogger(__name__).exception(
            "Failed to send booking permission SMS."
        )
        return False
