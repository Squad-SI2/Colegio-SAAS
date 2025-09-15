#!/usr/bin/env bash
set -e

echo "Esperando a PostgreSQL en $POSTGRES_HOST:$POSTGRES_PORT..."
until python - <<'PY'
import os, socket, sys
host=os.environ.get("POSTGRES_HOST","db")
port=int(os.environ.get("POSTGRES_PORT","5432"))
s=socket.socket()
try:
    s.connect((host,port))
    sys.exit(0)
except Exception:
    sys.exit(1)
PY
do
  sleep 1
done
echo "PostgreSQL listo."

# Si no existe el proyecto, créalo (idempotente, no pisa si ya existe)
if [ ! -f "manage.py" ]; then
  django-admin startproject config .
fi

# Migraciones seguras (si no hay cambios no falla la ejecución)
python manage.py makemigrations || true
python manage.py migrate

# Estáticos (necesario para el admin y assets)
#Antes
#python manage.py collectstatic --noinput || true

#Ahora:
if [ "$DEBUG" = "1" ]; then
  echo "DEBUG=1 → salto collectstatic"
else
  python manage.py collectstatic --noinput
fi
# Servidor de desarrollo con autoreload
python manage.py runserver 0.0.0.0:8000

