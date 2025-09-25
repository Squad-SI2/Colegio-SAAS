from tenants.models import Plan

if not Plan.objects.exists():
    Plan.objects.create(
        name="Básico",
        period="M",
        price=450,
        currency="BOB",
        max_users=10,
        max_students=100,
        features={"support": "email"},
    )
    Plan.objects.create(
        name="Profesional",
        period="M",
        price=960,
        currency="BOB",
        max_users=50,
        max_students=500,
        features={"support": "chat", "reports": True},
    )
    Plan.objects.create(
        name="Premium",
        period="Y",
        price=1680,
        currency="BOB",
        max_users=200,
        max_students=2000,
        features={"support": "24/7", "reports": True, "analytics": True},
    )
    print("Planes insertados correctamente.")
else:
    print("Planes ya existen, no se hizo nada.")
