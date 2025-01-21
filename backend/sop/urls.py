from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from .views import set_csrf_token

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path("set-csrf/", set_csrf_token, name="set-csrf"),
    path('', include(router.urls)),
]