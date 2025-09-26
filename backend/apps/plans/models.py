from __future__ import annotations

from django.db import models

class Plan(models.Model):
    PERIODICITY_MONTHLY = "MONTHLY"
    PERIODICITY_YEARLY = "YEARLY"
    PERIODICITY_CHOICES = [
        (PERIODICITY_MONTHLY, "Monthly"),
        (PERIODICITY_YEARLY, "Yearly"),
    ]

    code = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=120)
    periodicity = models.CharField(max_length=10, choices=PERIODICITY_CHOICES, default=PERIODICITY_MONTHLY)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    trial_days = models.PositiveIntegerField(default=14)
    limits = models.JSONField(default=dict, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "plan"

    def __str__(self) -> str:
        return f"{self.name} ({self.code})"
