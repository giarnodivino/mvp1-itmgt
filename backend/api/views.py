from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from .models import Watch, Account, Order, Cart, PromoCodeUsage


# --- STATIC DATA (Keep for reference or fallback) ---

WATCHES_MOCK = [
    {
        "id": 1,
        "brand": "Rolex",
        "model": "Submariner",
        "reference_number": "126610LN",
        "condition": "Excellent",
        "price": "245,000.00",
        "seller_name": "Kronos Watches",
        "description": "A timeless dive watch with a black dial and ceramic bezel.",
        "verification": ["Authenticated Seller", "Warranty Verified"],
        "image_url": "/images/Rolex_Submariner.png",
        "sku": "RO-126610LN",
        "availability": "Available",
    },
    {
        "id": 2,
        "brand": "Omega",
        "model": "Speedmaster Professional",
        "reference_number": "311.30.42.30.01.005",
        "condition": "Very Good",
        "price": "155,000.00",
        "seller_name": "Kronos Watches",
        "description": "The legendary Moonwatch with manual-wind chronograph movement.",
        "verification": ["Authenticated Seller"],
        "image_url": "/images/Omega_Speedmaster.png",
        "sku": "OM-31130423001005",
        "availability": "Available",
    },
    {
        "id": 3,
        "brand": "Tudor",
        "model": "Black Bay Fifty-Eight",
        "reference_number": "79030N",
        "condition": "Excellent",
        "price": "110,000.00",
        "seller_name": "Kronos Watches",
        "description": "A vintage-inspired dive watch with a sleek matte-black bezel.",
        "verification": ["Authenticated Seller"],
        "image_url": "/images/Tudor_Blackbay.png",
        "sku": "TU-79030N",
        "availability": "Available",
    },
    {
        "id": 4,
        "brand": "Cartier",
        "model": "Santos-Dumont",
        "reference_number": "CRWSSA0007",
        "condition": "Very Good",
        "price": "165,000.00",
        "seller_name": "Kronos Watches",
        "description": "An elegant classic with a polished case and iconic square dial.",
        "verification": ["Authenticated Seller"],
        "image_url": "/images/Cartier_Dumont.png",
        "sku": "CA-WSSA0007",
        "availability": "Sold",
    }
]

PROMOCODE_MOCK = {
    "SAVE10": {"discount": 10000.00, "description": "Save PHP 10,000.00 on your order!"},
    "WELCOME15": {"discount": 15000.00, "description": "Welcome offer: Save PHP 15,000.00 on your first purchase!"},
}

@api_view(['POST'])
def apply_promo_code(request):
    promo_code = request.data.get('promo_code', '')
    if not promo_code:
        return Response({'error': 'Promo code is required.'}, status=status.HTTP_400_BAD_REQUEST)

    promo_key = promo_code.strip().upper()
    promo = PROMOCODE_MOCK.get(promo_key)

    if not promo:
        return Response({'error': 'Invalid promo code.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'code': promo_key,
        'discount': promo['discount'],
        'description': promo['description'],
    })

CART_STORAGE = []

# --- UTILITY / GENERAL ---

AVAILABLE_STATUS = "Available"

def get_available_watches():
    return [
        w for w in WATCHES_MOCK
        if w.get("availability", "").strip().lower() == AVAILABLE_STATUS.lower()
    ]

@api_view(['GET'])
def hello_api(request):
    return Response({"message": "Hello from Django backend"})

class WatchPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

# --- PRODUCT VIEWS (Homepage & Listing) ---

@api_view(['GET'])
def landing_page(request):
    available_watches = get_available_watches()
    total_watches = len(available_watches)
    total_sellers = Account.objects.count()
    

    return Response({
        'stats': {
            'total_watches': total_watches,
            'total_sellers': total_sellers,
        },
        'featured_watches': available_watches[:4]
    })
    
@api_view(['GET'])
def all_watches(request):
    """Temporary fix to show mock data instead of empty DB."""
    try:
        watch_data = get_available_watches()

        # If your frontend expects specific field names (like watch_name instead of model)
        # you may need to map them here, but for now, let's just send the list:
        return Response(watch_data)
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def product_detail(request, watch_id):
    """Returns full details for the Watch Detail Page."""
    watch = next(
        (w for w in get_available_watches() if w["id"] == int(watch_id)),
        None
    )
    
    if watch:
        return Response(watch)
    return Response({'detail': 'Watch not found.'}, status=status.HTTP_404_NOT_FOUND)


# --- CART VIEWS ---

@api_view(['GET'])
def get_user_cart(request):
    """This function provides the data for CartPage.jsx"""
    
    # 3. Calculate totals for the Order Summary sidebar
    # We strip commas from your mock price strings to do math, and support quantity
    subtotal_val = sum(
        (float(item['watch']['price'].replace(',', '')) * item.get('quantity', 1))
        for item in CART_STORAGE
    )
    shipping_val = 100.00
    total_val = subtotal_val + shipping_val

    # 4. Return the object structure your React state expects
    return Response({
        "items": CART_STORAGE,
        "subtotal": f"{subtotal_val:,.2f}",
        "shipping": f"{shipping_val:,.2f}",
        "total": f"{total_val:,.2f}"
    })

