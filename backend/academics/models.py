# backend/academics/models.py
from django.db import models

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
