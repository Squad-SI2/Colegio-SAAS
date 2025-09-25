#!/usr/bin/env sh
set -e

echo "Esperando a PostgreSQL en $POSTGRES_HOST:$POSTGRES_PORT..."
until python - <<'PY'
import os, socket, sys
host=os.environ.get("POSTGRES_HOST","db")
port=int(os.environ.get("POSTGRES_PORT","5432"))
try:
    with socket.create_connection((host, port), timeout=2):
        sys.exit(0)
except OSError:
    sys.exit(1)
PY
do
  echo "DB no disponible, reintentando..."
  sleep 1
done
echo "PostgreSQL listo."

# NO crear proyecto aquí (tu repo ya lo trae)
# if [ ! -f "manage.py" ]; then
#   django-admin startproject config .
# fi

echo "Aplicando makemigrations (si no hay cambios, no pasa nada)..."
python manage.py makemigrations || true

echo "Aplicando migrate_schemas --shared (django-tenants, esquema public)..."
python manage.py migrate_schemas --shared --noinput

# >>>>>>>>>>>>>>>>>>>>>>>>> SUPERUSER (usar manage.py shell) <<<<<<<<<<<<<<<<<<<<<<<<<
if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "Creando/actualizando superuser $DJANGO_SUPERUSER_EMAIL ..."
  python manage.py shell -c "
from django.contrib.auth import get_user_model
import os
U = get_user_model()
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
pwd = os.getenv('DJANGO_SUPERUSER_PASSWORD')
u, created = U.objects.get_or_create(
    email=email,
    defaults={'is_staff': True, 'is_superuser': True, 'is_active': True}
)
if pwd:
    u.set_password(pwd); u.save()
print('Superuser listo:', email, '(creado)' if created else '(actualizado)')
"
else
  echo "DJANGO_SUPERUSER_EMAIL/PASSWORD no definidos; omito creación de superuser."
fi
# >>>>>>>>>>>>>>>>>>>>>>> SUPERUSER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

echo "CREANDO PLANES"
python manage.py shell < ./seed/create_planes.py

# Static/Media
echo "Preparando carpetas de static y media..."
mkdir -p /app/staticfiles /app/media || true
chmod -R 777 /app/staticfiles /app/media 2>/dev/null || true

# collectstatic SOLO si DEBUG no está activo
case "$(printf '%s' "$DEBUG" | tr '[:upper:]' '[:lower:]')" in
  1|y|yes|true)
    echo "DEBUG activo → salto collectstatic"
    ;;
  *)
    echo "Ejecutando collectstatic..."
    python manage.py collectstatic --noinput || true
    ;;
esac

echo "Levantando servidor de desarrollo..."
python manage.py runserver 0.0.0.0:8000
# Producción: gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
