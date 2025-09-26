from __future__ import annotations

from django.conf import settings
from django.db import models

class SchoolMembership(models.Model):
    ROLE_OWNER = "OWNER"
    ROLE_SCHOOL_ADMIN = "SCHOOL_ADMIN"
    ROLE_TEACHER = "TEACHER"
    ROLE_STUDENT = "STUDENT"
    ROLE_PARENT = "PARENT"

    ROLE_CHOICES = [
        (ROLE_OWNER, "Owner"),
        (ROLE_SCHOOL_ADMIN, "School Admin"),
        (ROLE_TEACHER, "Teacher"),
        (ROLE_STUDENT, "Student"),
        (ROLE_PARENT, "Parent"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="school_memberships")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "school_membership"
        unique_together = [("user", "role")]
