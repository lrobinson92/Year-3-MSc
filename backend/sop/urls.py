from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, TaskViewSet, OneDriveLoginView, OneDriveCallbackView, debug_callback

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'tasks', TaskViewSet, basename='task')
#router.register(r'documents', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
    path('onedrive/login/', OneDriveLoginView.as_view(), name='onedrive_login'),
    #path('onedrive/callback/', OneDriveCallbackView.as_view(), name='onedrive_callback'),
    path('onedrive/callback/', debug_callback, name='debug_callback'),  # Replace with debug view
    # path('onedrive/upload/', OneDriveUploadView.as_view(), name='onedrive_upload'),
    #path('onedrive/download/<int:file_id>/', OneDriveDownloadView.as_view(), name='onedrive_download'),
    #path('documents/get_documents/', DocumentViewSet.as_view({'get': 'get_documents'}), name='get_documents'),
]