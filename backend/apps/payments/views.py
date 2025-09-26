"""Vistas placeholder para el módulo de pagos (tenant)."""

from __future__ import annotations

from django.http import JsonResponse
from django.views import View

class PaymentsPlaceholderView(View):
    """Endpoint temporal para evitar errores de import hasta implementar el módulo."""
    def get(self, request, *args, **kwargs):
        return JsonResponse({"module": "payments", "status": "placeholder"}, status=200)
