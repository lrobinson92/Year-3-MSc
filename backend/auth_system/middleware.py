from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.deprecation import MiddlewareMixin

import json

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth = JWTAuthentication()
        header = auth.get_header(request)

        # If Authorization header is missing, check for cookies
        if not header:
            raw_token = request.COOKIES.get("access_token")
            if raw_token:
                request.META["HTTP_AUTHORIZATION"] = f"Bearer {raw_token}"

class DebugMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path == "/auth/jwt/create/" and request.method == "POST":
            try:
                print("Incoming request body:", json.loads(request.body.decode("utf-8")))
            except json.JSONDecodeError:
                print("Invalid JSON in request body")