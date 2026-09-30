from django.urls import path

from .views import (
    AdminDashboardStatsView,
    AdminBookingAnalyticsView,
    AdminSystemSettingsView
)


urlpatterns = [

    path(
        'admin/dashboard-stats/',
        AdminDashboardStatsView.as_view(),
        name='admin-dashboard-stats'
    ),

    path(
        'admin/booking-analytics/',
        AdminBookingAnalyticsView.as_view(),
        name='admin-booking-analytics'
    ),

    path(
        'admin/system-settings/',
        AdminSystemSettingsView.as_view(),
        name='admin-system-settings'
    ),
]