from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Using email for login instead of username (as per prompt 'Email Login but no 2fa')
    email = models.EmailField(unique=True)
    
    # We can keep username but we'll use email for authentication if needed.
    # We'll set USERNAME_FIELD to email to enforce email login.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    avatar = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.email
