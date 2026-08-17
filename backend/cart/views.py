from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product, ProductVariant

from .models import Cart, CartItem
from .serializers import CartSerializer


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        serializer = CartSerializer(cart)

        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        product_id = request.data.get('product')
        variant_id = request.data.get('variant')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            return Response(
                {'error': 'Product is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {'error': 'Quantity must be a number.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity < 1:
            return Response(
                {'error': 'Quantity must be at least 1.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = get_object_or_404(
            Product,
            id=product_id,
            is_active=True
        )

        variant = None

        if variant_id:
            variant = get_object_or_404(
                ProductVariant,
                id=variant_id,
                product=product
            )

            if variant.stock < quantity:
                return Response(
                    {'error': 'Not enough stock available.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={
                'quantity': quantity
            }
        )

        if not created:
            new_quantity = item.quantity + quantity

            if variant and new_quantity > variant.stock:
                return Response(
                    {'error': 'Not enough stock available.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            item.quantity = new_quantity
            item.save()

        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_201_CREATED
        )


class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):

        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        item = get_object_or_404(
            CartItem,
            id=item_id,
            cart=cart
        )

        quantity = request.data.get('quantity')

        if quantity is None:
            return Response(
                {'error': 'Quantity is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {'error': 'Quantity must be a number.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity < 1:
            return Response(
                {'error': 'Quantity must be at least 1.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if item.variant and quantity > item.variant.stock:
            return Response(
                {'error': 'Not enough stock available.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        item.quantity = quantity
        item.save()

        return Response(
            CartSerializer(cart).data
        )


class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):

        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        item = get_object_or_404(
            CartItem,
            id=item_id,
            cart=cart
        )

        item.delete()

        return Response(
            {'message': 'Item removed from cart.'},
            status=status.HTTP_204_NO_CONTENT
        )