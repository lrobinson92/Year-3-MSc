from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Try to get access token from cookie
        access_token = request.COOKIES.get(settings.AUTH_COOKIE)
        
        if access_token:
            return self.get_user_from_token(access_token)

        return None

    def get_user_from_token(self, token):
        validated_token = self.get_validated_token(token)
        user = self.get_user(validated_token)
        if user is None:
            raise AuthenticationFailed("User not found")
        return user, validated_token