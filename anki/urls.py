from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('save/<str:type>', views.save, name='save'),
    path('login', views.login_view, name='login'),
    path('register', views.register_view, name='register'),
    path('logout', views.logout_view, name='logout'),
]