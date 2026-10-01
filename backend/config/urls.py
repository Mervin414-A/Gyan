from django.urls import path, include

urlpatterns = [

    path(
        'api/auth/',
        include('accounts.urls')
    ),

    path(
        'api/',
        include('bookings.urls')
    ),

    path(
        'api/',
        include('notifications.urls')
    ),

    path(
        'api/',
        include('reports.urls')
    ),
]