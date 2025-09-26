from __future__ import annotations

from django.db import models

class SchoolProfile(models.Model):
    name = models.CharField(max_length=200)
    logo = models.URLField(blank=True, default="")
    contact_email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=50, blank=True, default="")
    address = models.CharField(max_length=250, blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "school_profile"


class SchoolSettings(models.Model):
    timezone = models.CharField(max_length=64, default="America/La_Paz")
    current_cycle = models.ForeignKey("academics.AcademicCycle", on_delete=models.SET_NULL, null=True, blank=True)
    wizard_completed = models.BooleanField(default=False)

    class Meta:
        db_table = "school_settings"
