from django.db import models
from django.conf import settings
from menu.models import MenuItems



# Create your models here.


class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
    )

    status = models.CharField(
        max_length=20,
        choices = STATUS_CHOICES,
        default='pending',
    )

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,

    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

class OrderItem(models.Model):
    order =  models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
    )

    menu_item =  models.ForeignKey(
        MenuItems,
        on_delete=models.SET_NULL,
        null =  True

    )

    quantity = models.PositiveIntegerField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    def __str__(self):
        return f"{self.menu_item.food.name} x {self.quantity}"