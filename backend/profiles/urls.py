from django.urls import path
from .views import *


urlpatterns = [
    path('my/', ProfileView.as_view()),
    path('myFavourites/<int:food_id>',FavouritesToggleView.as_view(), name="toggle-favourites"),
]
