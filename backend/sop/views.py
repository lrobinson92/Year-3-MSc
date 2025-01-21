from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserAccount, Team,TeamMembership, Task
from .serializers import TeamSerializer, TeamMembershipSerializer, TaskSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.http import HttpResponse

@ensure_csrf_cookie
def set_csrf_token(request):
    response = JsonResponse({"message": "CSRF cookie set successfully"})
    
    # Add CORS headers to allow credentials
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"  # Your frontend origin
    response["Access-Control-Allow-Credentials"] = "true"
    
    return response

class TeamsViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    # Retrieve teams the user belongs to
    @action(detail=False, methods=['get'])
    def my_teams(self, request):
        user = self.request.user
        teams = Team.objects.filter(members=user)
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)

    # Add a team member
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        team = get_object_or_404(Team, pk=pk)
        username = request.data.get("username")

        # Check if the username exists
        try:
            user = UserAccount.objects.get(name=username)
        except UserAccount.DoesNotExist:
            return Response({"error": "User with this username does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is already a member of the team
        if TeamMembership.objects.filter(team=team, user=user).exists():
            return Response({"error": f"{username} is already a member of this team."}, status=status.HTTP_400_BAD_REQUEST)

        # Add the user to the team
        TeamMembership.objects.create(team=team, user=user, role="Member")

        return Response({"message": f"{username} has been successfully added to the team."}, status=status.HTTP_200_OK)

    # Leave a team
    @action(detail=True, methods=['post'])
    def leave_team(self, request, pk=None):
        team = get_object_or_404(Team, pk=pk)
        membership = TeamMembership.objects.filter(team=team, user=request.user).first()
        if membership:
            membership.delete()
            return Response({"message": "You left the team"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Membership not found"}, status=status.HTTP_404_NOT_FOUND)

    # Delete a team
    def destroy(self, request, *args, **kwargs):
        team = self.get_object()
        if team.created_by != request.user:
            return Response({"error": "You can only delete teams you created"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class TeamMembershipViewSet(viewsets.ModelViewSet):
    queryset = TeamMembership.objects.all()
    serializer_class = TeamMembershipSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(assigned_to_id=user)
    
