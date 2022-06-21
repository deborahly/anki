from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('collection', views.collection, name='collection'),
    path('create/<str:type>', views.create, name='create'),
    path('update/card', views.update_card, name='update_card'),
    path('retrieve/', views.retrieve, name='retrieve'),
    path('login', views.login_view, name='login'),
    path('register', views.register_view, name='register'),
    path('logout', views.logout_view, name='logout'),
]