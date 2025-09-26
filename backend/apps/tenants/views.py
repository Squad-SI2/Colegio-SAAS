from __future__ import annotations

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import connection
from rest_framework.permissions import AllowAny

from .serializers import (
    CheckSubdomainSerializer,
    TenantCreateSerializer,
)


class CheckSubdomainView(APIView):
    """
    POST /api/tenants/check-subdomain
    Body:
      { "subdomain": "colegio101" }
    ó
      { "domain": "colegio101.127.0.0.1.nip.io" }

    Respuesta:
      { "available": true, "domain": "colegio101.127.0.0.1.nip.io" }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        ser = CheckSubdomainSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        result = ser.save()   # retorna dict con available/domain
        return Response(result, status=status.HTTP_200_OK)


class TenantCreateView(APIView):
    """
    POST /api/tenants/
    Body:
      {
        "name": "Colegio 101",
        "schema": "colegio101",
        "subdomain": "colegio101",   // o "domain": "colegio101.127.0.0.1.nip.io"
        "plan_code": "FREE"
      }
    """
    permission_classes = [permissions.IsAuthenticated]  # asume superadmin / staff

    def post(self, request, *args, **kwargs):
        ser = TenantCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        client = ser.save()
        return Response(
            {
                "id": client.id,
                "name": client.name,
                "schema": client.schema_name,
                # Nota: el dominio lo armaste en el serializer; si quieres devolverlo explícito:
                # "domain": client.domains.filter(is_primary=True).values_list("domain", flat=True).first(),
            },
            status=status.HTTP_201_CREATED,
        )
    
class TenantInfoView(APIView):
    """
    Devuelve información del tenant activo (según el Host de la request).
    Útil como 'perfil' inicial sin depender de modelos del tenant.
    """
    permission_classes = [AllowAny]  # cámbialo a IsAuthenticated cuando tengas usuarios por tenant

    def get(self, request, *args, **kwargs):
        # Si estás en el esquema público no hay tenant activo
        if connection.schema_name == "public" or getattr(connection, "tenant", None) is None:
            return Response({"detail": "No hay tenant activo para este host."}, status=404)

        t = connection.tenant  # instancia de apps.tenants.models.Client
        data = {
            "id": t.id,
            "name": getattr(t, "name", ""),
            "schema": t.schema_name,
            "domains": [d.domain for d in t.domains.all()],
            "created_at": getattr(t, "created_at", None),
            # Si ya tienes subs/planes públicos, expón el plan (si no, quita esta parte)
            # "plan": getattr(getattr(t, "subscription", None), "plan_id", None),
        }
        return Response(data)
