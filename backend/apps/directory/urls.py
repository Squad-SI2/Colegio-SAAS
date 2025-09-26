from django.urls import path
from .views import MembershipListCreateView, MembershipDetailView

urlpatterns = [
    path("", MembershipListCreateView.as_view(), name="membership-list-create"),
    path("<int:pk>", MembershipDetailView.as_view(), name="membership-detail"),
]
