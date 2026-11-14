
from rest_framework import serializers
from django.contrib.auth.models import User

from .models import (
    Category,
    Tag,
    Book,
    BookCopy,
    SavedBook,
    BookRequest
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class BookCopySerializer(serializers.ModelSerializer):
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source="book",
        write_only=True
    )

    book_title = serializers.CharField(
        source="book.title",
        read_only=True
    )

    class Meta:
        model = BookCopy
        fields = [
            "id",
            "book_id",
            "book_title",
            "copy_code",
            "status",
            "added_at"
        ]
        read_only_fields = ["id", "added_at"]


class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        source="tags",
        write_only=True,
        required=False
    )

    available_copies = serializers.IntegerField(read_only=True)

    copies = BookCopySerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "description",
            "publisher",
            "edition",
            "publication_year",
            "cover_image",
            "category",
            "category_id",
            "tags",
            "tag_ids",
            "available_copies",
            "copies",
            "created_at",
            "updated_at"
        ]

class SavedBookSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source="book",
        write_only=True
    )

    class Meta:
        model = SavedBook
        fields = ["id", "book", "book_id", "saved_at"]
        read_only_fields = ["id", "saved_at"]

class BookRequestSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source="book",
        write_only=True
    )

    assigned_copy = BookCopySerializer(read_only=True)

    class Meta:
        model = BookRequest
        fields = [
            "id",
            "book",
            "book_id",
            "assigned_copy",
            "status",
            "requested_at",
            "updated_at"
        ]

        read_only_fields = [
            "id",
            "status",
            "assigned_copy",
            "requested_at",
            "updated_at"
        ]

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)