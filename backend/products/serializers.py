from rest_framework import serializers
import cloudinary.utils

from .models import (
    Category,
    Product,
    ProductImage,
    ProductVariant,
)


# =========================================================
# PRODUCT IMAGE - DETAIL PAGE
# =========================================================

class ProductImageSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = [
            "id",
            "image",
            "is_primary",
        ]

    def get_image(self, obj):

        if not obj.image:
            return None

        public_id = str(obj.image.name)

        url, options = cloudinary.utils.cloudinary_url(
            public_id,
            secure=True,
            transformation=[
                {
                    "width": 1200,
                    "crop": "limit",
                },
                {
                    "quality": "auto",
                },
                {
                    "fetch_format": "auto",
                },
            ],
        )

        return url


# =========================================================
# PRODUCT IMAGE - SHOP/LISTING
# =========================================================

class ProductListImageSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = [
            "id",
            "image",
            "is_primary",
        ]

    def get_image(self, obj):

        if not obj.image:
            return None

        public_id = str(obj.image.name)

        url, options = cloudinary.utils.cloudinary_url(
            public_id,
            secure=True,
            transformation=[
                {
                    "width": 400,
                    "crop": "limit",
                },
                {
                    "quality": "auto",
                },
                {
                    "fetch_format": "auto",
                },
            ],
        )

        return url


# =========================================================
# PRODUCT VARIANT
# =========================================================

class ProductVariantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "color",
            "size",
            "stock",
        ]


# =========================================================
# CATEGORY
# =========================================================

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "image",
        ]


# =========================================================
# FULL PRODUCT - DETAIL PAGE
# =========================================================

class ProductSerializer(serializers.ModelSerializer):

    images = ProductImageSerializer(
        many=True,
        read_only=True
    )

    variants = ProductVariantSerializer(
        many=True,
        read_only=True
    )

    category = CategorySerializer(
        read_only=True
    )

    class Meta:
        model = Product

        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "original_price",
            "brand",
            "stock",
            "is_active",
            "gender",
            "created_at",
            "updated_at",
            "category",
            "images",
            "variants",
        ]


# =========================================================
# LIGHTWEIGHT PRODUCT - SHOP PAGE
# =========================================================

class ProductListSerializer(serializers.ModelSerializer):

    images = serializers.SerializerMethodField()

    category = serializers.SerializerMethodField()

    variants = ProductVariantSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Product

        fields = [
            "id",
            "name",
            "slug",
            "price",
            "original_price",
            "brand",
            "stock",
            "is_active",
            "gender",
            "category",
            "images",
            "variants",
        ]

    def get_category(self, obj):

        if not obj.category:
            return None

        return {
            "id": obj.category.id,
            "name": obj.category.name,
            "slug": obj.category.slug,
        }

    def get_images(self, obj):

        # Images are prefetched by ProductListView
        # into obj.list_images.

        prefetched_images = getattr(
            obj,
            "list_images",
            []
        )

        if not prefetched_images:
            return []

        # First image is already ordered with
        # primary image first.

        image = prefetched_images[0]

        return [
            ProductListImageSerializer(
                image,
                context=self.context
            ).data
        ]