"""
Django settings for config project.
Arquitectura SaaS multi-tenant con Django Tenants + DRF + JWT.
"""

from pathlib import Path
import environ

# ---------- django-environ ----------
BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env(DEBUG=(bool, False))
# .env en la raíz del repo (junto al docker-compose.yml)
environ.Env.read_env(BASE_DIR.parent / ".env")
# ------------------------------------

# Seguridad / entorno
SECRET_KEY = env("SECRET_KEY", default="insecure-dev-only")
DEBUG = env.bool("DEBUG", default=True)
ALLOWED_HOSTS = env.list(
    "ALLOWED_HOSTS",
    default=["localhost", "127.0.0.1", "0.0.0.0", "backend"],
)

# ========== Apps (django-tenants) ==========
# Apps en esquema PUBLIC (compartidas)
SHARED_APPS = [
    "django_tenants",  # SIEMPRE primero
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "django.contrib.sessions",
    "django.contrib.admin",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # terceros
    "corsheaders",
    "rest_framework",
    "drf_spectacular",

    # propias compartidas
    "accounts",
    "tenants",
]

# Apps por tenant (cada colegio)
TENANT_APPS = [
    "academics",
    "comms",
    "core",
    "payments",
]

INSTALLED_APPS = SHARED_APPS + TENANT_APPS

# ========== Middleware ==========
MIDDLEWARE = [
    "django_tenants.middleware.main.TenantMainMiddleware",  # primero
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",           # estáticos en contenedor
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# ========== Base de datos (Postgres + tenants) ==========
DATABASES = {
    "default": {
        "ENGINE": "django_tenants.postgresql_backend",
        "NAME": env("POSTGRES_DB"),
        "USER": env("POSTGRES_USER"),
        "PASSWORD": env("POSTGRES_PASSWORD"),
        "HOST": env("POSTGRES_HOST"),   # en Docker: "db"
        "PORT": env("POSTGRES_PORT"),   # 5432
    }
}
DATABASE_ROUTERS = ("django_tenants.routers.TenantSyncRouter",)
TENANT_MODEL = "tenants.Client"
TENANT_DOMAIN_MODEL = "tenants.Domain"
PUBLIC_SCHEMA_NAME = "public"
PUBLIC_SCHEMA_URLCONF = "config.public_urls"
TENANT_NOT_FOUND_EXCEPTION = False  # ⬅️ NUEVO: fallback a public_urls cuando no hay tenant

# Usuario personalizado
AUTH_USER_MODEL = "accounts.User"

# ========== Templates ==========
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
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

# ========== DRF / JWT / OpenAPI ==========
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}
SPECTACULAR_SETTINGS = {
    "TITLE": "SGAC SaaS API",
    "VERSION": "0.1",
}

# Validadores
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internacionalización
LANGUAGE_CODE = env("LANGUAGE_CODE", default="es")
TIME_ZONE = env("TIME_ZONE", default="America/La_Paz")
USE_I18N = True
USE_TZ = True

# Estáticos / Media
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
WHITENOISE_USE_FINDERS = True

# CORS / CSRF (dev)
if env.bool("CORS_ALLOW_ALL_ORIGINS", default=False):
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = env.list(
        "CORS_ALLOWED_ORIGINS",
        default=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://frontend:5173",
        ],
    )
CSRF_TRUSTED_ORIGINS = env.list(
    "CSRF_TRUSTED_ORIGINS",
    default=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://frontend:5173",
    ],
)

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
