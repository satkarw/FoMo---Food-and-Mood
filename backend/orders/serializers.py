from rest_framework import serializers
from .models import *


class OrderItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(
        source = 'menu_item.food.name',
        read_only = True,
    )
    class Meta:
        model = OrderItem
        fields = ('id','food_name','quantity','price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    class Meta:
        model = Order
        fields = ('id','status','total_price','created_at','items')
