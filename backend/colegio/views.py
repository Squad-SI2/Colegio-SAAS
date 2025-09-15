from django.shortcuts import render
from django.http import JsonResponse


from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(["GET"])
def api_hello(request):
    print("Endpoint /api/hello fue llamado a las", timezone.now())
    return Response({
        "ok": True,
        "msg": "Hola desde DRF",
        "time": timezone.now().isoformat()
    })

@api_view(["POST"])
def api_echo(request):
    # request.data ya viene parseado (JSON)
    payload = request.data if isinstance(request.data, dict) else {"raw": request.data}
    return Response({
        "received": payload,
        "at": timezone.now().isoformat()
    }, status=status.HTTP_201_CREATED)

