from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from .models import Profile
from .serializers import ProfileSerializer
from menu.models import Food

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile,context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)  # partial=True is important
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except Exception as e:
                # Log the exception to the console or a log file
                print(f"Error updating profile: {e}")
                return Response(
                    {"error": "An unexpected error occurred."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OtherUserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request,userId):
        profile = get_object_or_404(Profile, user=userId)
        serializer = ProfileSerializer(profile,context={'request': request})
        return Response(serializer.data)
    

class FavouritesToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, food_id):
        profile = get_object_or_404(Profile, user=request.user)
        food = get_object_or_404(Food, id=food_id)

        if food in profile.favourite_foods.all():

            profile.favourite_foods.remove(food)
            action = "removed"

        else:

            profile.favourite_foods.add(food)
            action = "added"

        profile.save()
        return Response({"status": "success", "action": action, "food_id": food.id})

