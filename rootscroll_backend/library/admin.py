from django.contrib import admin
from .models import (Category, Tag, Book, BookCopy, SavedBook, BookRequest)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "author",
        "category",
        "publication_year",
        "available_copies",
    )

    list_filter = ("category", "publication_year")
    search_fields = ("title", "author", "publisher")
    filter_horizontal = ("tags",)


@admin.register(BookCopy)
class BookCopyAdmin(admin.ModelAdmin):
    list_display = ("copy_code", "book", "status", "added_at")
    list_filter = ("status",)
    search_fields = ("copy_code", "book__title")


@admin.register(SavedBook)
class SavedBookAdmin(admin.ModelAdmin):
    list_display = ("user", "book", "saved_at")
    search_fields = ("user__username", "book__title")


@admin.register(BookRequest)
class BookRequestAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "book",
        "status",
        "requested_at",
    )
    list_filter = ("status",)
    search_fields = ("user__username", "book__title")