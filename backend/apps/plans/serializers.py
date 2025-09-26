from __future__ import annotations

from rest_framework import serializers
from .models import Plan

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ["id", "code", "name", "periodicity", "price", "trial_days", "limits", "is_active"]
