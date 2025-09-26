from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import SchoolMembership

User = get_user_model()

class SchoolMembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = SchoolMembership
        fields = ["id", "user", "user_email", "role", "is_active", "created_at"]


class SchoolMembershipCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolMembership
        fields = ["user", "role"]
