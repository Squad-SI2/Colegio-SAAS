from django.urls import path
from .views import (
    PlanListCreateView,
    PlanDetailView,
    ClientCreateView,
    ClientDetailView,
    DomainCreateView,
    DomainListView,
)

urlpatterns = [
    path("plans", PlanListCreateView.as_view(), name="plan_create"),
    path("plans/<int:pk>", PlanDetailView.as_view(), name="plan_detail"),
    path("tenants", ClientCreateView.as_view(), name="tenant_create"),
    path("tenants/<int:pk>", ClientDetailView.as_view(), name="tenant_detail"),
    path("domains", DomainCreateView.as_view(), name="domain_create"),
    path("domains/list", DomainListView.as_view(), name="domain_list"),
]
