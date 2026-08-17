from rest_framework import serializers

from .models import Cart, CartItem
from products.models import ProductVariant


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    variant_color = serializers.CharField(
        source='variant.color',
        read_only=True
    )

    variant_size = serializers.CharField(
        source='variant.size',
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'product_name',
            'product_price',
            'variant',
            'variant_color',
            'variant_size',
            'quantity',
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Cart
        fields = [
            'id',
            'items',
            'created_at',
            'updated_at',
        ]