from django.db import migrations
import os

def create_superuser(apps, schema_editor):
    User = apps.get_model('auth', 'User')

    username = os.getenv("DJANGO_SU_USERNAME", "admin")
    email = os.getenv("DJANGO_SU_EMAIL", "admin@gmail.com")
    password = os.getenv("DJANGO_SU_PASSWORD", "Admin@123")

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),  # replace if needed
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
