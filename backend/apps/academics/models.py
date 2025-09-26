from __future__ import annotations

from django.db import models

class AcademicCycle(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Ej: 2025
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "academic_cycle"

    def __str__(self) -> str:
        return self.name


class Level(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Inicial/Primaria/Secundaria

    class Meta:
        db_table = "level"

    def __str__(self) -> str:
        return self.name


class Grade(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name="grades")
    name = models.CharField(max_length=50)  # 1°, 2°, ...
    order = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "grade"
        unique_together = [("level", "name")]
        ordering = ["level_id", "order"]

    def __str__(self) -> str:
        return f"{self.level.name} - {self.name}"
