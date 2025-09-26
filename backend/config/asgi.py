"""
ASGI config para el proyecto.

Expone la variable `application` de ASGI que utiliza servidores como Uvicorn o Daphne.
"""

from __future__ import annotations

import os
from django.core.asgi import get_asgi_application

# Apunta a la configuración principal del proyecto
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_asgi_application()
