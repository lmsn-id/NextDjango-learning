from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/admin', views.LoginViewAdmin.as_view(), name='login'),
    path('auth/login/siswa', views.LoginViewSiswa.as_view(), name='login'),
    path('auth/refresh/', views.TokenRefreshView.as_view(), name='refresh'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
]
