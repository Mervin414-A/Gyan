from django.urls import path

from .views import (
    MyNotificationsView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
    AdminNotificationsView,
    AdminMarkNotificationReadView,
    AdminMarkAllNotificationsReadView
)

urlpatterns = [
    path(
        'notifications/',
        MyNotificationsView.as_view(),
        name='my-notifications'
    ),

    path(
        'notifications/<int:notification_id>/read/',
        MarkNotificationReadView.as_view(),
        name='mark-notification-read'
    ),

    path(
        'notifications/read-all/',
        MarkAllNotificationsReadView.as_view(),
        name='mark-all-notifications-read'
    ),

    path(
        'admin/notifications/',
        AdminNotificationsView.as_view(),
        name='admin-notifications'
    ),
    path(
    'admin/notifications/<int:notification_id>/read/',
    AdminMarkNotificationReadView.as_view(),
    name='admin-mark-notification-read'
    ),
    path(
    'admin/notifications/read-all/',
    AdminMarkAllNotificationsReadView.as_view(),
    name='admin-mark-all-notifications-read'
    ),
]