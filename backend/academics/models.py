# backend/academics/models.py
from django.db import models
from django.core.exceptions import ValidationError


class EducationLevel(models.Model):
    """
    Catálogo por tenant: Nivel educativo (Inicial, Primaria, Secundaria, etc.)
    Vive en el esquema del colegio (TENANT_APPS).
    """

    name = models.CharField(max_length=80, unique=True)  # único por tenant
    short_name = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)

    # housekeeping
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class AcademicPeriod(models.Model):
    """
    Período académico (año lectivo, semestre, trimestre, etc.)
    Vive en el esquema del colegio (TENANT_APPS).
    """

    name = models.CharField(max_length=80, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date", "name"]

    def clean(self):
        # Validación simple: fecha fin >= inicio
        if self.end_date < self.start_date:
            raise ValidationError("end_date no puede ser menor que start_date")

    def __str__(self):
        return self.name


class Grade(models.Model):
    """Grado/Curso dentro de un nivel educativo (1ro, 2do, etc.)."""

    level = models.ForeignKey(
        "academics.EducationLevel", on_delete=models.PROTECT, related_name="grades"
    )
    name = models.CharField(max_length=80)  # "Primero", "Segundo", etc.
    order = models.PositiveIntegerField(default=1)  # para ordenar
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["level__name", "order", "name"]
        unique_together = [("level", "name")]
        indexes = [models.Index(fields=["level", "order"])]

    def __str__(self):
        return f"{self.level.short_name or self.level.name} - {self.name}"


class Section(models.Model):
    """Paralelo/sección de un grado (A, B, C...)."""

    grade = models.ForeignKey(
        "academics.Grade", on_delete=models.PROTECT, related_name="sections"
    )
    name = models.CharField(max_length=20)  # "A", "B", "C"...
    capacity = models.PositiveIntegerField(default=30)  # cupo recomendado
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["grade__level__name", "grade__order", "grade__name", "name"]
        unique_together = [
            ("grade", "name")
        ]  # no repetir "A" dos veces en el mismo grado
        indexes = [
            models.Index(fields=["grade", "name"]),
        ]

    def __str__(self):
        return f"{self.grade} - {self.name}"


class Subject(models.Model):
    """
    Materia/Asignatura. Para Sprint 1 la ligamos al nivel educativo.
    Vive en el esquema del colegio (TENANT_APPS).
    """

    level = models.ForeignKey(
        "academics.EducationLevel", on_delete=models.PROTECT, related_name="subjects"
    )
    name = models.CharField(max_length=120)
    short_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)

    # housekeeping
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["level__name", "name"]
        unique_together = [("level", "name")]  # evita duplicados por nivel
        indexes = [
            models.Index(fields=["level", "name"]),
        ]

    def __str__(self):
        return f"{self.level.short_name or self.level.name} - {self.name}"


class Person(models.Model):
    """
    Datos base de una persona (comunes a estudiante, docente, apoderado).
    Vive en el esquema del colegio (TENANT_APPS).
    """

    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=120)
    doc_type = models.CharField(max_length=20, blank=True)  # CI, PAS, etc.
    doc_number = models.CharField(max_length=40, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=255, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["last_name", "first_name"]
        indexes = [
            models.Index(fields=["last_name", "first_name"]),
            models.Index(fields=["doc_number"]),
            models.Index(fields=["email"]),
        ]

    def __str__(self):
        return f"{self.last_name}, {self.first_name}".strip()


class Student(models.Model):
    """
    Rol estudiante: referencia a Person + campos propios.
    Vive en el esquema del colegio (TENANT_APPS).
    """

    person = models.OneToOneField(
        "academics.Person", on_delete=models.PROTECT, related_name="student"
    )
    code = models.CharField(max_length=30, unique=True)  # código interno del alumno
    admission_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["code"]
        indexes = [
            models.Index(fields=["code"]),
        ]

    def __str__(self):
        return f"{self.code} - {self.person}"


class Enrollment(models.Model):
    """
    Matrícula del estudiante en un período, grado y sección.
    Reglas base:
    - Un estudiante no puede tener dos matrículas en el mismo período.
    """

    STATUS_CHOICES = [
        ("ACTIVE", "Activa"),
        ("WITHDRAWN", "Retiro"),
        ("TRANSFERRED", "Transferido"),
        ("FINISHED", "Finalizada"),
    ]

    student = models.ForeignKey(
        "academics.Student", on_delete=models.PROTECT, related_name="enrollments"
    )
    period = models.ForeignKey(
        "academics.AcademicPeriod", on_delete=models.PROTECT, related_name="enrollments"
    )
    grade = models.ForeignKey(
        "academics.Grade", on_delete=models.PROTECT, related_name="enrollments"
    )
    section = models.ForeignKey(
        "academics.Section", on_delete=models.PROTECT, related_name="enrollments"
    )

    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="ACTIVE")
    enroll_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = [("student", "period")]  # 1 matrícula por período
        indexes = [
            models.Index(fields=["student", "period"]),
            models.Index(fields=["grade", "section"]),
        ]

    def __str__(self):
        return f"{self.student.code} @ {self.period.name} - {self.grade.name}/{self.section.name}"
