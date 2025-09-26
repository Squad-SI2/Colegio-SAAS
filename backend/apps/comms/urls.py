"""URLConf placeholder para el módulo de comunicaciones (tenant)."""

from __future__ import annotations

from django.urls import path
from .views import CommsPlaceholderView

urlpatterns = [
    # GET /api/comms/
    path("", CommsPlaceholderView.as_view(), name="comms-root"),
]