@api_view(['POST'])
def addToCart(request):
    watch_id = request.data.get('watch_id')
    
    # 1. Find the watch in your mock data and make sure the listing is still available
    watch_item = next(
        (item for item in WATCHES_MOCK if item["id"] == int(watch_id)),
        None
    )

    if not watch_item or watch_item.get("availability", "").strip().lower() != AVAILABLE_STATUS.lower():
        return Response({"error": "Watch listing is no longer available."}, status=400)

    requested_watch_id = int(watch_id)
    existing_item = next(
        (item for item in CART_STORAGE if int(item["watch"]["id"]) == requested_watch_id),
        None
    )

    if existing_item:
        return Response({"error": "Item already in cart."}, status=400)

    CART_STORAGE.append({
        "id": len(CART_STORAGE) + 1,
        "watch": watch_item,
    })

    return Response({"status": "success"}, status=201)

@api_view(['DELETE'])
def remove_from_cart(request, cart_id):
    global CART_STORAGE
    # Filter the list to exclude the item with the matching ID
    CART_STORAGE = [item for item in CART_STORAGE if item['id'] != int(cart_id)]
    return Response({"status": "success", "message": "Item removed"})

# --- ORDER & CHECKOUT VIEWS ---
@api_view(['POST'])
def checkout(request, user_id):
    try:
        user = Account.objects.get(user_id=user_id)
        cart_items = Cart.objects.filter(buyer=user)
        
        if not cart_items.exists():
            return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Calculate Subtotal from Database (Never trust the frontend price!)
        subtotal = sum(item.watch.sale_price for item in cart_items)
        discount = 0.00
        
        # 2. Re-validate the Promo Code
        promo_code = request.data.get('promo_code')
        if promo_code:
            # Check if code is valid and hasn't been used by this user yet
            # This uses the PromoCodeUsage model you imported
            already_used = PromoCodeUsage.objects.filter(user=user, code=promo_code).exists()
            
            if not already_used:
                discount = 10.00  # Or look up the actual value in a Promo table
                # 3. Record the usage so they can't use it again
                PromoCodeUsage.objects.create(user=user, code=promo_code)
            else:
                return Response({'detail': 'Promo code already used'}, status=400)

        # 4. Final Calculation
        total_price = subtotal - discount

        # 5. Create the real Order
        order = Order.objects.create(
            buyer=user,
            total_price=total_price,
            payment_status='completed',
            shipping_address=request.data.get('shipping_address')
        )

        # 6. Clear the Cart after successful purchase
        cart_items.delete()

        return Response({
            'status': 'success',
            'order_id': order.order_id,
            'final_total': float(total_price),
            'discount_applied': discount
        }, status=status.HTTP_201_CREATED)

    except Account.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=404)
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=500)

@api_view(['GET'])
def view_orders(request, user_id):
    """View the user's order history."""
    orders = Order.objects.filter(buyer_id=user_id)
    order_list = [{
        'order_id': o.order_id,
        'total_price': float(o.total_price),
        'payment_status': o.payment_status,
        'created_at': o.created_at,
    } for o in orders]
    return Response({'status': 'success', 'orders': order_list})

@api_view(['POST'])
def create_order(request):
    try:
        data = request.data
        
        # 1. Safely fetch the account
        buyer_id = data.get('buyer')
        try:
            buyer_account = Account.objects.get(id=buyer_id)
        except Account.DoesNotExist:
            return Response({"error": f"Account with ID {buyer_id} does not exist."}, status=400)

        # 2. Create the order
        order = Order.objects.create(
            buyer=buyer_account,
            full_name=data.get('full_name'),
            payment_method=data.get('payment_method'),
            delivery_method=data.get('delivery_method'),
            total_price=data.get('total_price', 0.00),
            shipping_cost=data.get('shipping_cost', 100.00),
            payment_status=data.get('payment_status', 'pending'),
            
            shipping_address_line_1=data.get('shipping_address_line_1'),
            shipping_address_line_2=data.get('shipping_address_line_2', ''),
            shipping_city=data.get('shipping_city'),
            shipping_region=data.get('shipping_region'),
            shipping_zip_code=data.get('shipping_zip_code')
        )
        
        # 3. Safely handle the watches Many-to-Many relationship
        watch_ids = [wid for wid in (data.get('watches', []) or []) if wid is not None]
        valid_watches = Watch.objects.none()
        if watch_ids:
            # 👉 CHANGED 'id__in' to 'watch_id__in' to match your Watch model!
            valid_watches = Watch.objects.filter(watch_id__in=watch_ids)
            order.watches.set(valid_watches)

        # 4. Mark fulfilled listings as sold
        if valid_watches.exists():
            valid_watches.update(availability='Sold')

        # Mirror sold state in the mock listing data, if any matching mock items exist
        for watch_id in watch_ids:
            mock_watch = next((w for w in WATCHES_MOCK if w.get('id') == watch_id), None)
            if mock_watch:
                mock_watch['availability'] = 'Sold'

        return Response({
            "order_id": order.pk, 
            "full_name": order.full_name,
            "total_price": str(order.total_price), 
            "payment_status": order.payment_status,
            "delivery_method": order.delivery_method
        }, status=201)
        
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
# 👉 Add this to the very bottom of views.py
@api_view(['GET'])
def get_order_by_id(request, id):
    try:
        # Look up the order using the URL parameter id
        order = Order.objects.get(pk=id)
        
        return Response({
            "order_id": order.pk,
            "full_name": order.full_name,
            "total_price": str(order.total_price),
            "payment_status": order.payment_status,
            "delivery_method": order.delivery_method
        })
    except Order.DoesNotExist:
        return Response({"error": "Order not found."}, status=404)