from rest_framework import serializers

from .models import Food, MenuItems


class FoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Food
        fields = '__all__'
        read_only_fields = ('id',)

class MenuItemSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    food_id = serializers.PrimaryKeyRelatedField(
        queryset = Food.objects.all(),write_only=True,source='food',
    )

    class Meta:
        model = MenuItems
        fields = ['id', 'food', 'food_id', 'price', 'available', 'image']
