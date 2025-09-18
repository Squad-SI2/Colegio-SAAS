# backend/academics/urls.py
from django.urls import path
from .views import EducationLevelListCreateView, EducationLevelDetailView

urlpatterns = [
    path("levels", EducationLevelListCreateView.as_view(), name="level_list_create"),
    path("levels/<int:pk>", EducationLevelDetailView.as_view(), name="level_detail"),
]
