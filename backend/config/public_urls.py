from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Documentación OpenAPI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
    # Endpoints que viven en el esquema PUBLIC
    path("api/", include("core.urls")),  # healthchecks públicos
    path("api/", include("accounts.urls")),  # JWT login
    path("api/", include("tenants.urls")),  # Plan y Tenant
]


# urlpatterns += [
#     path("api/whereami", whereami_public),  # <- SOLO en public_urls
# ]
