from django.contrib import admin
from .models import Category, Tag, Book, BookCopy, SavedBook, BookRequest

# Register your models here.

admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Book)
admin.site.register(BookCopy)
admin.site.register(SavedBook)
admin.site.register(BookRequest)