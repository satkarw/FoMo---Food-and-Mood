from rest_framework import serializers
from .models import *
from menu.serializers import FoodSerializer
from accounts.serializers import UserSerializer



class ProfileSerializer(serializers.ModelSerializer):
    favourite_foods = FoodSerializer(many=True,read_only=True)
    user = UserSerializer()


    class Meta:
        model = Profile
        fields = ('id', 'user', 'bio', 'profile_picture', 'favourite_foods')
