from django.db import models
from django.conf import settings
from menu.models import Food

class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    profile_picture = models.ImageField(
        upload_to='profile_pics',
        blank=True,
        null=True
    )

    bio = models.TextField(blank=True)
    favourite_foods = models.ManyToManyField(
        Food,
        related_name='favourited_by',
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
