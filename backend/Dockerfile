FROM python:3.12-slim

# Evitar .pyc y buffers en logs; no cache pip
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Paquetes de sistema necesarios para psycopg2 y utilidades
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Pip actualizado para evitar warnings
RUN pip install --upgrade pip

# Instala dependencias de Python (primero requirements para cache de capas)
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copia el resto del proyecto (entrypoint, settings, etc.)
COPY . .
RUN chmod +x /app/entrypoint.sh

