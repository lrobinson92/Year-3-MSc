from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings


class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email) # normalises email so all lower case
        user = self.model(email=email, name=name)

        user.set_password(password) # built in function will hash password
        user.save()

        return user
        

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def get_full_name(self):
        return self.name
    
    def get_short_name(self):
        return self.name
    
    def __str__(self):
        return self.email
    
    
class Team(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(UserAccount, 
        on_delete=models.CASCADE, 
        related_name="created_teams"
    )
    members = models.ManyToManyField(
        UserAccount,  # Reference your custom user model
        through='TeamMembership',  # Specify the through model
        related_name='teams'  # Allows reverse lookup like user.teams.all()
    )

    def __str__(self):
        return self.name



class TeamMembership(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('member', 'Member'),
        ('admin', 'Admin'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Reference your custom user model
        on_delete=models.CASCADE, 
        related_name="team_memberships"
    )
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE, 
        related_name="team_memberships"
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='member'
    )
    
    class Meta:
        unique_together = ('user', 'team')  # Ensures no duplicate memberships

    def __str__(self):
        return f"{self.user.name} - {self.role} in {self.team.name}"


class Task(models.Model):

    STATUS_CHOICES = [
        ('incomplete', 'Incomplete'),
        ('inprogress', 'InProgress'),
        ('complete', 'Complete'),
        ('overdue', 'Overdue'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks'  # Allows reverse lookup like user.tasks.all()
    )
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='incomplete'
    )

    def __str__(self):
        return self.title
