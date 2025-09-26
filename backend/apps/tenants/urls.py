from __future__ import annotations

from django.urls import path
from .views import CheckSubdomainView, TenantCreateView

app_name = "tenants"

urlpatterns = [
    path("", TenantCreateView.as_view(), name="create"),
    path("check-subdomain", CheckSubdomainView.as_view(), name="check-subdomain"),
]
