
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    BookViewSet,
    SavedBookViewSet,
    BookRequestViewSet,
    AdminBookRequestViewSet,
    BookCopyViewSet,
    RegisterView,
    LoginView,
    LogoutView,
    CurrentUserView
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

    # Authentication
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", CurrentUserView.as_view(), name="current-user"),
]