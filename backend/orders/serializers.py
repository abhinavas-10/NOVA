from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'variant',
            'product_name',
            'price',
            'quantity',
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id',
            'full_name',
            'phone',
            'address',
            'city',
            'state',
            'pincode',
            'total_amount',
            'payment_method',
            'payment_status',
            'status',
            'items',
            'created_at',
            'updated_at',
        ]