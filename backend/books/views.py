from rest_framework import viewsets, permissions
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can see books they own or books that are public
        # In a real scenario we'd also check 'Invite Only' memberships
        user = self.request.user
        return Book.objects.filter(models.Q(owner=user) | models.Q(visibility='Public')).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        # Only owner can edit or delete
        if request.method in permissions.SAFE_METHODS:
            return
        if obj.owner != request.user:
            self.permission_denied(
                request,
                message="You do not have permission to edit this book.",
                code=403
            )
from django.db import models
