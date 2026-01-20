from rest_framework import serializers
from .models import Post, PostLike
from menu.models import Food
from django.contrib.auth import get_user_model

User = get_user_model()
class PostUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "profile_picture")

    def get_profile_picture(self, obj):
        if hasattr(obj, "profile") and obj.profile.profile_picture:
            return obj.profile.profile_picture.url
        
        return None

class PostSerializer(serializers.ModelSerializer):
    user = PostUserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source='likes.count',read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    is_favourited = serializers.SerializerMethodField()

    class Meta:
        model =  Post
        fields= (
            "id",
            "user",
            "image",
            "food",
            "caption",
            "likes_count",
            'is_favourited',
            "is_liked",
            "created_at",
        )

    def get_is_liked(self,obj):
        user = self.context['request'].user
        if user.is_anonymous:
            return False
        return obj.likes.filter(user=user).exists()

    def get_is_favourited(self, obj):
        user = self.context["request"].user
        if user.is_anonymous or not obj.food:
            return False
        return user.profile.favourite_foods.filter(id=obj.food.id).exists()



class PostCreateSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Post
        fields = ["image", "food", "food_name", "caption"]

    def create(self, validated_data):
        food_name = validated_data.pop("food_name", "").strip()
        user = self.context["request"].user

        if not validated_data.get("food") and food_name:
            food, _ = Food.objects.get_or_create(
                name=food_name,
                defaults={"approved": False, "created_by_user": True},
            )
            validated_data["food"] = food

        return Post.objects.create(user=user, **validated_data)

