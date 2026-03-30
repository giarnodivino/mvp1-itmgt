from django.urls import path
from .views import (
    hello_api,
    watches_list,
    watch_detail,
    get_cart,
    add_cart_item,
    create_order,
    order_detail,
)

urlpatterns = [
    path('hello/', hello_api),
    path('watches/', watches_list),
    path('watches/<int:watch_id>/', watch_detail),
    path('cart/', get_cart),
    path('cart/items/', add_cart_item),
    path('orders/create/', create_order),
    path('orders/<int:order_id>/', order_detail),
]
