from __future__ import annotations
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils.text import slugify
from apps.tenants.models import Client, Domain

# opcionales, comenta si aún no existen
try:
    from apps.billing.models import Subscription
    from apps.plans.models import Plan
except Exception:  # pragma: no cover
    Subscription = None
    Plan = None

User = get_user_model()


class Command(BaseCommand):
    """
    Crea un tenant + dominio.

    DEV (nip.io):
      python manage.py provision_tenant --name "Colegio 101" --schema colegio101 \
        --owner-email admin@colegio101.com --owner-pass 123456 --plan FREE

    PROD:
      python manage.py provision_tenant --name "Colegio ABC" --schema colegioabc \
        --owner-email admin@abc.com --owner-pass 123456 --plan PRO --prod

    Flags:
      --schema:  nombre del esquema (slug)
      --name:    nombre legible
      --owner-email/--owner-pass: crea usuario owner (opcional)
      --plan:    código de Plan, si existe (opcional)
      --dev-domain: sobreescribe DEV_WILDCARD_DOMAIN
      --prod: usa PROD_BASE_DOMAIN (ignora dev)
      --domain: define dominio base manualmente (ej. escuela.edu)
    """
    help = "Provisiona un tenant (schema + domain) para DEV (nip.io) o PROD (dominio real)."

    def add_arguments(self, parser):
        parser.add_argument("--name", required=True)
        parser.add_argument("--schema", required=True)
        parser.add_argument("--owner-email")
        parser.add_argument("--owner-pass")
        parser.add_argument("--plan")
        parser.add_argument("--dev-domain")        # sobreescribe settings.DEV_WILDCARD_DOMAIN
        parser.add_argument("--prod", action="store_true")
        parser.add_argument("--domain")            # fuerza dominio base manualmente
        parser.add_argument("--is-primary", action="store_true", default=True)

    def handle(self, *args, **opts):
        schema = slugify(opts["schema"]).replace("-", "")
        name = opts["name"].strip()
        owner_email = opts.get("owner_email")
        owner_pass = opts.get("owner_pass")
        plan_code = opts.get("plan")
        is_primary = bool(opts.get("is_primary", True))

        # base domain: PROD > --domain > DEV
        if opts.get("prod", False):
            base_domain = opts.get("domain") or getattr(settings, "PROD_BASE_DOMAIN", None)
            if not base_domain:
                raise CommandError("En PROD debes definir --domain o PROD_BASE_DOMAIN en settings/.env")
        else:
            base_domain = opts.get("domain") or opts.get("dev_domain") or getattr(settings, "DEV_WILDCARD_DOMAIN", None)
            if not base_domain:
                raise CommandError("En DEV define --dev-domain o DEV_WILDCARD_DOMAIN en settings/.env")

        fqdn = f"{schema}.{base_domain}"

        client, created = Client.objects.get_or_create(
            schema_name=schema, defaults={"name": name}
        )
        Domain.objects.get_or_create(domain=fqdn, tenant=client, defaults={"is_primary": is_primary})

        owner = None
        if owner_email and owner_pass:
            owner, _ = User.objects.get_or_create(
                email=owner_email,
                defaults={"is_active": True, "is_staff": True, "name": f"Owner {name}"},
            )
            owner.set_password(owner_pass)
            owner.save(update_fields=["password"])

        if plan_code and Plan and Subscription:
            try:
                plan = Plan.objects.get(code=plan_code)
                Subscription.objects.get_or_create(tenant=client, defaults={"plan": plan, "status": "ACTIVE"})
            except Exception as e:
                self.stderr.write(self.style.WARNING(f"No se creó Subscription: {e}"))

        self.stdout.write(self.style.SUCCESS("Tenant listo"))
        self.stdout.write(f"  - schema: {client.schema_name}")
        self.stdout.write(f"  - domain: {fqdn} (is_primary={is_primary})")
        if owner:
            self.stdout.write(f"  - owner:  {owner.email}")
        port = getattr(settings, "BACKEND_PUBLIC_PORT", 8000)
        self.stdout.write(f"Prueba health: http://{fqdn}:{port}/api/health/")
