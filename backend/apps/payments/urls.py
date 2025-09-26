"""URLConf placeholder para el módulo de pagos (tenant)."""

from __future__ import annotations

from django.urls import path
from .views import PaymentsPlaceholderView

urlpatterns = [
    # GET /api/payments/
    path("", PaymentsPlaceholderView.as_view(), name="payments-root"),
]
