from __future__ import annotations

from rest_framework import generics, permissions
from .models import SchoolMembership
from .serializers import SchoolMembershipSerializer, SchoolMembershipCreateSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

class MembershipListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsOwnerOrAdmin]
    queryset = SchoolMembership.objects.all().order_by("-created_at")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return SchoolMembershipCreateSerializer
        return SchoolMembershipSerializer

class MembershipDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOwnerOrAdmin]
    queryset = SchoolMembership.objects.all()
    serializer_class = SchoolMembershipSerializer
