from django.core.mail import send_mail
from django.conf import settings


def send_booking_submitted_email(booking):

    subject = 'GM Conference Hall Booking Request Submitted'

    message = f"""
Hello {booking.employee.username},

Your GM Conference Hall booking request has been submitted successfully.

Booking Details:
--------------------------------
Date: {booking.booking_date}
From: {booking.start_time}
To: {booking.end_time}
Chairs: {booking.chairs_required}
Purpose: {booking.purpose}
Status: PENDING
--------------------------------

Your booking request is waiting for admin approval.

Thank you,
Gyan Matrix
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [booking.employee.email],
        fail_silently=False
    )


def send_booking_approved_email(booking):

    subject = 'GM Conference Hall Booking Approved'

    message = f"""
Hello {booking.employee.username},

Your GM Conference Hall booking has been APPROVED.

Booking Details:
--------------------------------
Conference Hall: GM Conference Hall
Date: {booking.booking_date}
From: {booking.start_time}
To: {booking.end_time}
Duration: 2 hours or less
Chairs: {booking.chairs_required}
Purpose: {booking.purpose}
Status: APPROVED
--------------------------------

The requested number of chairs will be arranged.

Thank you,
Gyan Matrix
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [booking.employee.email],
        fail_silently=False
    )


def send_booking_rejected_email(booking):

    subject = 'GM Conference Hall Booking Rejected'

    message = f"""
Hello {booking.employee.username},

Your GM Conference Hall booking request has been REJECTED.

Booking Details:
--------------------------------
Conference Hall: GM Conference Hall
Date: {booking.booking_date}
From: {booking.start_time}
To: {booking.end_time}
Chairs: {booking.chairs_required}
Purpose: {booking.purpose}
Status: REJECTED

Reason:
{booking.rejection_reason}
--------------------------------

Please contact the admin if you need more information.

Thank you,
Gyan Matrix
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [booking.employee.email],
        fail_silently=False
    )

def send_booking_cancelled_email(booking):

    subject = 'GM Conference Hall Booking Cancelled'

    message = f"""
Hello {booking.employee.username},

Your GM Conference Hall booking has been CANCELLED.

Booking Details:
--------------------------------
Conference Hall: GM Conference Hall
Date: {booking.booking_date}
From: {booking.start_time}
To: {booking.end_time}
Chairs: {booking.chairs_required}
Purpose: {booking.purpose}
Status: CANCELLED
--------------------------------

If you cancelled this booking by mistake, please contact the admin.

Thank you,
Gyan Matrix
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [booking.employee.email],
        fail_silently=False
    )