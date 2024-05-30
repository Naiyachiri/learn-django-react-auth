from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

urlpatterns = [
    path("csrf/", views.get_csrf, name="api-csrf"),
    path("login/", views.login_view, name="api-login"),
    path("logout/", views.logout_view, name="api-logout"),
    path("session/", views.SessionView.as_view(), name="api-session"),
    path("whoami/", views.WhoAmIView.as_view(), name="api-whoami"),
    path("token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
