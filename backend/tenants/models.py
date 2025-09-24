from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class Plan(models.Model):
    name = models.CharField(max_length=50)
    period = models.CharField(
        max_length=1, choices=[("M", "Mensual"), ("Y", "Anual")], default="M"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=8, default="BOB")
    max_users = models.IntegerField(default=50)
    max_students = models.IntegerField(default=1000)
    features = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.name}({self.period})"


class Client(TenantMixin):  # Colegio / Tenant
    schema_name = models.CharField(
        max_length=63, unique=True
    )  # requerido por django-tenants
    legal_name = models.CharField(max_length=150)
    code = models.CharField(max_length=32, unique=True)
    official_email = models.EmailField()
    official_phone = models.CharField(max_length=32, blank=True)
    address = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    plan = models.ForeignKey(Plan, null=True, blank=True, on_delete=models.SET_NULL)
    created_on = models.DateField(auto_now_add=True)

    # crea automáticamente el schema cuando guardas
    auto_create_schema = True

    def __str__(self) -> str:
        return f"{self.legal_name} [{self.schema_name}]"


class Domain(DomainMixin):
    # fields: domain (str), tenant (FK a Client), is_primary (bool)
    def __str__(self) -> str:
        return self.domain
