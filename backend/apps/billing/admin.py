from __future__ import annotations
from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "id", "plan", "owner", "tenant", "status",
        "start_at", "trial_until", "end_at", "created_at",
    )
    list_filter = ("status", "plan")
    search_fields = ("owner__email", "tenant__schema_name")
    # Evitar dependencia con ClientAdmin por ahora:
    autocomplete_fields = ("plan", "owner")
    # Si necesitas seleccionar tenant sin autocomplete:
    raw_id_fields = ("tenant",)
