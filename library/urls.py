
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    CategoryViewSet,
    BookViewSet,
    SavedBookViewSet,
    BookRequestViewSet,
    AdminBookRequestViewSet,
    BookCopyViewSet,
    RegisterView
)

router = DefaultRouter()

router.register("categories", CategoryViewSet, basename="categories")
router.register("books", BookViewSet, basename="books")
router.register("saved-books", SavedBookViewSet, basename="saved-books")
router.register("book-requests", BookRequestViewSet, basename="book-requests")
router.register(
    "admin/book-requests",
    AdminBookRequestViewSet,
    basename="admin-book-requests"
)
router.register("admin/book-copies", BookCopyViewSet, basename="book-copies")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", obtain_auth_token, name="login"),
]
