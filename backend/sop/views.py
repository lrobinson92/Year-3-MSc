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
from django.shortcuts import HttpResponseRedirect, redirect
import urllib.parse
from django.conf import settings
import logging

logger = logging.getLogger(__name__)  # Use Django's logging system

def refresh_onedrive_token(user):
    """Refresh OneDrive access token using the refresh token."""
    refresh_token = user.profile.onedrive_refresh_token
    if not refresh_token:
        return None  # No refresh token available, user needs to re-authenticate

    token_data = {
        "client_id": settings.ONEDRIVE_CLIENT_ID,
        "client_secret": settings.ONEDRIVE_CLIENT_SECRET,
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }

    response = requests.post(settings.ONEDRIVE_TOKEN_URL, data=token_data)
    token_json = response.json()

    logger.info("OneDrive Refresh Token Response: %s", token_json)  # Log the response

    if "access_token" in token_json:
        # Save new tokens in the user's profile
        user.profile.onedrive_access_token = token_json["access_token"]
        user.profile.onedrive_refresh_token = token_json.get("refresh_token", refresh_token)  # Keep old refresh token if not provided
        user.profile.save()
        return token_json["access_token"]
    else:
        return None  # Refresh failed, user may need to log in again

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
    


class OneDriveLoginView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_authenticated:
            return JsonResponse({"error": "User is not authenticated"}, status=401)

        params = {
            "client_id": settings.ONEDRIVE_CLIENT_ID,
            "response_type": "code",
            "redirect_uri": settings.ONEDRIVE_REDIRECT_URI,
            "scope": "Files.Read.All Files.ReadWrite.All offline_access User.Read",
            "response_mode": "query",
        }
        auth_url = f"{settings.ONEDRIVE_AUTH_URL}?{urllib.parse.urlencode(params)}"

        return JsonResponse({"auth_url": auth_url})
    

    

class OneDriveCallbackView(APIView):
    permission_classes = []  # ❌ No authentication needed here

    def get(self, request):
        
        code = request.GET.get("code")
        if not code:
            logger.error("❌ No authorization code received")
            return JsonResponse({"error": "No authorization code provided"}, status=400)

        token_data = {
            "client_id": settings.ONEDRIVE_CLIENT_ID,
            "client_secret": settings.ONEDRIVE_CLIENT_SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.ONEDRIVE_REDIRECT_URI,
        }

        response = requests.post(settings.ONEDRIVE_TOKEN_URL, data=token_data)
        token_json = response.json()

        if "access_token" in token_json:
            access_token = token_json["access_token"]
            refresh_token = token_json.get("refresh_token")

            response = JsonResponse({"success": True})
            response.set_cookie(
                "onedrive_access_token",
                access_token,
                httponly=True,
                secure=False,  # Set to True in production (requires HTTPS)
                samesite="Lax",
            )
            response.set_cookie(
                "onedrive_refresh_token",
                refresh_token,
                httponly=True,
                secure=False,  # Set to True in production (requires HTTPS)
                samesite="Lax",
            )

            logger.info("✅ Successfully authenticated, attempting to redirect...")

            return JsonResponse({"redirect": "http://localhost:3000/view/documents"})


        logger.error("❌ Failed to authenticate with OneDrive")
        return JsonResponse({"error": "Failed to authenticate"}, status=400)
        

class OneDriveCallbackView(APIView):
    permission_classes = []  # ❌ No authentication needed here

    def get(self, request):
        print("📢 OneDrive Callback triggered!")  # ✅ Debug

        code = request.GET.get("code")
        if not code:
            print("❌ No code provided!")  # Debugging
            return JsonResponse({"error": "No authorization code provided"}, status=400)

        print("✅ Received OneDrive authorization code!")  # Debug

        token_data = {
            "client_id": settings.ONEDRIVE_CLIENT_ID,
            "client_secret": settings.ONEDRIVE_CLIENT_SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.ONEDRIVE_REDIRECT_URI,
        }

        response = requests.post(settings.ONEDRIVE_TOKEN_URL, data=token_data)
        token_json = response.json()

        logger.info("OneDrive Token Response: %s", token_json)
        print("📢 OneDrive Token Response:", token_json)  # ✅ Debugging

        if "access_token" in token_json:
            request.session["onedrive_access_token"] = token_json["access_token"]
            request.session["onedrive_refresh_token"] = token_json.get("refresh_token")

            print("🚀 Redirecting to frontend...")
            return redirect("http://localhost:3000/view/documents")  # ✅ Redirect

        print("❌ OneDrive authentication failed!")
        return JsonResponse({"error": "Failed to authenticate"}, status=400)






    
