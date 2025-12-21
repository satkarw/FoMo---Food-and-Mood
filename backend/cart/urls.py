from django.urls import path
from .views import *

urlpatterns = [
    path("", CartDetailView.as_view(), name="cart-detail"),
    path("add/", AddToCartView.as_view(), name="cart-add"),
    path("item/<int:pk>/", UpdateCartItemView.as_view(), name="cart-item-update"),
]
