from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from sop.models import Team, TeamMembership, Task
User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')



class TeamMembershipSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')
    team_name = serializers.ReadOnlyField(source='team.name')

    class Meta:
        model = TeamMembership
        fields = ['id', 'user', 'team', 'role', 'user_name', 'team_name']



class TeamSerializer(serializers.ModelSerializer):
    members = TeamMembershipSerializer(source='team_memberships', many=True)
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'members', 'created_by']



class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.CharField(source="assigned_to.name", read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assigned_to', 'team', 'due_date', 'status']

