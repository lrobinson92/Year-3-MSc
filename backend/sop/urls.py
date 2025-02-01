from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]