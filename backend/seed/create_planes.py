# seed/create_planes.py
from apps.plans.models import Plan

def run():
    Plan.objects.get_or_create(code="FREE", defaults={"name": "Free", "price": 0, "trial_days": 14})
    Plan.objects.get_or_create(code="PRO", defaults={"name": "Pro", "price": 49, "trial_days": 14})
    print("Planes sembrados: FREE/PRO")
