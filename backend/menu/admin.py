
from django.contrib import admin
from .models import Food,MenuItems
# Register your models here.
@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    model = Food
    list_display = ('name','description','created_at','created_by_user','approved')
    list_filter = ('name','created_at','created_by_user','approved')
    search_fields = ('name','description')
    ordering = ('name','created_at',)

@admin.register(MenuItems)
class MenuAdmin(admin.ModelAdmin):
    model = MenuItems
    list_display = ('food','price','available','image')
    list_filter = ('price','available')
    search_field = ('food')



