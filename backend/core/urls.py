# backend/core/urls.py
from django.urls import path
from .views import health, tenant_health

urlpatterns = [
    path("health", health, name="public-health"),
    path("tenant/health", tenant_health, name="tenant-health"),
]
