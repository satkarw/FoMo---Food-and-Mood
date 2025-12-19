from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
# Register your models here.

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('id','username', 'email','first_name','last_name', 'is_staff', 'is_superuser', )
    list_filter = ('is_superuser', 'is_staff', 'is_superuser')

    search_fields = ('username', 'email')
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email','first_name', 'last_name')}),
    )

