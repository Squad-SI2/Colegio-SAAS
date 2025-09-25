# backend/academics/urls.py
from django.urls import path
from .views import (
    EducationLevelListCreateView,
    EducationLevelDetailView,
    AcademicPeriodListCreateView,
    AcademicPeriodDetailView,
    GradeListCreateView,
    GradeDetailView,
    SectionListCreateView,
    SectionDetailView,
    SubjectListCreateView,
    SubjectDetailView,
    PersonListCreateView,
    PersonDetailView,
    StudentListCreateView,
    StudentDetailView,
    EnrollmentListCreateView,
    EnrollmentDetailView,
)

urlpatterns = [
    # Education Levels
    path("levels", EducationLevelListCreateView.as_view(), name="level_list_create"),
    path("levels/<int:pk>", EducationLevelDetailView.as_view(), name="level_detail"),
    # Academic Periods
    path("periods", AcademicPeriodListCreateView.as_view(), name="period_list_create"),
    path("periods/<int:pk>", AcademicPeriodDetailView.as_view(), name="period_detail"),
    # Grades
    path("grades", GradeListCreateView.as_view()),
    path("grades/<int:pk>", GradeDetailView.as_view()),
    # Sections
    path("sections", SectionListCreateView.as_view()),
    path("sections/<int:pk>", SectionDetailView.as_view()),
    # Subjects
    path("subjects", SubjectListCreateView.as_view()),
    path("subjects/<int:pk>", SubjectDetailView.as_view()),
    # Persons
    path("persons", PersonListCreateView.as_view()),
    path("persons/<int:pk>", PersonDetailView.as_view()),
    # Students
    path("students", StudentListCreateView.as_view()),
    path("students/<int:pk>", StudentDetailView.as_view()),
    # Enrollments
    path("enrollments", EnrollmentListCreateView.as_view()),
    path("enrollments/<int:pk>", EnrollmentDetailView.as_view()),
]
