from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, TaskViewSet, OneDriveLoginView, OneDriveCallbackView

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'tasks', TaskViewSet, basename='task')
#router.register(r'documents', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
    path('onedrive/login/', OneDriveLoginView.as_view(), name='onedrive_login'),
    path('callback/', OneDriveCallbackView.as_view(), name='onedrive_callback'),
    # path('onedrive/upload/', OneDriveUploadView.as_view(), name='onedrive_upload'),
    #path('onedrive/download/<int:file_id>/', OneDriveDownloadView.as_view(), name='onedrive_download'),
    #path('documents/get_documents/', DocumentViewSet.as_view({'get': 'get_documents'}), name='get_documents'),
]