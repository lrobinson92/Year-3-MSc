import logging
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Team, TeamMembership
from .serializers import TeamSerializer

logger = logging.getLogger(__name__)

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        logger.debug(f"Data received: {self.request.data}")
        team = serializer.save(created_by=self.request.user)

        # Create a TeamMembership entry for the creator
        TeamMembership.objects.create(
            user=self.request.user,
            team=team,
            role='owner'
        )