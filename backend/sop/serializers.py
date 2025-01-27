import logging
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from sop.models import Team, TeamMembership, Task

User = get_user_model()

class UserCreateSerializer(DjoserUserCreateSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="This email is already in use.")
        ]
    )

    class Meta(DjoserUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')



class TeamMembershipSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')
    team_name = serializers.ReadOnlyField(source='team.name')

    class Meta:
        model = TeamMembership
        fields = ['id', 'user', 'team', 'role', 'user_name', 'team_name']



class TeamSerializer(serializers.ModelSerializer):
    members = TeamMembershipSerializer(source='team_memberships', many=True, read_only=True)
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_by', 'members']
        read_only_fields = ['created_by', 'members']


class TaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.name')

    class Meta:
        model = Task
        fields = ['id', 'description', 'assigned_to', 'assigned_to_name', 'team', 'due_date', 'status']

    def get_assigned_to_name(self, obj):
        return obj.assigned_to.name if obj.assigned_to else 'Unassigned'