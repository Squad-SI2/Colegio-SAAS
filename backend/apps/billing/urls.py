from django.urls import path
from .views import (
    SubscriptionCreateView,
    MySubscriptionsListView,
    SubscriptionDetailView,
    ActivateTrialView,
    SetSubscriptionStatusView,
)

urlpatterns = [
    path("", SubscriptionCreateView.as_view(), name="subscription-create"),
    path("mine", MySubscriptionsListView.as_view(), name="subscription-mine"),
    path("<int:pk>", SubscriptionDetailView.as_view(), name="subscription-detail"),
    path("<int:pk>/activate_trial", ActivateTrialView.as_view(), name="subscription-activate-trial"),
    path("<int:pk>/set_status", SetSubscriptionStatusView.as_view(), name="subscription-set-status"),
]
