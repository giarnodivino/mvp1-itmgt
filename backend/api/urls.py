from django.urls import path
from .views import hello_api, landing_page, featured_watches, all_watches, product_detail

urlpatterns = [
    path('hello/', hello_api),
    path('landing/', landing_page),
    path('featured-watches/', featured_watches),
    path('all-watches/', all_watches),
    path('product/<int:watch_id>/', product_detail),
]
