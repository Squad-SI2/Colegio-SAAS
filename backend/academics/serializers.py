# backend/academics/serializers.py
from rest_framework import serializers
from .models import (EducationLevel, AcademicPeriod, Grade, Section, Subject,
                     Person, Student )

class EducationLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationLevel
        fields = ["id", "name", "short_name", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

# ...

class AcademicPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicPeriod
        fields = ["id", "name", "start_date", "end_date", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        # Repite la regla de fechas en capa API (además del clean del modelo)
        if attrs.get("end_date") and attrs.get("start_date") and attrs["end_date"] < attrs["start_date"]:
            raise serializers.ValidationError("end_date no puede ser menor que start_date")
        return attrs

class GradeSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.name", read_only=True)

    class Meta:
        model = Grade
        fields = ["id", "level", "level_name", "name", "order", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_order(self, value):
        if value < 1:
            raise serializers.ValidationError("order debe ser >= 1")
        return value
    

class SectionSerializer(serializers.ModelSerializer):
    grade_name = serializers.CharField(source="grade.name", read_only=True)
    level_id = serializers.IntegerField(source="grade.level_id", read_only=True)
    level_name = serializers.CharField(source="grade.level.name", read_only=True)

    class Meta:
        model = Section
        fields = [
            "id", "grade", "grade_name", "level_id", "level_name",
            "name", "capacity", "is_active",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_capacity(self, value):
        if value < 1:
            raise serializers.ValidationError("capacity debe ser >= 1")
        return value
    
class SubjectSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.name", read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id", "level", "level_name",
            "name", "short_name", "is_active",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres.")
        return value.strip()
    
# Actores 
class PersonSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = [
            "id", "first_name", "last_name", "full_name",
            "doc_type", "doc_number", "email", "phone", "address",
            "birth_date", "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def validate(self, attrs):
        # Ejemplo simple: si hay email, que no sea muy corto
        email = attrs.get("email")
        if email and len(email) < 6:
            raise serializers.ValidationError({"email": "Email inválido."})
        return attrs


class StudentSerializer(serializers.ModelSerializer):
    # Datos derivados para mostrar en listas
    person_name = serializers.CharField(source="person.__str__", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id", "person", "person_name",
            "code", "admission_date", "notes",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_code(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("El código debe tener al menos 3 caracteres.")
        return value