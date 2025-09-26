from __future__ import annotations
from django.urls import path
from .views import SchoolProfileView, SchoolSettingsView, WizardCompleteView

urlpatterns = [
    path("profile/", SchoolProfileView.as_view(), name="school-profile"),
    path("settings/", SchoolSettingsView.as_view(), name="school-settings"),
    path("wizard/complete/", WizardCompleteView.as_view(), name="wizard-complete"),
]
