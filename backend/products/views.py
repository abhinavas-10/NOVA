import time

from django.db.models import Prefetch
from rest_framework import generics

from .models import (
    Product,
    Category,
    ProductImage,
)

from .serializers import (
    ProductSerializer,
    ProductListSerializer,
    CategorySerializer,
)


class ProductListView(generics.ListAPIView):

    queryset = (
        Product.objects
        .filter(is_active=True)
        .select_related("category")
        .prefetch_related(
            Prefetch(
                "images",
                queryset=ProductImage.objects.order_by(
                    "-is_primary",
                    "id",
                ),
                to_attr="list_images",
            ),
            "variants",
        )
    )

    serializer_class = ProductListSerializer

    def list(self, request, *args, **kwargs):
        start = time.perf_counter()

        response = super().list(
            request,
            *args,
            **kwargs
        )

        total = time.perf_counter() - start

        print(
            f"\nPRODUCT API TIME: {total:.4f} seconds\n"
        )

        return response


class ProductDetailView(generics.RetrieveAPIView):

    queryset = Product.objects.filter(
        is_active=True
    )

    serializer_class = ProductSerializer

    lookup_field = "slug"


class CategoryListView(generics.ListAPIView):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer