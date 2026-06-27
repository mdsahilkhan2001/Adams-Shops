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
from .extended_views import (
    UserRoleViewSet,
    ProductVariantViewSet,
    ProductAttributeViewSet,
    InventoryLogViewSet,
    StockAlertViewSet,
    CouponViewSet,
    CouponUsageViewSet,
    BannerViewSet,
    NotificationViewSet,
    ReviewEnhancedViewSet,
    CMSPageViewSet,
    FAQItemViewSet,
    ReportViewSet,
    DailySalesMetricViewSet,
    ShippingMethodViewSet,
    EmailTemplateViewSet,
    DashboardViewSet,
    AdminImageUploadView,
)

router = DefaultRouter()
# Existing routes
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"products", ProductViewSet, basename="products")
router.register(r"product-images", ProductImageViewSet, basename="product-images")
router.register(r"reviews", ReviewViewSet, basename="reviews")
router.register(r"cart", CartViewSet, basename="cart")
router.register(r"wishlist", WishlistViewSet, basename="wishlist")
router.register(r"orders", OrderViewSet, basename="orders")
router.register(r"addresses", AddressViewSet, basename="addresses")
router.register(r"auth/register", RegisterViewSet, basename="register")

# Admin routes
router.register(r"admin/users/roles", UserRoleViewSet, basename="user-roles")
router.register(r"admin/products/variants", ProductVariantViewSet, basename="product-variants")
router.register(r"admin/products/attributes", ProductAttributeViewSet, basename="product-attributes")
router.register(r"admin/inventory/logs", InventoryLogViewSet, basename="inventory-logs")
router.register(r"admin/inventory/alerts", StockAlertViewSet, basename="stock-alerts")
router.register(r"admin/coupons", CouponViewSet, basename="coupons")
router.register(r"admin/coupons/usage", CouponUsageViewSet, basename="coupon-usage")
router.register(r"admin/banners", BannerViewSet, basename="banners")
router.register(r"admin/notifications", NotificationViewSet, basename="notifications")
router.register(r"admin/reviews", ReviewEnhancedViewSet, basename="reviews-enhanced")
router.register(r"admin/cms/pages", CMSPageViewSet, basename="cms-pages")
router.register(r"admin/cms/faq", FAQItemViewSet, basename="faq-items")
router.register(r"admin/reports", ReportViewSet, basename="reports")
router.register(r"admin/analytics/daily-metrics", DailySalesMetricViewSet, basename="daily-metrics")
router.register(r"admin/shipping", ShippingMethodViewSet, basename="shipping-methods")
router.register(r"admin/email-templates", EmailTemplateViewSet, basename="email-templates")
router.register(r"admin/dashboard", DashboardViewSet, basename="dashboard")

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", MeView.as_view(), name="auth_me"),
    path("admin/uploads/image/", AdminImageUploadView.as_view(), name="admin-image-upload"),
    path("", include(router.urls)),
]
