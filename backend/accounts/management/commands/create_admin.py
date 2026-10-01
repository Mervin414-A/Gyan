import os

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create the initial admin user if one does not exist."

    def handle(self, *args, **options):

        User = get_user_model()

        username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")
        employee_id = os.environ.get("DJANGO_SUPERUSER_EMPLOYEE_ID")

        if not all([
            username,
            email,
            password,
            employee_id
        ]):
            self.stdout.write(
                self.style.WARNING(
                    "Admin environment variables are not configured."
                )
            )
            return

        if User.objects.filter(role="ADMIN").exists():
            self.stdout.write(
                self.style.WARNING(
                    "Admin already exists. Nothing to do."
                )
            )
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(
                    "Username already exists. Nothing to do."
                )
            )
            return

        admin = User(
            username=username,
            email=email,
            employee_id=employee_id,
            role="ADMIN",
            is_staff=True,
            is_superuser=True,
            is_active=True,
        )

        admin.set_password(password)
        admin.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Admin '{username}' created successfully."
            )
        )