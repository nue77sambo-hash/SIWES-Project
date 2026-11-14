from django.shortcuts import render
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Book
from .serializers import CategorySerializer, BookSerializer
from .permissions import IsAdminOrReadOnly
from django.db import models
from rest_framework import viewsets
from .models import SavedBook
from .serializers import SavedBookSerializer
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import BookRequest, BookCopy
from .serializers import BookRequestSerializer

from .serializers import BookCopySerializer

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny

from .serializers import UserRegistrationSerializer

# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.select_related(
        "category"
    ).prefetch_related(
        "tags",
        "copies"
    )

    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()

        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")
        tag = self.request.query_params.get("tag")
        available = self.request.query_params.get("available")

        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(author__icontains=search) |
                models.Q(description__icontains=search)
            )

        if category:
            queryset = queryset.filter(category_id=category)

        if tag:
            queryset = queryset.filter(tags__name__iexact=tag)

        if available == "true":
            queryset = queryset.filter(
                copies__status="available"
            ).distinct()

        return queryset

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny]
    )
    def available(self, request):
        books = self.get_queryset().filter(
            copies__status="available"
        ).distinct()

        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)

class SavedBookViewSet(viewsets.ModelViewSet):
    serializer_class = SavedBookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedBook.objects.filter(
            user=self.request.user
        ).select_related(
            "book",
            "book__category"
        ).prefetch_related(
            "book__tags",
            "book__copies"
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookRequestViewSet(viewsets.ModelViewSet):
    serializer_class = BookRequestSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        return BookRequest.objects.filter(
            user=self.request.user
        ).select_related(
            "book",
            "book__category",
            "assigned_copy"
        )

    def perform_create(self, serializer):
        book = serializer.validated_data["book"]

        if not BookCopy.objects.filter(
            book=book,
            status=BookCopy.CopyStatus.AVAILABLE
        ).exists():
            raise ValidationError(
                {"detail": "This book is currently unavailable."}
            )

        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        book_request = self.get_object()

        if book_request.status != BookRequest.RequestStatus.PENDING:
            raise ValidationError(
                {"detail": "Only pending requests can be cancelled."}
            )

        book_request.status = BookRequest.RequestStatus.CANCELLED
        book_request.save(update_fields=["status", "updated_at"])

        return Response({
            "message": "Reservation request cancelled successfully."
        })

class AdminBookRequestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BookRequest.objects.select_related(
        "user",
        "book",
        "assigned_copy"
    ).all()

    serializer_class = BookRequestSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):

        with transaction.atomic():

            book_request = get_object_or_404(
                BookRequest.objects.select_for_update(),
                pk=pk
            )

            if book_request.status != BookRequest.RequestStatus.PENDING:
                raise ValidationError(
                    {"detail": "This request is no longer pending."}
                )

            # Lock the book row to prevent simultaneous approvals
            # for copies belonging to the same book.
            from .models import Book
            Book.objects.select_for_update().get(
                pk=book_request.book_id
            )

            available_copy = BookCopy.objects.select_for_update().filter(
                book=book_request.book,
                status=BookCopy.CopyStatus.AVAILABLE
            ).first()

            if not available_copy:
                raise ValidationError(
                    {"detail": "No physical copies are currently available."}
                )

            available_copy.status = BookCopy.CopyStatus.RESERVED
            available_copy.save(update_fields=["status"])

            book_request.assigned_copy = available_copy
            book_request.status = BookRequest.RequestStatus.APPROVED
            book_request.save(
                update_fields=[
                    "assigned_copy",
                    "status",
                    "updated_at"
                ]
            )

        return Response({
            "message": "Reservation approved successfully.",
            "request_id": book_request.id,
            "copy_code": available_copy.copy_code
        })

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):

        book_request = self.get_object()

        if book_request.status != BookRequest.RequestStatus.PENDING:
            raise ValidationError(
                {"detail": "Only pending requests can be rejected."}
            )

        book_request.status = BookRequest.RequestStatus.REJECTED
        book_request.save(update_fields=["status", "updated_at"])

        return Response({
            "message": "Reservation rejected successfully."
        })

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):

        with transaction.atomic():

            book_request = get_object_or_404(
                BookRequest.objects.select_for_update(),
                pk=pk
            )

            if book_request.status != BookRequest.RequestStatus.APPROVED:
                raise ValidationError(
                    {"detail": "Only approved requests can be completed."}
                )

            copy = BookCopy.objects.select_for_update().get(
                pk=book_request.assigned_copy_id
            )

            if copy.status != BookCopy.CopyStatus.RESERVED:
                raise ValidationError(
                    {"detail": "The assigned copy is not reserved."}
                )

            copy.status = BookCopy.CopyStatus.BORROWED
            copy.save(update_fields=["status"])

            book_request.status = BookRequest.RequestStatus.COMPLETED
            book_request.save(update_fields=["status", "updated_at"])

        return Response({
            "message": "Reservation marked as completed."
        })

class BookCopyViewSet(viewsets.ModelViewSet):
    queryset = BookCopy.objects.select_related("book").all()
    serializer_class = BookCopySerializer
    permission_classes = [IsAdminUser]

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "message": "Account created successfully.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            },
            status=status.HTTP_201_CREATED
        )