from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from .models import Watch, Account, Order


@api_view(['GET'])
def hello_api(request):
    return Response({"message": "Hello from Django backend"})


class WatchPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
def landing_page(request):
    """
    Landing page view that returns featured watches and basic stats
    """
    try:
        # Get recent watches (last 20)
        recent_watches = Watch.objects.filter(availability='available').order_by('-created_at')[:20]
        
        # Get watch count and total sellers
        total_watches = Watch.objects.count()
        total_sellers = Account.objects.count()
        total_sales = Order.objects.filter(payment_status='completed').count()
        
        # Serialize watch data
        watch_data = []
        for watch in recent_watches:
            watch_data.append({
                'watch_id': watch.watch_id,
                'brand': watch.brand,
                'watch_name': watch.watch_name,
                'sale_price': watch.sale_price,
                'condition': watch.condition,
                'seller': watch.seller.user_name,
                'listing_code': watch.listing_code,
                'image_url': None,  # Add image URL if you have image field
            })
        
        return Response({
            'status': 'success',
            'featured_watches': watch_data,
            'stats': {
                'total_watches': total_watches,
                'total_sellers': total_sellers,
                'total_sales': total_sales,
            }
        })
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)


@api_view(['GET'])
def featured_watches(request):
    """
    Get featured/premium watches for display
    """
    try:
        # You can customize this query based on your business logic
        featured = Watch.objects.filter(
            availability='available'
        ).order_by('-created_at')[:12]
        
        watch_data = []
        for watch in featured:
            watch_data.append({
                'watch_id': watch.watch_id,
                'brand': watch.brand,
                'watch_name': watch.watch_name,
                'sale_price': float(watch.sale_price),
                'condition': watch.condition,
                'seller': watch.seller.user_name,
                'listing_code': watch.listing_code,
                'year_of_production': watch.year_of_production,
                'case_material': watch.case_material,
                'movement': watch.movement,
            })
        
        return Response({
            'status': 'success',
            'watches': watch_data,
            'count': len(watch_data)
        })
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)


@api_view(['GET'])
def all_watches(request):
    """
    Get all watches with pagination
    Query parameters:
    - page: page number (default: 1)
    - page_size: number of items per page (default: 12, max: 100)
    - brand: filter by brand
    - condition: filter by condition
    - sort: sort by 'price_asc', 'price_desc', 'newest', 'oldest'
    """
    try:
        # Get query parameters
        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 12)
        brand = request.query_params.get('brand', None)
        condition = request.query_params.get('condition', None)
        sort = request.query_params.get('sort', '-created_at')
        
        # Validate page_size
        try:
            page_size = int(page_size)
            if page_size > 100:
                page_size = 100
            if page_size < 1:
                page_size = 12
        except ValueError:
            page_size = 12
        
        # Build query
        watches_query = Watch.objects.all()
        
        # Apply filters
        if brand:
            watches_query = watches_query.filter(brand__icontains=brand)
        
        if condition:
            watches_query = watches_query.filter(condition__icontains=condition)
        
        # Apply sorting
        if sort == 'price_asc':
            watches_query = watches_query.order_by('sale_price')
        elif sort == 'price_desc':
            watches_query = watches_query.order_by('-sale_price')
        elif sort == 'oldest':
            watches_query = watches_query.order_by('created_at')
        else:  # newest is default
            watches_query = watches_query.order_by('-created_at')
        
        # Get total count
        total_count = watches_query.count()
        
        # Paginate
        start = (int(page) - 1) * page_size
        end = start + page_size
        paginated_watches = watches_query[start:end]
        
        # Serialize watch data
        watch_data = []
        for watch in paginated_watches:
            watch_data.append({
                'watch_id': watch.watch_id,
                'brand': watch.brand,
                'watch_name': watch.watch_name,
                'sale_price': float(watch.sale_price),
                'condition': watch.condition,
                'seller': watch.seller.user_name,
                'listing_code': watch.listing_code,
                'year_of_production': watch.year_of_production,
                'case_material': watch.case_material,
                'bracelet_material': watch.bracelet_material,
                'movement': watch.movement,
                'location': watch.location,
                'availability': watch.availability,
            })
        
        # Calculate pagination info
        total_pages = (total_count + page_size - 1) // page_size
        current_page = int(page)
        
        return Response({
            'status': 'success',
            'watches': watch_data,
            'pagination': {
                'current_page': current_page,
                'total_pages': total_pages,
                'page_size': page_size,
                'total_count': total_count,
                'has_next': current_page < total_pages,
                'has_previous': current_page > 1,
            }
        })
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)


@api_view(['GET'])
def product_detail(request, watch_id):
    """
    Get detailed information for a single watch
    """
    try:
        watch = Watch.objects.get(watch_id=watch_id)
        
        watch_detail = {
            'watch_id': watch.watch_id,
            'brand': watch.brand,
            'watch_name': watch.watch_name,
            'sale_price': float(watch.sale_price),
            'condition': watch.condition,
            'listing_code': watch.listing_code,
            'reference_number': watch.reference_number,
            'movement': watch.movement,
            'case_material': watch.case_material,
            'bracelet_material': watch.bracelet_material,
            'year_of_production': watch.year_of_production,
            'condition_description': watch.condition_description,
            'scope_of_delivery': watch.scope_of_delivery,
            'gender': watch.gender,
            'location': watch.location,
            'availability': watch.availability,
            'currency': watch.currency,
            'negotiable': watch.negotiable,
            'seller': {
                'user_id': watch.seller.user_id,
                'user_name': watch.seller.user_name,
                'email': watch.seller.email,
                'first_name': watch.seller.first_name,
                'last_name': watch.seller.last_name,
            },
            'created_at': watch.created_at,
            'updated_at': watch.updated_at,
        }
        
        return Response({
            'status': 'success',
            'watch': watch_detail
        })
    
    except Watch.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Watch not found'
        }, status=404)
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

