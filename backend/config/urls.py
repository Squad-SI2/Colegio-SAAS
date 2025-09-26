"""
URLConf para ESQUEMA DE TENANT (colegio).

Estas rutas se resuelven cuando el middleware de `django-tenants` determina
un tenant activo (p. ej. subdominio `colegio-x.localhost`).
"""

from __future__ import annotations
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("api/schema", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),

    path("api/health/", include("apps.platform.urls")),

    path("api/school/", include("apps.core.urls")),
    path("api/memberships/", include("apps.directory.urls")),
    path("api/academics/", include("apps.academics.urls")),
    # path("api/comms/", include("apps.comms.urls")),
    # path("api/payments/", include("apps.payments.urls")),
    path("api/tenant/", include("apps.tenants.urls_tenant")),
]
