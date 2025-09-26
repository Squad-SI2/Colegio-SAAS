from __future__ import annotations

from rest_framework.routers import DefaultRouter
from .views import CycleViewSet, LevelViewSet, GradeViewSet

router = DefaultRouter()
router.register("cycles/", CycleViewSet, basename="cycles")
router.register("levels/", LevelViewSet, basename="levels")
router.register("grades/", GradeViewSet, basename="grades")

urlpatterns = router.urls
