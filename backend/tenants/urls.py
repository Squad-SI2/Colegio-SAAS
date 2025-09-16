from django.urls import path
from .views import PlanCreateView, ClientCreateView, ClientDetailView

urlpatterns = [
    path("plans", PlanCreateView.as_view(), name="plan_create"),
    path("tenants", ClientCreateView.as_view(), name="tenant_create"),
    path("tenants/<int:pk>", ClientDetailView.as_view(), name="tenant_detail"),
]
