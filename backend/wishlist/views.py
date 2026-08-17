from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product

from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, created = Wishlist.objects.get_or_create(
            user=request.user
        )

        serializer = WishlistSerializer(wishlist)

        return Response(serializer.data)


class AddToWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        product_id = request.data.get('product')

        if not product_id:
            return Response(
                {'error': 'Product is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = get_object_or_404(
            Product,
            id=product_id,
            is_active=True
        )

        wishlist, created = Wishlist.objects.get_or_create(
            user=request.user
        )

        item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            product=product
        )

        if not created:
            return Response(
                {
                    'message': 'Product is already in wishlist.',
                    'wishlist': WishlistSerializer(wishlist).data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            WishlistSerializer(wishlist).data,
            status=status.HTTP_201_CREATED
        )


class RemoveFromWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):

        wishlist = get_object_or_404(
            Wishlist,
            user=request.user
        )

        item = get_object_or_404(
            WishlistItem,
            wishlist=wishlist,
            product_id=product_id
        )

        item.delete()

        return Response(
            {'message': 'Product removed from wishlist.'},
            status=status.HTTP_204_NO_CONTENT
        )