from django.db import models
from django.conf import settings
import uuid

class Book(models.Model):
    CATEGORY_CHOICES = [
        ('Travel', 'Travel'),
        ('Birthday', 'Birthday'),
        ('Wedding', 'Wedding'),
        ('College', 'College'),
        ('Friends', 'Friends'),
        ('Baby', 'Baby'),
        ('Family', 'Family'),
        ('Couple', 'Couple'),
        ('Work', 'Work'),
        ('Other', 'Other'),
    ]

    VISIBILITY_CHOICES = [
        ('Private', 'Private'),
        ('Invite Only', 'Invite Only'),
        ('Public', 'Public'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='Private')
    cover_image = models.URLField(blank=True, null=True)
    theme = models.CharField(max_length=100, default='Minimal White')
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_books')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
