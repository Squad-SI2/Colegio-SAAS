from django.urls import path
from .views import TenantInfoView

app_name = "tenants_tenant"

urlpatterns = [
    path("me/", TenantInfoView.as_view(), name="tenant-me"),
]
