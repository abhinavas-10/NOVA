from django.urls import path

from .views import (
    CreateOrderView,
    OrderListView,
    OrderDetailView,
)


urlpatterns = [
    path(
        'create/',
        CreateOrderView.as_view(),
        name='order-create'
    ),

    path(
        '',
        OrderListView.as_view(),
        name='order-list'
    ),

    path(
        '<int:order_id>/',
        OrderDetailView.as_view(),
        name='order-detail'
    ),
]