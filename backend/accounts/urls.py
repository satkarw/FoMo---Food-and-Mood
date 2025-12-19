from django.contrib.auth.views import LoginView
from django.urls import path
from .views import RegisterView, CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView, CurrentUserView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", CookieTokenObtainPairView.as_view()),
    path("refresh/", CookieTokenRefreshView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", CurrentUserView.as_view()),
]

