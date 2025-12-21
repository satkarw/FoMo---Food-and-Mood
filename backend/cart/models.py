from django.db import models
from django.conf import settings
from menu.models import MenuItems

# Create your models here.
class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user.username}'s cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart,on_delete = models.CASCADE,related_name='items')
    menu_item = models.ForeignKey(MenuItems, on_delete = models.CASCADE )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart',"menu_item")

    def __str__(self):
        return f"{self.menu_item.food.name} x {self.quantity}"
