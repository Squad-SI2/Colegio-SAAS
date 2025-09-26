from __future__ import annotations
from django.contrib import admin
from .models import Plan

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "periodicity", "price", "trial_days", "is_active")
    list_filter = ("periodicity", "is_active")
    search_fields = ("code", "name")
