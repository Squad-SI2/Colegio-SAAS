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
