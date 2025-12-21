from django.urls import path
from .views import *

urlpatterns = [
    path('food/', FoodListCreateAPIView.as_view(),name="food-list-create"),

    path('food/<int:pk>',FoodRetriveUpdateDestroyAPIView.as_view(),name="food-detail"),

    path("menu-items",MenuItemListApiView.as_view(),name="menu-list-create"),
    path("menu-items/<int:pk>",MenuItemRetrieveUpdateDestroyAPIView.as_view(),name="menu-detail"),
]