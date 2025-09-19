from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ["id", "name", "email", "password", "role"]
    extra_kwargs = {
      "password": {"write_only": True}
    }

  def create(self, validated_data):
    password = validated_data.pop("password")
    user = User.objects.create(
      name=validated_data["name"],
      email=validated_data["email"],
      role=validated_data["role"],
    )
    if password is not None:
      user.set_password(password)
    user.save()
    return user
