from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from .models import MenuItems,Food
from .permissions import IsAuthenticatedOrReadOnlyCreate, IsAdminOrReadOnly, IsStaffOrReadOnly
from .serializers import FoodSerializer, MenuItemSerializer



# Create your views here.
class FoodListCreateAPIView(generics.ListCreateAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticatedOrReadOnlyCreate]
    search_fields = ['name']


class FoodGetOrCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        name = request.data.get("name")

        if not name:
            return Response(
                {"error": "Food name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        clean_name = name.strip().lower()

        food, created = Food.objects.get_or_create(
            name=clean_name
        )

        serializer = FoodSerializer(food)

        return Response(
            {
                "food": serializer.data,
                "created": created
            },
            status=status.HTTP_200_OK
        )

        
        
    

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
