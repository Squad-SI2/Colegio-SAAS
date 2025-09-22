# backend/academics/views.py
from rest_framework import generics, permissions
from .models import (EducationLevel, AcademicPeriod, Grade, Section, Subject, Person, Student,
                     Enrollment)
from .serializers import (EducationLevelSerializer, AcademicPeriodSerializer, GradeSerializer,
                          SectionSerializer, SubjectSerializer, PersonSerializer, StudentSerializer,
                          EnrollmentSerializer)


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

class GradeListCreateView(generics.ListCreateAPIView):
    queryset = Grade.objects.select_related("level").all()
    serializer_class = GradeSerializer
    permission_classes = [IsStaffUser]

    def get_queryset(self):
        qs = super().get_queryset()
        level_id = self.request.query_params.get("level")
        if level_id:
            qs = qs.filter(level_id=level_id)
        return qs

class GradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Grade.objects.select_related("level").all()
    serializer_class = GradeSerializer
    permission_classes = [IsStaffUser]

class SectionListCreateView(generics.ListCreateAPIView):
    queryset = Section.objects.select_related("grade", "grade__level").all()
    serializer_class = SectionSerializer
    permission_classes = [IsStaffUser]

    # Filtros opcionales: ?grade=<id>  y/o  ?level=<id>
    def get_queryset(self):
        qs = super().get_queryset()
        grade_id = self.request.query_params.get("grade")
        level_id = self.request.query_params.get("level")
        if grade_id:
            qs = qs.filter(grade_id=grade_id)
        if level_id:
            qs = qs.filter(grade__level_id=level_id)
        return qs


class SectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Section.objects.select_related("grade", "grade__level").all()
    serializer_class = SectionSerializer
    permission_classes = [IsStaffUser]

class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.select_related("level").all()
    serializer_class = SubjectSerializer
    permission_classes = [IsStaffUser]

    # Filtros: ?level=<id>  y ?q=<texto>
    def get_queryset(self):
        qs = super().get_queryset()
        level_id = self.request.query_params.get("level")
        q = self.request.query_params.get("q")
        if level_id:
            qs = qs.filter(level_id=level_id)
        if q:
            qs = qs.filter(name__icontains=q.strip())
        return qs


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.select_related("level").all()
    serializer_class = SubjectSerializer
    permission_classes = [IsStaffUser]


# --- Persons ---
class PersonListCreateView(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsStaffUser]

    # Filtros básicos: ?q=  (busca en nombre/apellido/doc/email)
    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.query_params.get("q")
        if q:
            q = q.strip()
            qs = qs.filter(
                models.Q(first_name__icontains=q) |
                models.Q(last_name__icontains=q) |
                models.Q(doc_number__icontains=q) |
                models.Q(email__icontains=q)
            )
        return qs


class PersonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsStaffUser]


# --- Students ---
class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.select_related("person").all()
    serializer_class = StudentSerializer
    permission_classes = [IsStaffUser]

    # Filtro: ?q= (por code o por nombre de persona)
    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.query_params.get("q")
        if q:
            q = q.strip()
            qs = qs.filter(
                models.Q(code__icontains=q) |
                models.Q(person__first_name__icontains=q) |
                models.Q(person__last_name__icontains=q)
            )
        return qs


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.select_related("person").all()
    serializer_class = StudentSerializer
    permission_classes = [IsStaffUser]

class EnrollmentListCreateView(generics.ListCreateAPIView):
    queryset = (Enrollment.objects
                .select_related("student", "student__person", "period", "grade", "section")
                .all())
    serializer_class = EnrollmentSerializer
    permission_classes = [IsStaffUser]

    # Filtros: ?student=<id>  ?period=<id>  ?grade=<id>  ?section=<id>  ?status=<str>  ?q=<texto>
    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params
        if p.get("student"):
            qs = qs.filter(student_id=p["student"])
        if p.get("period"):
            qs = qs.filter(period_id=p["period"])
        if p.get("grade"):
            qs = qs.filter(grade_id=p["grade"])
        if p.get("section"):
            qs = qs.filter(section_id=p["section"])
        if p.get("status"):
            qs = qs.filter(status=p["status"])
        q = p.get("q")
        if q:
            q = q.strip()
            qs = qs.filter(
                models.Q(student__code__icontains=q) |
                models.Q(student__person__first_name__icontains=q) |
                models.Q(student__person__last_name__icontains=q)
            )
        return qs


class EnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = (Enrollment.objects
                .select_related("student", "student__person", "period", "grade", "section")
                .all())
    serializer_class = EnrollmentSerializer
    permission_classes = [IsStaffUser]