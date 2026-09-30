from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.views import IsAdminUser
from .models import Notification


class MyNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(
            user=request.user
        ).order_by('-created_at')

        data = []

        for notification in notifications:
            data.append({
                'id': notification.id,
                'notification_type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'is_read': notification.is_read,
                'created_at': notification.created_at,
            })

        return Response(
            {
                'count': notifications.count(),
                'notifications': data
            },
            status=status.HTTP_200_OK
        )


class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):

        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
        except Notification.DoesNotExist:
            return Response(
                {'message': 'Notification not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        notification.is_read = True
        notification.save()

        return Response(
            {
                'message': 'Notification marked as read.'
            },
            status=status.HTTP_200_OK
        )


class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)

        return Response(
            {
                'message': 'All notifications marked as read.'
            },
            status=status.HTTP_200_OK
        )

class AdminNotificationsView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        notifications = Notification.objects.all().order_by('-created_at')

        data = []

        for notification in notifications:

            data.append({
                'id': notification.id,
                'user_id': notification.user.id,
                'username': notification.user.username,
                'employee_id': notification.user.employee_id,
                'notification_type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'is_read': notification.is_read,
                'created_at': notification.created_at,
            })

        return Response(
            {
                'count': notifications.count(),
                'notifications': data
            },
            status=status.HTTP_200_OK
        )

class AdminMarkNotificationReadView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, notification_id):

        try:
            notification = Notification.objects.get(
                id=notification_id
            )
        except Notification.DoesNotExist:
            return Response(
                {
                    'message': 'Notification not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        notification.is_read = True
        notification.save()

        return Response(
            {
                'message': 'Notification marked as read.'
            },
            status=status.HTTP_200_OK
        )

class AdminMarkAllNotificationsReadView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request):

        updated_count = Notification.objects.filter(
            is_read=False
        ).update(
            is_read=True
        )

        return Response(
            {
                'message': 'All notifications marked as read.',
                'updated_count': updated_count
            },
            status=status.HTTP_200_OK
        )