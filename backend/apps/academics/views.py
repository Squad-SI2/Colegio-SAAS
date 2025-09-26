from __future__ import annotations

from rest_framework import viewsets, permissions
from .models import AcademicCycle, Level, Grade
from .serializers import AcademicCycleSerializer, LevelSerializer, GradeSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

class CycleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwnerOrAdmin]
    queryset = AcademicCycle.objects.all().order_by("-id")
    serializer_class = AcademicCycleSerializer

class LevelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwnerOrAdmin]
    queryset = Level.objects.all().order_by("name")
    serializer_class = LevelSerializer

class GradeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwnerOrAdmin]
    queryset = Grade.objects.select_related("level").all().order_by("level__name", "order")
    serializer_class = GradeSerializer
