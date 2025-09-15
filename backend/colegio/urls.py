from django.urls import path,include
from colegio.views import api_hello, api_echo

# importa aquí los ViewSets que vayas creando
# from .views import AlumnoViewSet, CursoViewSet, ...
from . import views


# router = DefaultRouter()

# router.register(r"alumnos", AlumnoViewSet, basename="alumno")
# router.register(r"cursos", CursoViewSet, basename="curso")
# (agregarás registros aquí a medida que crees más viewsets)

# urlpatterns = [
#     # path('',views.index, name="index"),
#     path('api_hello/', views.api_hello, name='api_hello'),
#     path("", include(router.urls))
#     path("ping/", ping),  # GET /api/ping/
    
# ]



urlpatterns = [
    path("hello/", api_hello),  # GET
    path("echo/", api_echo),    # POST
]

