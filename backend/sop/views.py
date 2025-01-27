from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Team, TeamMembership, Task
from .serializers import TeamSerializer, TaskSerializer
from django.shortcuts import get_object_or_404
from django.contrib.sites.shortcuts import get_current_site

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
            'from@example.com',
            [email],
            fail_silently=False,
        )

        return Response({'message': 'Invitation sent and user added to the team'}, status=status.HTTP_200_OK)   
    
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(assigned_to=user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def tasks_overview(self, request):
        user = request.user
        
        # Fetch "My Tasks" (tasks assigned to the user)
        my_tasks = Task.objects.filter(assigned_to=user)
        my_tasks_serializer = TaskSerializer(my_tasks, many=True)

        # Fetch "Team Tasks" (tasks for teams the user belongs to)
        teams = user.teams.all()
        team_tasks = Task.objects.filter(team__in=teams)
        team_tasks_serializer = TaskSerializer(team_tasks, many=True)

        # Combine the results into one response
        return Response({
            'my_tasks': my_tasks_serializer.data,
            'team_tasks': team_tasks_serializer.data
        })