"""
URL configuration for config project.
Adaptado a arquitectura SaaS con Django Tenants + DRF.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Documentación automática (OpenAPI/Swagger)
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),

    # Rutas de las apps
    path("api/", include("accounts.urls")),   # login JWT, gestión de usuarios
    path("api/", include("tenants.urls")),    # planes, tenants/colegios
    path("api/", include("academics.urls")),  # estudiantes, calificaciones, asistencia
    path("api/", include("comms.urls")),      # mensajería básica
    path("api/", include("payments.urls")),   # pagos internos del colegio
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

