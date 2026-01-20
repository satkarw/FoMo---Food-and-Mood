from django.shortcuts import render
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status, permissions, generics
from rest_framework.response import Response

from .serializers import RegisterSerializer
from .authentication import CookieJWTAuthentication


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class CookieTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        resp = super().post(request, *args, **kwargs)

        access = resp.data.get("access")
        refresh = resp.data.get("refresh")

        print("ACCESS TOKEN:", access)  # Add this
        print("REFRESH TOKEN:", refresh)  # Add this

        response = Response({"access":access,"refresh":refresh}, status=status.HTTP_200_OK)

        #setting http only cookie

        response.set_cookie(
            key = "access_token",
            value = access,
            httponly=True,
            secure=False,  #change to True in production
            samesite = "Lax",
            max_age = 60 * 60 * 24 * 5,

        )

        response.set_cookie(
            key = "refresh_token",
            value = refresh,
            httponly=True,
            secure=False, #change to true in production
            samesite = "Lax",
            max_age = 7*24*3600


        )

        return response


#for token refresh: we will use tokenrefreshview but respond with new cookie

class CookieTokenRefreshView(TokenRefreshView):
    def post(self,request, *args, **kwargs):
        resp = super().post(request, *args, **kwargs)
        access = resp.data.get("access")
        refresh = resp.data.get("refresh")

        response = Response({"msg": "token refreshed"})

        if access:
            response.set_cookie("access_token",access, httponly=True, samesite="Lax")

        if refresh:
            response.set_cookie("refresh_token",refresh, httponly=True, samesite="Lax")

        return response

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()

        except Exception:
            pass

        response = Response({"msg": "logged out"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response

class CurrentUserView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })

