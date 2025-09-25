#!/usr/bin/env sh
set -euo pipefail

POSTGRES_HOST="${POSTGRES_HOST:-db}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"

echo "Esperando a PostgreSQL en ${POSTGRES_HOST}:${POSTGRES_PORT}..."
for i in $(seq 1 "${DB_MAX_RETRIES:-30}"); do
python - <<'PY'
import os, socket, sys
host=os.environ.get("POSTGRES_HOST","db")
port=int(os.environ.get("POSTGRES_PORT","5432"))
try:
    with socket.create_connection((host, port), timeout=2):
        pass
    sys.exit(0)
except OSError:
    sys.exit(1)
PY
  if [ $? -eq 0 ]; then
    echo "PostgreSQL listo."
    break
  fi
  echo "DB no disponible, intento ${i}..."; sleep "${DB_SLEEP_BETWEEN:-2}"
done

echo "Aplicando migraciones compartidas (django-tenants: --shared)..."
python manage.py migrate_schemas --shared --noinput

# Si ya tienes tenants creados y quieres correr migraciones por tenant:
if [ "${TENANT_MIGRATIONS:-1}" = "1" ]; then
  echo "Aplicando migraciones de tenants (django-tenants: --tenant)..."
  python manage.py migrate_schemas --tenant --noinput
fi

# collectstatic en prod (puedes desactivar con COLLECT_STATIC=0)
if [ "${COLLECT_STATIC:-1}" = "1" ]; then
  echo "Ejecutando collectstatic..."
  mkdir -p /app/staticfiles /app/media || true
  python manage.py collectstatic --noinput
fi

# (OPCIONAL) Crear superuser SOLO si lo pides explícitamente
if [ "${CREATE_SUPERUSER:-0}" = "1" ] && [ -n "${DJANGO_SUPERUSER_EMAIL:-}" ] && [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
  echo "Creando/asegurando superuser ${DJANGO_SUPERUSER_EMAIL} ..."
  python manage.py shell <<'PY'
import os
from django.contrib.auth import get_user_model
U = get_user_model()
email=os.environ["DJANGO_SUPERUSER_EMAIL"]
pwd=os.environ["DJANGO_SUPERUSER_PASSWORD"]
u, created = U.objects.get_or_create(email=email, defaults={"is_staff": True, "is_superuser": True, "is_active": True})
if created:
    u.set_password(pwd); u.save(); print("Superuser creado")
else:
    print("Superuser ya existía (no se cambia password)")
PY
fi

echo "CREANDO PLANES"
python manage.py shell < ./seed/create_planes.py

echo "Levantando Gunicorn..."
exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --threads "${GUNICORN_THREADS:-2}" \
  --timeout "${GUNICORN_TIMEOUT:-60}" \
  --access-logfile - \
  --error-logfile -

