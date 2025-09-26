from __future__ import annotations

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.plans.models import Plan


class Command(BaseCommand):
    help = "Crea/actualiza los planes base (FREE/PRO) en el esquema público."

    def add_arguments(self, parser):
        parser.add_argument(
            "--update",
            action="store_true",
            help="Actualiza nombre/precio/trial si el plan ya existe.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        update = options.get("update", False)

        # FREE
        free_defaults = {
            "name": "Free",
            "periodicity": "MONTHLY",
            "price": 0,
            "trial_days": 14,
            "limits": {"tenants_max_users": 50},
            "is_active": True,
        }
        free, created_free = Plan.objects.get_or_create(code="FREE", defaults=free_defaults)
        if not created_free and update:
            for k, v in free_defaults.items():
                setattr(free, k, v)
            free.save(update_fields=list(free_defaults.keys()))

        # PRO
        pro_defaults = {
            "name": "Pro",
            "periodicity": "MONTHLY",
            "price": 49,
            "trial_days": 14,
            "limits": {"tenants_max_users": 500},
            "is_active": True,
        }
        pro, created_pro = Plan.objects.get_or_create(code="PRO", defaults=pro_defaults)
        if not created_pro and update:
            for k, v in pro_defaults.items():
                setattr(pro, k, v)
            pro.save(update_fields=list(pro_defaults.keys()))

        self.stdout.write(
            self.style.SUCCESS(
                f"Planes {'creados' if (created_free or created_pro) else 'verificados'}: "
                f"FREE(id={free.id}), PRO(id={pro.id})"
            )
        )
