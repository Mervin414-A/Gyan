from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

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
