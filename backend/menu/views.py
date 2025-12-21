from django.shortcuts import render
from rest_framework import generics, permissions
from .models import MenuItems,Food
from .permissions import IsAuthenticatedOrReadOnlyCreate, IsAdminOrReadOnly, IsStaffOrReadOnly
from .serializers import FoodSerializer, MenuItemSerializer


# Create your views here.
class FoodListCreateAPIView(generics.ListCreateAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticatedOrReadOnlyCreate]
    search_fields = ['name']

class FoodRetriveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [IsAdminOrReadOnly]

class MenuItemListApiView(generics.ListAPIView):
    queryset = MenuItems.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsStaffOrReadOnly]
    search_fields = ['name']

class MenuItemCreateAPIView(generics.CreateAPIView):
    queryset = MenuItems.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ['name']

class MenuItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItems.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes =[IsAdminOrReadOnly]
