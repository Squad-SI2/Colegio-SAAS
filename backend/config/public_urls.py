"""
URLConf del esquema PÚBLICO (plataforma).

Aquí deben vivir rutas que no dependen de un tenant activo:
- Salud/health, versión, landing pública (platform).
- Autenticación global (signup/login/refresh) (accounts).
- Catálogo de planes (plans) y suscripciones (billing).
- Alta de tenants y dominios (creación de colegios) (tenants).
- Admin de Django (útil en desarrollo).

Importante:
NO incluir urls de apps de tenant (core, directory, academics, comms, payments).
Esas están en config.urls y se sirven SOLO bajo un subdominio de tenant.
"""

from __future__ import annotations
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/schema", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),

    path("api/health/", include("apps.platform.urls")),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/plans/", include("apps.plans.urls")),
    path("api/subscriptions/", include("apps.billing.urls")),
    path("api/tenants/", include("apps.tenants.urls")),
]
