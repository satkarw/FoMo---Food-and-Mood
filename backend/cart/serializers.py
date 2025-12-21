from rest_framework import serializers
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):

    food_name = serializers.CharField(
        source = "menu_item.food.name",
        read_only = True,
    )
    price = serializers.DecimalField(
        source = "menu_item.price",
        read_only=True,
        max_digits=10, decimal_places=2)

    class Meta:
        model = CartItem
        fields = ('id','menu_item','food_name','price','quantity')


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    class Meta:
        model = Cart
        fields = ('id','items')
