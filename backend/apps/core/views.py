from __future__ import annotations

from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import SchoolProfile, SchoolSettings
from .serializers import SchoolProfileSerializer, SchoolSettingsSerializer


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        # En Sprint 1: basta con autenticación; puedes reforzar con roles/claims más adelante
        return bool(request.user and request.user.is_authenticated)


class SchoolProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOwnerOrAdmin]
    serializer_class = SchoolProfileSerializer

    def get_object(self):
        obj, _ = SchoolProfile.objects.get_or_create(id=1, defaults={"name": "Mi Colegio"})
        return obj


class SchoolSettingsView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOwnerOrAdmin]
    serializer_class = SchoolSettingsSerializer

    def get_object(self):
        obj, _ = SchoolSettings.objects.get_or_create(id=1)
        return obj


class WizardCompleteView(generics.GenericAPIView):
    permission_classes = [IsOwnerOrAdmin]

    @transaction.atomic
    def post(self, request):
        settings_obj, _ = SchoolSettings.objects.get_or_create(id=1)
        settings_obj.wizard_completed = True
        settings_obj.save(update_fields=["wizard_completed"])
        return Response({"wizard_completed": True}, status=status.HTTP_200_OK)
