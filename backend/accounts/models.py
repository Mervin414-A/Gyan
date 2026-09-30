from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = (
        ('EMPLOYEE', 'Employee'),
        ('ADMIN', 'Admin'),
    )

    employee_id = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True
    )

    email = models.EmailField(
        unique=True
    )

    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='EMPLOYEE'
    )

    def __str__(self):
        return f"{self.employee_id} - {self.username}"
