import requests
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.db.models import Q  # Import Q
from django.http import JsonResponse, HttpResponse
from .models import UserAccount, Team, TeamMembership, Task, Document
from .serializers import TeamSerializer, TaskSerializer
from django.contrib.sites.shortcuts import get_current_site
from sop.serializers import UserCreateSerializer, DocumentSerializer
from .permissions import IsOwnerOrAssignedUser
from django.shortcuts import redirect
import urllib.parse
from django.conf import settings


User = get_user_model()

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(team_memberships__user=user)

    def perform_create(self, serializer):
        team = serializer.save(created_by=self.request.user)
        # Create a TeamMembership entry for the creator
        TeamMembership.objects.create(
            user=self.request.user,
            team=team,
            role='owner'
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def invite_member(self, request, pk=None):
        team = self.get_object()
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is already a member of the team
        if TeamMembership.objects.filter(user=user, team=team).exists():
            return Response({'error': 'User is already a member of the team'}, status=status.HTTP_400_BAD_REQUEST)

        # Add the user to the team
        TeamMembership.objects.create(user=user, team=team, role='member')

        # Send an email notification
        current_site = get_current_site(request)
        mail_subject = 'Team Invitation'
        message = f'Hi {user.name},\n\nYou have been added to the team {team.name} on SOPify.\n\nYou can now access the team and start collaborating.\n\nBest regards,\n{current_site.domain}'
        send_mail(
            mail_subject,
            message,
            'SOPify Admin',
            [email],
            fail_silently=False,
        )

        return Response({'message': 'Invitation sent and user added to the team'}, status=status.HTTP_200_OK)   

    @action(detail=True, methods=['get'], url_path='users-in-same-team')
    def users_in_same_team(self, request, pk=None):
        team = self.get_object()
        users = UserAccount.objects.filter(team_memberships__team=team)
        serializer = UserCreateSerializer(users, many=True)
        return Response(serializer.data)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAssignedUser]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(
            Q(assigned_to=user) | 
            Q(team__team_memberships__user=user)
        ).distinct()
    
    @action(detail=False, methods=['get'], url_path='user-and-team-tasks', permission_classes=[IsAuthenticated])
    def user_and_team_tasks(self, request):
        user = request.user
        user_tasks = Task.objects.filter(assigned_to=user)
        team_tasks = Task.objects.filter(team__team_memberships__user=user).exclude(assigned_to=user)
        user_tasks_serializer = TaskSerializer(user_tasks, many=True)
        team_tasks_serializer = TaskSerializer(team_tasks, many=True)
        return Response({
            'user_tasks': user_tasks_serializer.data,
            'team_tasks': team_tasks_serializer.data
        })
    
class UsersInSameTeamView(generics.ListAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        team_id = self.kwargs['team_id']
        return UserAccount.objects.filter(team_memberships__team_id=team_id)
    
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Document.objects.filter(owner=user) | Document.objects.filter(team__members=user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_documents(self, request):
        user = request.user
        documents = Document.objects.filter(owner=user) | Document.objects.filter(team__in=user.teams.all())
        return JsonResponse({"documents": list(documents.values())})

class OneDriveLoginView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        params = {
            "client_id": settings.ONEDRIVE_CLIENT_ID,
            "response_type": "code",
            "redirect_uri": settings.ONEDRIVE_REDIRECT_URI,
            "scope": "Files.ReadWrite.All User.Read",
        }
        auth_url = f"{settings.ONEDRIVE_AUTH_URL}?{urllib.parse.urlencode(params)}"
        return redirect(auth_url)
    
class OneDriveCallbackView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        code = request.GET.get("code")
        if not code:
            return JsonResponse({"error": "No authorization code provided"}, status=400)

        token_data = {
            "client_id": settings.ONEDRIVE_CLIENT_ID,
            "client_secret": settings.ONEDRIVE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.ONEDRIVE_REDIRECT_URI,
        }

        response = requests.post(settings.ONEDRIVE_TOKEN_URL, data=token_data)
        token_json = response.json()

        if "access_token" in token_json:
            request.session["onedrive_access_token"] = token_json["access_token"]
            return redirect("/view/documents")  # Redirect to your app's dashboard
        else:
            return JsonResponse({"error": "Failed to authenticate"}, status=400)
        
class OneDriveUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        access_token = request.session.get("onedrive_access_token")
        if not access_token:
            return JsonResponse({"error": "User not authenticated"}, status=401)

        file = request.FILES["file"]
        file_data = file.read()
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/octet-stream",
        }

        upload_url = f"{settings.ONEDRIVE_API_URL}/me/drive/root:/{file.name}:/content"
        response = requests.put(upload_url, headers=headers, data=file_data)

        if response.status_code == 201 or response.status_code == 200:
            file_metadata = response.json()
            # Store metadata in PostgreSQL
            Document.objects.create(
                title=file_metadata["name"],
                file_url=file_metadata["@microsoft.graph.downloadUrl"],
                owner=request.user,
            )
            return JsonResponse({"message": "File uploaded", "data": file_metadata})
        return JsonResponse({"error": "Upload failed"}, status=400)
    
class OneDriveDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        access_token = request.session.get("onedrive_access_token")
        if not access_token:
            return JsonResponse({"error": "User not authenticated"}, status=401)

        try:
            file = Document.objects.get(id=file_id)
        except Document.DoesNotExist:
            return JsonResponse({"error": "File not found"}, status=404)

        if file.owner != request.user and request.user not in file.team.members.all():
            return JsonResponse({"error": "Unauthorized"}, status=403)

        headers = {"Authorization": f"Bearer {access_token}"}
        download_url = f"{settings.ONEDRIVE_API_URL}/me/drive/items/{file_id}/content"
        response = requests.get(download_url, headers=headers)

        if response.status_code == 200:
            return HttpResponse(response.content, content_type="application/octet-stream")
        return JsonResponse({"error": "Download failed"}, status=400)
    
