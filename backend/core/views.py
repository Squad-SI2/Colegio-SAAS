# backend/core/views.py
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    """
    Healthcheck público.
    Útil cuando la request cae en public_urls (no hay tenant resuelto).
    """
    return Response({
        "status": "ok",
        "schema": connection.schema_name,  # normalmente 'public'
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tenant_health(request):
    """
    Healthcheck por tenant (requiere JWT).
    Devuelve schema activo y el usuario.
    """
    user = request.user
    return Response({
        "status": "ok",
        "schema": connection.schema_name,
        "user": getattr(user, "email", None),
        "is_staff": getattr(user, "is_staff", False),
    })
