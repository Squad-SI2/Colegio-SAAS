from __future__ import annotations

from rest_framework import viewsets, permissions
from .models import Plan
from .serializers import PlanSerializer

class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Listado y detalle de planes (público).
    """
    queryset = Plan.objects.filter(is_active=True).order_by("price")
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]
