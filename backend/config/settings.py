"""
Django settings para un SaaS multi-tenant con django-tenants, DRF, JWT y Spectacular.

- Multi-tenancy por ESQUEMA (PostgreSQL) usando `django-tenants`.
- Separación de apps públicas (plataforma) vs. apps por tenant (colegio).
- Variables de entorno con `django-environ`.
- CORS/CSRF listo para desarrollo; restringir en producción.
- Enrutado por SUBDOMINIOS por defecto (opcional SUBCARPETA en dev con TENANT_ROUTING=subfolder).
"""

from __future__ import annotations

from datetime import timedelta
from pathlib import Path
import logging
import environ

# ------------------------------------------------------------------------------
# BASE / ENV
# ------------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent  # .../backend/config
ROOT_DIR = BASE_DIR.parent                         # .../backend

env = environ.Env(DEBUG=(bool, False))
# En dev, el .env suele vivir en la raíz del repo (junto a docker-compose)
environ.Env.read_env(str(ROOT_DIR / ".env"))

DEBUG: bool = env.bool("DEBUG", default=True)
SECRET_KEY: str = env("SECRET_KEY", default="change-me-in-.env")

# Hosts permitidos (añadimos comodines útiles en dev)
ALLOWED_HOSTS: list[str] = [
    h.strip()
    for h in env("ALLOWED_HOSTS", default="localhost,127.0.0.1,0.0.0.0").split(",")
    if h.strip()
]
ALLOWED_HOSTS += [".nip.io", ".sslip.io", ".localtest.me"]

# Idioma / zona horaria
LANGUAGE_CODE: str = env("LANGUAGE_CODE", default="es")
TIME_ZONE: str = env("TIME_ZONE", default="America/La_Paz")
USE_I18N: bool = True
USE_TZ: bool = True

# ------------------------------------------------------------------------------
# APPS (orden correcto para django-tenants)
#   Regla: `django_tenants` debe estar en SHARED y antes que contenttypes.
# ------------------------------------------------------------------------------
DJANGO_CONTRIB = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_SHARED = [
    # OJO: NO incluir `django_tenants` aquí para evitar duplicados.
    "rest_framework",
    "drf_spectacular",
    "corsheaders",
    "whitenoise.runserver_nostatic",
]

# Apps públicas (viven en esquema public)
SHARED_APPS = [
    "django_tenants",  # << debe ir aquí y solo aquí
    *DJANGO_CONTRIB,
    *THIRD_PARTY_SHARED,

    # Apps del proyecto (públicas)
    "apps.accounts",   # Usuario global + auth
    "apps.tenants",    # Client/Tenant, Domain
    "apps.plans",      # Catálogo de planes/features
    "apps.billing",    # Subscription
    "apps.platform",   # Health/landing público
]

# Apps por tenant (viven por esquema)
TENANT_APPS = [
    "apps.core",       # SchoolProfile/Settings (wizard)
    "apps.directory",  # SchoolMembership (User↔Tenant + rol)
    "apps.academics",  # Ciclos/Niveles/Grados
    # "apps.comms",    # (futuro)
    # "apps.payments", # (futuro)
]

INSTALLED_APPS = SHARED_APPS + TENANT_APPS

# ------------------------------------------------------------------------------
# MULTI-TENANT: modelos y URLConf
# ------------------------------------------------------------------------------
TENANT_MODEL = "tenants.Client"
TENANT_DOMAIN_MODEL = "tenants.Domain"
PUBLIC_SCHEMA_NAME = "public"

# URLConf cuando NO hay tenant (esquema público)
PUBLIC_SCHEMA_URLCONF = "config.public_urls"
# URLConf cuando SÍ hay tenant (subdominio activo o subcarpeta resuelta)
ROOT_URLCONF = "config.urls"

# Fallback: si no hay tenant para el host, servimos público (útil en dev)
TENANT_NOT_FOUND_EXCEPTION = False
SHOW_PUBLIC_IF_NO_TENANT_FOUND = True
DATABASE_ROUTERS = ("django_tenants.routers.TenantSyncRouter",)

# ------------------------------------------------------------------------------
# ROUTING: subdominio (prod) o subcarpeta (dev) controlado por .env
#   TENANT_ROUTING = "subdomain" | "subfolder"
#   Si usas subcarpeta: las URLs serán /<prefix>/<schema>/...
# ------------------------------------------------------------------------------
TENANT_ROUTING = env("TENANT_ROUTING", default="subdomain")
TENANT_SUBFOLDER_PREFIX = env("TENANT_SUBFOLDER_PREFIX", default="t")

