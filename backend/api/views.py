from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

WATCHES = [
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
    },
]

CART = {
    "items": [],
    "subtotal": "0.00",
    "shipping": "100.00",
    "total": "100.00",
}

ORDERS = []


def _find_watch(watch_id):
    return next((watch for watch in WATCHES if watch["id"] == watch_id), None)


def _recalculate_cart():
    subtotal = sum(float(item["watch"]["price"].replace(",", "")) for item in CART["items"])
    CART["subtotal"] = f"{subtotal:,.2f}"
    total = subtotal + float(CART["shipping"])
    CART["total"] = f"{total:,.2f}"


@api_view(['GET'])
def hello_api(request):
    return Response({"message": "Hello from Django backend"})


@api_view(['GET'])
def watches_list(request):
    return Response(WATCHES)


@api_view(['GET'])
def watch_detail(request, watch_id):
    watch = _find_watch(int(watch_id))
    if not watch:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(watch)


@api_view(['GET'])
def get_cart(request):
    return Response(CART)


@api_view(['POST'])
def add_cart_item(request):
    watch_id = request.data.get("watch_id")
    if watch_id is None:
        return Response({"detail": "watch_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    watch = _find_watch(int(watch_id))
    if not watch:
        return Response({"detail": "Watch not found."}, status=status.HTTP_404_NOT_FOUND)

    existing_item = next((item for item in CART["items"] if item["watch"]["id"] == watch["id"]), None)
    if existing_item:
        existing_item["quantity"] += int(request.data.get("quantity", 1))
    else:
        CART["items"].append({
            "id": len(CART["items"]) + 1,
            "watch": watch,
            "quantity": int(request.data.get("quantity", 1)),
        })

    _recalculate_cart()
    return Response(CART)


@api_view(['POST'])
def create_order(request):
    order_id = len(ORDERS) + 1
    payload = request.data.copy()
    total_amount = CART["total"] if CART["items"] else "0.00"
    order = {
        "id": order_id,
        "full_name": payload.get("full_name", ""),
        "email": payload.get("email", ""),
        "address": payload.get("address", ""),
        "payment_method": payload.get("payment_method", ""),
        "delivery_method": payload.get("delivery_method", ""),
        "total_amount": total_amount,
        "items": CART["items"],
    }
    ORDERS.append(order)
    return Response(order, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def order_detail(request, order_id):
    order = next((order for order in ORDERS if order["id"] == int(order_id)), None)
    if not order:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(order)

