from django.db import models
from django.conf import settings
from menu.models import Food

# Create your models here.

User =  settings.AUTH_USER_MODEL


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='posts')
    caption = models.TextField(null=True) #can be null or blank if not sent data
    image = models.ImageField(null=True, blank=True, upload_to='post_images/')
    food = models.ForeignKey(Food, on_delete=models.SET_NULL ,null=True, blank=True,related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def likes_count(self):
        return self.likes.count()

    def __str__(self):
        return f"{self.user}: {self.caption}"


class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='post_likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')



