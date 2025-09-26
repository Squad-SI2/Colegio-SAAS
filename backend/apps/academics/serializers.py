from __future__ import annotations

from rest_framework import serializers
from .models import AcademicCycle, Level, Grade

class AcademicCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicCycle
        fields = ["id", "name", "is_active"]

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ["id", "name"]

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ["id", "level", "name", "order"]
