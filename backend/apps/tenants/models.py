from __future__ import annotations

from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class Client(TenantMixin):
    """
    Colegio (tenant). Vive en esquema propio.
    """
    name = models.CharField(max_length=200)
    created_by_user_id = models.IntegerField(null=True, blank=True)  # referencia simple al user (global)
    created_at = models.DateTimeField(auto_now_add=True)

    auto_create_schema = True

    class Meta:
        db_table = "client"

    def __str__(self) -> str:
        return f"{self.name} ({self.schema_name})"


class Domain(DomainMixin):
    """
    Dominio/subdominio asociado al tenant.
    """
    pass
