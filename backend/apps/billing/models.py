from __future__ import annotations

from django.db import models
from django.conf import settings
from django.utils import timezone

class Subscription(models.Model):
    STATUS_DRAFT = "DRAFT"
    STATUS_TRIAL = "TRIAL"
    STATUS_ACTIVE = "ACTIVE"
    STATUS_SUSPENDED = "SUSPENDED"
    STATUS_EXPIRED = "EXPIRED"
    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_TRIAL, "Trial"),
        (STATUS_ACTIVE, "Active"),
        (STATUS_SUSPENDED, "Suspended"),
        (STATUS_EXPIRED, "Expired"),
    ]

    plan = models.ForeignKey("plans.Plan", on_delete=models.PROTECT, related_name="subscriptions")
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="subscriptions")
    tenant = models.ForeignKey("tenants.Client", on_delete=models.SET_NULL, null=True, blank=True, related_name="subscriptions")

    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    start_at = models.DateTimeField(null=True, blank=True)
    end_at = models.DateTimeField(null=True, blank=True)
    trial_until = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "subscription"

    def activate_trial(self, trial_days: int) -> None:
        now = timezone.now()
        self.status = self.STATUS_TRIAL
        self.start_at = self.start_at or now
        self.trial_until = now + timezone.timedelta(days=trial_days)
        self.save(update_fields=["status", "start_at", "trial_until"])

    def __str__(self) -> str:
        return f"Sub #{self.pk} - {self.plan} - {self.status}"