MIDDLEWARE = [
    # El primer middleware se decide según TENANT_ROUTING (se inserta abajo)
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if TENANT_ROUTING == "subfolder":
    # /t/<schema>/... ideal en local para evitar problemas DNS
    MIDDLEWARE.insert(0, "django_tenants.middleware.subfolder.SubfolderMiddleware")
else:
    # <schema>.dominio  (producción / subdominios reales o nip.io en dev)
    MIDDLEWARE.insert(0, "django_tenants.middleware.main.TenantMainMiddleware")

# ------------------------------------------------------------------------------
# Bases de datos (PostgreSQL con backend de django-tenants)
# ------------------------------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django_tenants.postgresql_backend",
        "NAME": env("POSTGRES_DB", default="colegio"),
        "USER": env("POSTGRES_USER", default="postgres"),
        "PASSWORD": env("POSTGRES_PASSWORD", default="postgres"),
        "HOST": env("POSTGRES_HOST", default="localhost"),
        "PORT": env("POSTGRES_PORT", default="5432"),
        "CONN_MAX_AGE": env.int("DB_CONN_MAX_AGE", default=60),
        "ATOMIC_REQUESTS": True,
    }
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
APPEND_SLASH = True

# ------------------------------------------------------------------------------
# Archivos estáticos y media
# ------------------------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = str(ROOT_DIR / "staticfiles")
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = str(ROOT_DIR / "media")

# ------------------------------------------------------------------------------
# Plantillas
# ------------------------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [str(ROOT_DIR / "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ------------------------------------------------------------------------------
# DRF / JWT / OpenAPI
# ------------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "UNAUTHENTICATED_USER": None,  # evita instanciar AnonymousUser innecesariamente
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=env.int("JWT_ACCESS_MINUTES", default=60)),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=env.int("JWT_REFRESH_DAYS", default=7)),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "SIGNING_KEY": SECRET_KEY,
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Colegio SaaS API",
    "DESCRIPTION": "API multi-tenant para gestión de colegios (plataforma + tenants).",
    "VERSION": env("APP_VERSION", default="0.1.0"),
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_PATH_PREFIX": r"/api",
    "COMPONENT_SPLIT_REQUEST": True,
}

# ------------------------------------------------------------------------------
# CORS / CSRF (en desarrollo; restringir en producción)
# ------------------------------------------------------------------------------
# Permisivo por defecto en dev
if env.bool("CORS_ALLOW_ALL_ORIGINS", default=True):
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = [
        o.strip() for o in env("CORS_ALLOWED_ORIGINS", default="").split(",") if o.strip()
    ]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    o.strip() for o in env("CSRF_TRUSTED_ORIGINS", default="http://localhost:5173").split(",") if o.strip()
]

# ------------------------------------------------------------------------------
# Autenticación / Usuario
# ------------------------------------------------------------------------------
# MUY IMPORTANTE: usar SIEMPRE el modelo de usuario personalizado
AUTH_USER_MODEL = "accounts.User"

# ------------------------------------------------------------------------------
# Parámetros SaaS (helpers de entorno)
# ------------------------------------------------------------------------------
PUBLIC_DOMAIN_SUFFIX = env("PUBLIC_DOMAIN_SUFFIX", default=".127.0.0.1.nip.io")
SUBSCRIPTION_TRIAL_DAYS = env.int("SUBSCRIPTION_TRIAL_DAYS", default=14)
PLATFORM_BASE_URL = env("PLATFORM_BASE_URL", default="http://localhost:8000")

# Dominios de ayuda para dev/prod (opcional)
DEV_WILDCARD_DOMAIN = env("DEV_WILDCARD_DOMAIN", default=None)  # p.ej. 127.0.0.1.nip.io
PROD_BASE_DOMAIN = env("PROD_BASE_DOMAIN", default=None)        # p.ej. midominio.com
BACKEND_PUBLIC_PORT = env.int("BACKEND_PUBLIC_PORT", default=8000)

# ------------------------------------------------------------------------------
# Logging básico (útil para Docker)
# ------------------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {"format": "[{levelname}] {asctime} {name}: {message}", "style": "{"},
    },
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "verbose"}},
    "root": {"handlers": ["console"], "level": "INFO"},
}

# Log de modo de ruteo activo (debug en arranque)
logging.getLogger(__name__).info(
    "TENANT_ROUTING=%s | SUBFOLDER_PREFIX=%s | DEV_WILDCARD_DOMAIN=%s | PROD_BASE_DOMAIN=%s",
    TENANT_ROUTING,
    TENANT_SUBFOLDER_PREFIX,
    DEV_WILDCARD_DOMAIN,
    PROD_BASE_DOMAIN,
)
