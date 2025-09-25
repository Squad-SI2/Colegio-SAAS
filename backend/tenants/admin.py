from django.contrib import admin
from .models import Plan, Client, Domain


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "period",
        "price",
        "currency",
        "max_users",
        "max_students",
        "created_at",
    )
    search_fields = ("name",)


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "schema_name",
        "legal_name",
        "code",
        "official_email",
        "is_active",
        "plan",
        "created_on",
    )
    search_fields = ("schema_name", "legal_name", "code")
    list_filter = ("is_active", "plan")


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ("id", "domain", "tenant", "is_primary")
    search_fields = ("domain",)
