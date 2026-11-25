from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()

    publisher = models.CharField(max_length=150, blank=True)
    edition = models.CharField(max_length=50, blank=True)
    publication_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    cover_image = models.URLField(blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="books"
    )

    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="books"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def available_copies(self):
        return self.copies.filter(status="available").count()

class BookCopy(models.Model):

    class CopyStatus(models.TextChoices):
        AVAILABLE = "available", "Available"
        RESERVED = "reserved", "Reserved"
        BORROWED = "borrowed", "Borrowed"
        UNAVAILABLE = "unavailable", "Unavailable"

    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name="copies"
    )

    copy_code = models.CharField(max_length=50, unique=True)

    status = models.CharField(
        max_length=20,
        choices=CopyStatus.choices,
        default=CopyStatus.AVAILABLE
    )

    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} - {self.copy_code}"

class SavedBook(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="saved_books"
    )

    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name="saved_by"
    )

    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "book"],
                name="unique_saved_book"
            )
        ]

    def __str__(self):
        return f"{self.user.username} saved {self.book.title}"

class BookRequest(models.Model):

    class RequestStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="book_requests"
    )

    book = models.ForeignKey(
        Book,
        on_delete=models.PROTECT,
        related_name="requests"
    )

    assigned_copy = models.ForeignKey(
        BookCopy,
        on_delete=models.PROTECT,
        related_name="reservations",
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=RequestStatus.choices,
        default=RequestStatus.PENDING
    )

    requested_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.status})"