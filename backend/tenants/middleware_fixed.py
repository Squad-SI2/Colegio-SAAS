from django.conf import settings
from django.db import connection
from django.http import HttpResponseServerError, HttpResponseBadRequest
from django_tenants.utils import get_tenant_model

PUBLIC_PATH_PREFIXES = (
    "/admin",  # admin de Django
    "/api/auth",  # JWT (token/refresh)
    "/api/health",  # health público
    "/api/schema",
    "/api/docs",
    "/api/plans",  # crear planes desde public
    "/api/tenants",  # crear Client (tenant) desde public
)


def _pick_default_tenant():
    Tenant = get_tenant_model()
    schema = getattr(settings, "DEFAULT_TENANT_SCHEMA", None)
    if schema:
        try:
            return Tenant.objects.get(schema_name=schema)
        except Tenant.DoesNotExist:
            return None
    return Tenant.objects.filter(is_active=True).order_by("id").first()


class FixedTenantDevMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        Tenant = get_tenant_model()

        # 1) Si aún no hay tenants, o la ruta es pública -> no fijes tenant (usa 'public')
        if not Tenant.objects.exists() or request.path.startswith(PUBLIC_PATH_PREFIXES):
            return self.get_response(request)

        # 2) Override opcional ?__tenant=... (solo DEBUG)
        if settings.DEBUG:
            override = request.GET.get("__tenant")
            if override:
                try:
                    tenant = Tenant.objects.get(schema_name=override)
                except Tenant.DoesNotExist:
                    return HttpResponseBadRequest(f"Tenant '{override}' no existe")
                request.tenant = tenant
                connection.set_tenant(tenant)
                try:
                    return self.get_response(request)
                finally:
                    connection.set_schema_to_public()

        tenant = _pick_default_tenant()
        if not tenant:
            return HttpResponseServerError(
                "No hay tenant por defecto. Define DEFAULT_TENANT_SCHEMA o crea un Client activo."
            )

        request.tenant = tenant
        connection.set_tenant(tenant)
        try:
            return self.get_response(request)
        finally:
            connection.set_schema_to_public()
