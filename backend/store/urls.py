from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CategoryViewSet,
    ProductViewSet,
    ProductImageViewSet,
    ReviewViewSet,
    CartViewSet,
    WishlistViewSet,
    OrderViewSet,
    AddressViewSet,
    RegisterViewSet,
    MeView,
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"products", ProductViewSet, basename="products")
router.register(r"product-images", ProductImageViewSet, basename="product-images")
router.register(r"reviews", ReviewViewSet, basename="reviews")
router.register(r"cart", CartViewSet, basename="cart")
router.register(r"wishlist", WishlistViewSet, basename="wishlist")
router.register(r"orders", OrderViewSet, basename="orders")
router.register(r"addresses", AddressViewSet, basename="addresses")
router.register(r"auth/register", RegisterViewSet, basename="register")

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", MeView.as_view(), name="auth_me"),
    path("", include(router.urls)),
]
