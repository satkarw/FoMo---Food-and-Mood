from django.db import models

# Create your models here.
class Food(models.Model):
    name = models.CharField(max_length=100,unique=True)
    description = models.TextField(blank = True)
    is_veg = models.BooleanField(null=True,blank = True)

    created_by_user = models.BooleanField(default = False)
    approved = models.BooleanField(default = False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class MenuItems(models.Model):
    food =  models.ForeignKey(Food, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    available = models.BooleanField(default = False)

    image = models.ImageField(upload_to='menu_images',blank=True,null=True)

