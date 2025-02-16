from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data["access"]
            refresh_token = response.data["refresh"]

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,  # Change to True in production
                samesite="Lax",
                path="/",
            )
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=False,  # Change to True in production
                samesite="Lax",
                path="/",
            )
            del response.data["access"]
            del response.data["refresh"]
        return response


#@method_decorator(csrf_exempt, name='dispatch')  # Only if CSRF protection is causing issues, otherwise remove this
class LogoutView(View):
    def post(self, request, *args, **kwargs):
        response = JsonResponse({"message": "Logged out successfully"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response