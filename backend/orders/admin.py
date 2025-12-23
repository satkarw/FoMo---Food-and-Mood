from django.contrib import admin

from .models import Order
# Register your models here.

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    model = Order
    list_display = ("id", "user", "status", "total_price", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "id")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)