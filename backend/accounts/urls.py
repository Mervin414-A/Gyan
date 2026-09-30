from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginView,
    RegisterEmployeeView,
    ProfileView,
    ChangePasswordView,
    AdminDashboardView,
    AdminDashboardStatsView,
    AdminEmployeeListView,
    AdminBookingPermissionView,
    AdminEmployeeStatusView,
    AdminReportsView,
)

urlpatterns = [

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),
    path("register/", RegisterEmployeeView.as_view(), name="register-employee"),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh"
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password"
    ),

    path(
        "admin-dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard"
    ),

    path(
        "admin/dashboard/stats/",
        AdminDashboardStatsView.as_view(),
        name="admin-dashboard-stats"
    ),

    path(
        "admin/employees/",
        AdminEmployeeListView.as_view(),
        name="admin-employees"
    ),

    path(
        "admin/employees/<int:employee_id>/booking-permission/",
        AdminBookingPermissionView.as_view(),
        name="admin-booking-permission"
    ),


    path(
        "admin/employees/<int:employee_id>/status/",
        AdminEmployeeStatusView.as_view(),
        name="admin-employee-status"
    ),

    path(
        "admin/reports/",
        AdminReportsView.as_view(),
        name="admin-reports"
    ),

]