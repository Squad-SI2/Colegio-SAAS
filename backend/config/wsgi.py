"""
WSGI config para el proyecto.

Expone la variable `application` de WSGI que utiliza servidores como Gunicorn o uWSGI.
"""

from __future__ import annotations

import os
from django.core.wsgi import get_wsgi_application

# Apunta a la configuración principal del proyecto
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()
