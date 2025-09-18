# backend/academics/views.py
from rest_framework import generics, permissions
from .models import EducationLevel, AcademicPeriod
from .serializers import EducationLevelSerializer, AcademicPeriodSerializer


class IsStaffUser(permissions.BasePermission):
    """Solo staff puede escribir; lectura cualquiera autenticado."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True  # lectura para autenticados
        return bool(request.user.is_staff)  # escritura solo staff

class EducationLevelListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/levels
    POST /api/levels
    """
    queryset = EducationLevel.objects.all()
    serializer_class = EducationLevelSerializer
    permission_classes = [IsStaffUser]

class EducationLevelDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/levels/<id>
    PATCH  /api/levels/<id>
    DELETE /api/levels/<id>
    """
    queryset = EducationLevel.objects.all()
    serializer_class = EducationLevelSerializer
    permission_classes = [IsStaffUser]


class AcademicPeriodListCreateView(generics.ListCreateAPIView):
    queryset = AcademicPeriod.objects.all()
    serializer_class = AcademicPeriodSerializer
    permission_classes = [IsStaffUser]

class AcademicPeriodDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AcademicPeriod.objects.all()
    serializer_class = AcademicPeriodSerializer
    permission_classes = [IsStaffUser]
