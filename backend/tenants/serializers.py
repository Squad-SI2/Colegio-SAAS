from rest_framework import serializers
from .models import Plan, Client


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = "__all__"


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            "id",
            "schema_name",
            "legal_name",
            "code",
            "official_email",
            "official_phone",
            "address",
            "is_active",
            "plan",
            "created_on",
        ]
        read_only_fields = ["id", "created_on"]
