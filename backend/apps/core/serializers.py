from __future__ import annotations

from rest_framework import serializers
from .models import SchoolProfile, SchoolSettings

class SchoolProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolProfile
        fields = ["id", "name", "logo", "contact_email", "phone", "address", "updated_at"]

class SchoolSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolSettings
        fields = ["id", "timezone", "current_cycle", "wizard_completed"]
