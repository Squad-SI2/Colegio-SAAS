# backend/academics/urls.py
from django.urls import path
from .views import EducationLevelListCreateView, EducationLevelDetailView,AcademicPeriodListCreateView, AcademicPeriodDetailView

urlpatterns = [
    # Education Levels
    path("levels", EducationLevelListCreateView.as_view(), name="level_list_create"),
    path("levels/<int:pk>", EducationLevelDetailView.as_view(), name="level_detail"),

    # Academic Periods
    path("periods", AcademicPeriodListCreateView.as_view(), name="period_list_create"),
    path("periods/<int:pk>", AcademicPeriodDetailView.as_view(), name="period_detail"),
]
