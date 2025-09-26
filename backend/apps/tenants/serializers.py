from __future__ import annotations

import re
from django.conf import settings
from rest_framework import serializers

from .models import Client, Domain
from apps.plans.models import Plan


# Subdominio válido: letras/números y guiones, 1..63, sin comenzar/terminar con '-'
SUBDOMAIN_RE = re.compile(r"^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$")


class CheckSubdomainSerializer(serializers.Serializer):
    """
    Uso:
      - Enviar 'subdomain' para validar solo el subdominio (se arma FQDN con PUBLIC_DOMAIN_SUFFIX)
      - O enviar 'domain' ya completo (FQDN)
    Respuesta:
      {
        "available": true|false,
        "domain": "colegio101.127.0.0.1.nip.io"
      }
    """
    subdomain = serializers.CharField(max_length=63, required=False, allow_blank=False)
    domain = serializers.CharField(max_length=253, required=False, allow_blank=False)

    def validate(self, attrs):
        sub = attrs.get("subdomain")
        dom = attrs.get("domain")

        if not sub and not dom:
            raise serializers.ValidationError("Debes enviar 'subdomain' o 'domain'.")

        suffix = getattr(settings, "PUBLIC_DOMAIN_SUFFIX", ".127.0.0.1.nip.io")

        if dom:
            domain = dom.strip().lower()
        else:
            sub = sub.strip().lower()
            if not SUBDOMAIN_RE.match(sub):
                raise serializers.ValidationError({"subdomain": "Formato inválido."})
            domain = f"{sub}{suffix}"

        attrs["domain"] = domain
        return attrs

    def create(self, validated_data):
        # No crea nada, solo calcula disponibilidad
        domain = validated_data["domain"]
        available = not Domain.objects.filter(domain=domain).exists()
        return {"available": available, "domain": domain}


class TenantCreateSerializer(serializers.Serializer):
    """
    Payload:

    A) usando subdominio:
       {
         "name": "Colegio 101",
         "schema": "colegio101",
         "subdomain": "colegio101",
         "plan_code": "FREE"
       }

    B) usando dominio FQDN:
       {
         "name": "Colegio 101",
         "schema": "colegio101",
         "domain": "colegio101.127.0.0.1.nip.io",
         "plan_code": "FREE"
       }
    """
    name = serializers.CharField(max_length=200)
    schema = serializers.RegexField(r"^[a-z0-9_]+$", max_length=63)
    subdomain = serializers.CharField(max_length=63, required=False, allow_blank=False)
    domain = serializers.CharField(max_length=253, required=False, allow_blank=False)
    plan_code = serializers.CharField(max_length=20)

    def validate(self, attrs):
        schema = attrs["schema"].lower()
        plan_code = attrs["plan_code"].upper()

        try:
            plan = Plan.objects.get(code=plan_code, is_active=True)
        except Plan.DoesNotExist:
            raise serializers.ValidationError({"plan_code": "Plan inválido o inactivo."})

        dom = attrs.get("domain")
        sub = attrs.get("subdomain")

        suffix = getattr(settings, "PUBLIC_DOMAIN_SUFFIX", ".127.0.0.1.nip.io")

        if dom:
            domain = dom.strip().lower()
        else:
            if not sub:
                raise serializers.ValidationError(
                    {"subdomain": "Requerido si no envías 'domain'."}
                )
            sub = sub.strip().lower()
            if not SUBDOMAIN_RE.match(sub):
                raise serializers.ValidationError(
                    {"subdomain": "Formato inválido. Solo [a-z0-9-], sin comenzar/terminar con '-'."}
                )
            domain = f"{sub}{suffix}"

        if Client.objects.filter(schema_name=schema).exists():
            raise serializers.ValidationError({"schema": "Ese schema ya existe."})
        if Domain.objects.filter(domain=domain).exists():
            raise serializers.ValidationError({"domain": "Ese dominio ya está en uso."})

        attrs["schema"] = schema
        attrs["domain"] = domain
        attrs["plan_obj"] = plan
        return attrs

    def create(self, validated_data):
        name = validated_data["name"]
        schema = validated_data["schema"]
        domain = validated_data["domain"]
        plan = validated_data["plan_obj"]

        client = Client.objects.create(
            schema_name=schema,
            name=name,
            # si tu Client tiene más campos, añádelos aquí
        )
        Domain.objects.create(
            tenant=client,
            domain=domain,
            is_primary=True,
        )
        # TODO: crear/subscribir plan si ya tienes la lógica en billing

        return client
