from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions, viewsets, generics
from rest_framework.response import Response
from .models  import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


# Create your views here.

class CartDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)



#add to cart
class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)

        menu_item_id = request.data.get('menu_item')
        quantity = int(request.data.get('quantity', 1))

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            menu_item_id=menu_item_id
        )

        if not created:
            item.quantity += quantity

        item.save()
        return Response({'message': 'Item added successfully!'})


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self,request,pk):
        item = CartItem.objects.get(pk = pk, cart = request.user.cart)
        item.quantity = request.data.get('quantity',item.quantity)
        item.save()
        return Response({'message':'Item updated successfully!'})

    def delete(self,request,pk):
        item = CartItem.objects.get(pk = pk, cart = request.user.cart)
        item.delete()
        return Response({'message':'Item deleted successfully!'})
