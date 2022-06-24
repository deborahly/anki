from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('play', views.play, name='play'),
    path('collection', views.collection, name='collection'),
    path('retrieve/', views.retrieve, name='retrieve'),
    path('create/<str:type>', views.create, name='create'),
    # For cards only:
    path('update/card', views.update_card, name='update_card'),
    path('delete/card', views.delete_card, name='delete_card'),
    path('easiness/card', views.easiness_card, name='easiness_card'),
    # For decks only:
    path('archive', views.archive, name='archive'),
    path('unarchive', views.unarchive, name='unarchive'),
    path('delete/deck', views.delete_deck, name='delete_deck'),
    # Login, register, logout:  
    path('login', views.login_view, name='login'),
    path('register', views.register_view, name='register'),
    path('logout', views.logout_view, name='logout'),
]