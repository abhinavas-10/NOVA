from decimal import Decimal

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart

from .models import Order, OrderItem
from .serializers import OrderSerializer


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        cart_items = cart.items.select_related(
            'product',
            'variant'
        )

        if not cart_items.exists():
            return Response(
                {'error': 'Your cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        required_fields = [
            'full_name',
            'phone',
            'address',
            'city',
            'state',
            'pincode',
        ]

        for field in required_fields:
            if not request.data.get(field):
                return Response(
                    {'error': f'{field} is required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        total = Decimal('0.00')

        # Check stock and calculate total
        for item in cart_items:

            if item.variant:
                if item.variant.stock < item.quantity:
                    return Response(
                        {
                            'error': (
                                f'Not enough stock for '
                                f'{item.product.name}.'
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                if item.product.stock < item.quantity:
                    return Response(
                        {
                            'error': (
                                f'Not enough stock for '
                                f'{item.product.name}.'
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            total += item.product.price * item.quantity

        # Payment method
        payment_method = request.data.get(
            'payment_method',
            'cod'
        )

        if payment_method not in ['cod', 'online']:
            return Response(
                {'error': 'Invalid payment method.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Demo payment logic
        if payment_method == 'online':
            payment_status = 'paid'
        else:
            payment_status = 'pending'

        # Create order
        order = Order.objects.create(
            user=request.user,
            full_name=request.data['full_name'],
            phone=request.data['phone'],
            address=request.data['address'],
            city=request.data['city'],
            state=request.data['state'],
            pincode=request.data['pincode'],
            total_amount=total,
            payment_method=payment_method,
            payment_status=payment_status,
        )

        # Create order items and reduce stock
        for item in cart_items:

            OrderItem.objects.create(
                order=order,
                product=item.product,
                variant=item.variant,
                product_name=item.product.name,
                price=item.product.price,
                quantity=item.quantity,
            )

            if item.variant:
                item.variant.stock -= item.quantity

                item.variant.save(
                    update_fields=['stock']
                )

            else:
                item.product.stock -= item.quantity

                item.product.save(
                    update_fields=['stock']
                )

        # Empty cart after successful order
        cart.items.all().delete()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(
            user=request.user
        ).prefetch_related('items')

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):

        order = get_object_or_404(
            Order,
            id=order_id,
            user=request.user
        )

        serializer = OrderSerializer(order)

        return Response(serializer.data)