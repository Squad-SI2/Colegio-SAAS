from __future__ import annotations

from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Subscription
from .serializers import SubscriptionCreateSerializer, SubscriptionDetailSerializer

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


class SubscriptionCreateView(generics.CreateAPIView):
    serializer_class = SubscriptionCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class MySubscriptionsListView(generics.ListAPIView):
    serializer_class = SubscriptionDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(owner=self.request.user).order_by("-created_at")


class SubscriptionDetailView(generics.RetrieveAPIView):
    serializer_class = SubscriptionDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Subscription.objects.all()


class ActivateTrialView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk: int):
        try:
            sub = Subscription.objects.get(pk=pk, owner=request.user)
        except Subscription.DoesNotExist:
            return Response({"detail": "Subscription not found."}, status=status.HTTP_404_NOT_FOUND)
        trial_days = getattr(settings, "SUBSCRIPTION_TRIAL_DAYS", 14)
        sub.activate_trial(trial_days=trial_days)
        return Response(SubscriptionDetailSerializer(sub).data, status=200)


class SetSubscriptionStatusView(APIView):
    """
    Solo SUPERADMIN: cambiar estado (ACTIVE/SUSPENDED/EXPIRED).
    """
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk: int):
        new_status = request.data.get("status")
        if new_status not in {s for s, _ in Subscription.STATUS_CHOICES}:
            return Response({"detail": "Estado inválido"}, status=400)
        sub = Subscription.objects.get(pk=pk)
        sub.status = new_status
        sub.save(update_fields=["status"])
        return Response(SubscriptionDetailSerializer(sub).data, status=200)
