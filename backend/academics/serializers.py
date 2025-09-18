# backend/academics/serializers.py
from rest_framework import serializers
from .models import EducationLevel

class EducationLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationLevel
        fields = ["id", "name", "short_name", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
