from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db import transaction

from .models import *
from cart.models import Cart

from rest_framework import generics
from .serializers import OrderSerializer


# Create your views here.

class PlaceOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self,request):
        cart = request.user.cart

        if not cart.items.exists():
            return Response(
                {'error':"cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )
        order = Order.objects.create(user = request.user)
        total = 0

        for item  in cart.items.all():
            
            OrderItem.objects.create(
                order = order,
                menu_item = item.menu_item,
                quantity = item.quantity,
                price = item.menu_item.price,
            )

            total += item.menu_item.price * item.quantity


        order.total_price = total
        order.save()

        cart.items.all().delete()

        return Response(

            {"message":"Order Placed"},
            status=status.HTTP_201_CREATED
        )

class MyOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get(self, request):
        orders = Order.objects.filter(user = request.user)
        serializer = self.serializer_class(orders, many=True)
        return Response(serializer.data)

class AllOrdersView(APIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = OrderSerializer

    queryset = Order.objects.all()

class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,pk):
        try:
            order = Order.objects.get(pk=pk,user = self.request.user)
        except Order.DoesNotExist:
            return Response(
                {'error':'Order does not exist'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if order.status != 'pending':
            return Response(
                {'error':'Order cannot be canceled'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = 'cancelled'
        order.save()

        return Response(
            {"message":"Order canceled"},
            status=status.HTTP_202_ACCEPTED
        )

