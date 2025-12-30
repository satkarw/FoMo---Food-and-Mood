from rest_framework import serializers
from .models import *

class ProfileSerializer(serializers.ModelSerializer):


    class Meta:
        model = Profile
        fields = ('id', 'user', 'bio', 'profile_picture', 'favourite_foods')
