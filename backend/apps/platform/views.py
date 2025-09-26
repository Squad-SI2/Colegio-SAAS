from __future__ import annotations
from django.http import JsonResponse
from django.db import connection

def health(request):
    return JsonResponse(
        {"status": "ok", "host": request.get_host(), "schema": connection.schema_name},
        status=200,
    )
