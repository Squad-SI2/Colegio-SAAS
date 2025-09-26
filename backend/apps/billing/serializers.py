from __future__ import annotations

from rest_framework import serializers
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ["id", "plan", "owner", "tenant", "status", "start_at", "end_at", "trial_until", "created_at"]
        read_only_fields = ["owner", "tenant", "status", "start_at", "end_at", "trial_until", "created_at"]


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ["id", "plan"]

    def create(self, validated_data):
        user = self.context["request"].user
        return Subscription.objects.create(owner=user, status=Subscription.STATUS_DRAFT, **validated_data)


class SubscriptionDetailSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source="plan.name", read_only=True)

    class Meta:
        model = Subscription
        fields = ["id", "plan", "plan_name", "owner", "tenant", "status", "start_at", "end_at", "trial_until", "created_at"]
