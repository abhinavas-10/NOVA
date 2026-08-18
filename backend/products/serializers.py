from rest_framework import serializers
import cloudinary.utils

from .models import (
    Category,
    Product,
    ProductImage,
    ProductVariant,
)


class ProductImageSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = [
            'id',
            'image',
            'is_primary',
        ]

    def get_image(self, obj):

        if not obj.image:
            return None

        public_id = str(obj.image.name)

        url, options = cloudinary.utils.cloudinary_url(
            public_id,
            secure=True
        )

        return url


class ProductVariantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = [
            'id',
            'color',
            'size',
            'stock',
        ]


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'image',
        ]


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
            'id',
            'name',
            'slug',
            'description',
            'price',
            'original_price',
            'brand',
            'stock',
            'is_active',
            'gender',
            'created_at',
            'updated_at',
            'category',
            'images',
            'variants',
        ]