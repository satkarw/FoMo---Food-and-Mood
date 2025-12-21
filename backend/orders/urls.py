from django.urls import path
from .views import *


urlpatterns = [
    path('place/', PlaceOrderView.as_view()),
    path('my/', MyOrderView.as_view()),
    path('<int:pk>/cancel/', CancelOrderView.as_view()),
    path('admin/all/', AllOrdersView.as_view()),
]
