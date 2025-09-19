from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Manager para autenticar por email (sin username)."""
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser debe tener is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Usuario base del sistema.
    - Autenticación por email (único).
    - Sin 'username'.
    """
    username = None  # deshabilitamos username
    name = models.CharField(max_length=150, default="user")
    email = models.EmailField(unique=True)

    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("DOC", "Docente"),
        ("EST", "Estudiante"),
        ("PAD", "Padre"),
    ]
    role = models.CharField(max_length=8, choices=ROLE_CHOICES, default="ADMIN")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []  # sin campos extra obligatorios

    objects = UserManager()  # <<< Manager personalizado

    def __str__(self) -> str:
        return f"{self.email} ({self.role})"