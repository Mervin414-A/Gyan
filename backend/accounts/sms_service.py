def send_booking_approval_sms(user, booking):
    if not user.phone:
        print(
            f"Booking SMS not sent: "
            f"{user.username} has no phone number."
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
                f"for {booking.booking_date}, "
                f"from {booking.start_time.strftime('%I:%M %p')} "
                f"to {booking.end_time.strftime('%I:%M %p')} "
                "has been APPROVED by the admin."
            ),
            from_=settings.TWILIO_PHONE_NUMBER,
            to=user.phone,
        )

        print(
            f"Booking approval SMS submitted. "
            f"SID: {message.sid}"
        )
        return True

    except Exception:
        import logging

        logging.getLogger(__name__).exception(
            "Failed to send booking approval SMS."
        )
        return False