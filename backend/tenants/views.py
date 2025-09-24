from rest_framework import generics, permissions
from .models import Plan, Client, Domain
from .serializers import PlanSerializer, ClientSerializer, DomainSerializer


class PlanCreateView(generics.CreateAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [permissions.IsAdminUser]


class ClientCreateView(generics.CreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAdminUser]


class ClientDetailView(generics.RetrieveAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]


class DomainCreateView(generics.CreateAPIView):
    """
    Crear un dominio para un tenant (host -> tenant).
    Requiere usuario staff (IsAdminUser).
    """

    queryset = Domain.objects.all()
    serializer_class = DomainSerializer
    permission_classes = [permissions.IsAdminUser]


class DomainListView(generics.ListAPIView):
    """
    Listar todos los dominios.
    Requiere usuario staff (IsAdminUser).
    """

    queryset = Domain.objects.all().select_related("tenant")
    serializer_class = DomainSerializer
    permission_classes = [permissions.IsAdminUser]
