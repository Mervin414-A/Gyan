from django.urls import path

from .views import (
    RoomBookingCreateView,
    MyBookingsView,
    MyBookingDetailView,
    CancelMyBookingView,
    MyActivityView,
    AdminBookingsView,
    AdminApproveBookingView,
    AdminRejectBookingView
)


urlpatterns = [

    path(
        'bookings/',
        RoomBookingCreateView.as_view(),
        name='create-booking'
    ),

    path(
        'my-bookings/',
        MyBookingsView.as_view(),
        name='my-bookings'
    ),

    path(
        'my-bookings/<int:booking_id>/',
        MyBookingDetailView.as_view(),
        name='my-booking-detail'
    ),

    path(
        'my-bookings/<int:booking_id>/cancel/',
        CancelMyBookingView.as_view(),
        name='cancel-my-booking'
    ),

    path(
        'admin/bookings/',
        AdminBookingsView.as_view(),
        name='admin-bookings'
    ),

    path(
        'admin/bookings/<int:booking_id>/approve/',
        AdminApproveBookingView.as_view(),
        name='admin-approve-booking'
    ),

    path(
        'admin/bookings/<int:booking_id>/reject/',
        AdminRejectBookingView.as_view(),
        name='admin-reject-booking'
    ),
    path(
    'my-activity/',
    MyActivityView.as_view(),
    name='my-activity'
    ),
]