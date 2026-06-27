"""
Extended viewsets for admin panel features
Add these to views.py
"""
from datetime import date, timedelta
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db.models import Avg, Count, DecimalField, ExpressionWrapper, F, Q, Sum, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView

from .models import (
    UserRole, ProductVariant, ProductAttribute, InventoryLog, StockAlert,
    Coupon, CouponUsage, Banner, Notification, ReviewEnhanced,
    CMSPage, FAQItem, Report, DailySalesMetric, ShippingMethod, EmailTemplate,
    Category, Product, ProductImage, Review, Order, OrderItem, Cart, CartItem,
    Wishlist, WishlistItem, Address
)
from .extended_serializers import (
    UserRoleSerializer, ProductVariantSerializer, ProductAttributeSerializer,
    InventoryLogSerializer, StockAlertSerializer, CouponSerializer, CouponUsageSerializer,
    BannerSerializer, NotificationSerializer, NotificationCreateSerializer,
    ReviewEnhancedSerializer, CMSPageSerializer, FAQItemSerializer, ReportSerializer,
    DailySalesMetricSerializer, ShippingMethodSerializer, EmailTemplateSerializer,
    ProductDetailSerializer, CategoryDetailSerializer, OrderDetailSerializer,
    OrderItemSerializer, DashboardStatsSerializer
)
from .serializers import resolve_stored_image_url
from .permissions import IsAdminOrReadOnly, IsAdmin

User = get_user_model()


# ============================================================================
# PERMISSION CLASSES
# ============================================================================

class IsAdminUser(permissions.BasePermission):
    """Allow access only to admin users"""
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class IsSuperAdmin(permissions.BasePermission):
    """Allow access only to super admin users"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_staff:
            return False
        try:
            return request.user.user_role.role == 'super_admin'
        except:
            return False


# ============================================================================
# AUTHENTICATION & USER ROLES
# ============================================================================

class UserRoleViewSet(viewsets.ModelViewSet):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsSuperAdmin]
    filterset_fields = ['role']
    search_fields = ['user__username', 'user__email']
    
    @action(detail=False, methods=['post'])
    def assign_role(self, request):
        """Assign role to a user"""
        user_id = request.data.get('user_id')
        role = request.data.get('role')
        
        if not user_id or not role:
            return Response({'error': 'user_id and role are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_role = UserRole.objects.get(user_id=user_id)
            user_role.role = role
            user_role.save()
            return Response(UserRoleSerializer(user_role).data)
        except UserRole.DoesNotExist:
            return Response({'error': 'User role not found'}, status=status.HTTP_404_NOT_FOUND)


# ============================================================================
# PRODUCT VARIANTS & ATTRIBUTES
# ============================================================================

class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['product', 'is_active']
    search_fields = ['sku', 'name', 'color', 'size']
    
    def perform_create(self, serializer):
        instance = serializer.save()
        # Create inventory log
        InventoryLog.objects.create(
            product=instance.product,
            variant=instance,
            action='add',
            quantity=instance.stock,
            created_by=self.request.user
        )


class ProductAttributeViewSet(viewsets.ModelViewSet):
    queryset = ProductAttribute.objects.all()
    serializer_class = ProductAttributeSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['product', 'attribute_type']


# ============================================================================
# INVENTORY MANAGEMENT
# ============================================================================

class InventoryLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InventoryLogSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['product', 'action']
    search_fields = ['product__name', 'reference']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return InventoryLog.objects.select_related('product', 'created_by')


class StockAlertViewSet(viewsets.ModelViewSet):
    queryset = StockAlert.objects.all()
    serializer_class = StockAlertSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def low_stock_products(self, request):
        """Get all products with low stock"""
        alerts = StockAlert.objects.filter(
            product__stock__lte=F('low_stock_threshold')
        ).select_related('product')
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)


# ============================================================================
# COUPONS & DISCOUNTS
# ============================================================================

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['discount_type', 'is_active']
    search_fields = ['code']
    
    @action(detail=False, methods=['post'])
    def validate_coupon(self, request):
        """Validate coupon code"""
        code = request.data.get('code')
        cart_total = request.data.get('cart_total', Decimal('0'))
        
        try:
            coupon = Coupon.objects.get(code=code)
            
            if not coupon.is_valid:
                return Response(
                    {'error': 'Coupon is not valid'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if cart_total < coupon.min_cart_value:
                return Response(
                    {'error': f'Minimum cart value should be {coupon.min_cart_value}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(CouponSerializer(coupon).data)
        except Coupon.DoesNotExist:
            return Response({'error': 'Coupon not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def apply_coupon(self, request, pk=None):
        """Apply coupon to order"""
        coupon = self.get_object()
        order_id = request.data.get('order_id')
        
        try:
            order = Order.objects.get(id=order_id)
            usage = CouponUsage.objects.create(
                coupon=coupon,
                user=request.user,
                order=order
            )
            return Response(CouponUsageSerializer(usage).data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)


class CouponUsageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CouponUsageSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['coupon', 'user']
    
    def get_queryset(self):
        return CouponUsage.objects.select_related('coupon', 'user', 'order')


# ============================================================================
# BANNERS & PROMOTIONS
# ============================================================================

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['banner_type', 'is_active']
    ordering_fields = ['display_order', 'created_at']
    ordering = ['display_order']
    
    @action(detail=False, methods=['get'])
    def active_banners(self, request):
        """Get currently active banners"""
        now = timezone.now()
        banners = Banner.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        ).order_by('display_order')
        serializer = self.get_serializer(banners, many=True)
        return Response(serializer.data)


# ============================================================================
# NOTIFICATIONS
# ============================================================================

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['notification_type', 'is_read']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def mark_as_read(self, request):
        """Mark notifications as read"""
        notification_ids = request.data.get('notification_ids', [])
        Notification.objects.filter(id__in=notification_ids).update(
            is_read=True,
            read_at=timezone.now()
        )
        return Response({'status': 'notifications marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get unread notification count"""
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        return Response({'unread_count': count})


# ============================================================================
# REVIEWS
# ============================================================================

class ReviewEnhancedViewSet(viewsets.ModelViewSet):
    queryset = ReviewEnhanced.objects.all()
    serializer_class = ReviewEnhancedSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['approval_status']
    
    @action(detail=True, methods=['post'])
    def approve_review(self, request, pk=None):
        """Approve a review"""
        review_enhanced = self.get_object()
        review_enhanced.approval_status = 'approved'
        review_enhanced.approved_by = request.user
        review_enhanced.approved_at = timezone.now()
        review_enhanced.save()
        
        # Create notification for user
        Notification.objects.create(
            notification_type='review_approval',
            user=review_enhanced.review.user,
            title='Review Approved',
            message=f'Your review for {review_enhanced.review.product.name} has been approved',
            related_product=review_enhanced.review.product
        )
        
        return Response(ReviewEnhancedSerializer(review_enhanced).data)
    
    @action(detail=True, methods=['post'])
    def reject_review(self, request, pk=None):
        """Reject a review"""
        review_enhanced = self.get_object()
        reason = request.data.get('reason', '')
        
        review_enhanced.approval_status = 'rejected'
        review_enhanced.rejection_reason = reason
        review_enhanced.save()
        
        # Create notification
        Notification.objects.create(
            notification_type='review_rejected',
            user=review_enhanced.review.user,
            title='Review Rejected',
            message=f'Your review has been rejected. Reason: {reason}',
            related_product=review_enhanced.review.product
        )
        
        return Response(ReviewEnhancedSerializer(review_enhanced).data)


# ============================================================================
# CMS - CONTENT MANAGEMENT
# ============================================================================

class CMSPageViewSet(viewsets.ModelViewSet):
    queryset = CMSPage.objects.all()
    serializer_class = CMSPageSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    
    @action(detail=False, methods=['get'])
    def published(self, request):
        """Get only published pages"""
        pages = CMSPage.objects.filter(is_published=True)
        serializer = self.get_serializer(pages, many=True)
        return Response(serializer.data)


class FAQItemViewSet(viewsets.ModelViewSet):
    queryset = FAQItem.objects.filter(is_active=True).order_by('display_order')
    serializer_class = FAQItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['category']


# ============================================================================
# REPORTS & ANALYTICS
# ============================================================================

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['report_type', 'status']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['post'])
    def generate_report(self, request):
        """Generate a new report"""
        report_type = request.data.get('report_type')
        export_format = request.data.get('export_format', 'pdf')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        try:
            report = Report.objects.create(
                report_type=report_type,
                export_format=export_format,
                start_date=start_date,
                end_date=end_date,
                generated_by=request.user,
                status='pending'
            )
            return Response(ReportSerializer(report).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DailySalesMetricViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DailySalesMetric.objects.all()
    serializer_class = DailySalesMetricSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['date']
    ordering = ['-date']


# ============================================================================
# SHIPPING & EMAIL
# ============================================================================

class ShippingMethodViewSet(viewsets.ModelViewSet):
    queryset = ShippingMethod.objects.all()
    serializer_class = ShippingMethodSerializer
    permission_classes = [IsAdminOrReadOnly]


class EmailTemplateViewSet(viewsets.ModelViewSet):
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'template_type'


# ============================================================================
# DASHBOARD & ANALYTICS
# ============================================================================

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024


def _format_decimal(value):
    return format(Decimal(str(value or 0)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP), "f")


def _build_growth_payload(current_value, previous_value):
    current = Decimal(str(current_value or 0))
    previous = Decimal(str(previous_value or 0))

    if current == 0 and previous == 0:
        return {"value": Decimal("0"), "label": "0%", "trend": "flat"}

    if previous == 0:
        if current > 0:
            return {"value": None, "label": "New", "trend": "new"}
        return {"value": Decimal("0"), "label": "0%", "trend": "flat"}

    change = ((current - previous) / previous) * 100
    change = change.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
    formatted = format(change, "f").rstrip("0").rstrip(".")
    if not formatted:
        formatted = "0"

    if change > 0:
        trend = "up"
        label = f"+{formatted}%"
    elif change < 0:
        trend = "down"
        label = f"{formatted}%"
    else:
        trend = "flat"
        label = "0%"

    return {"value": change, "label": label, "trend": trend}


def _build_metric_payload(key, label, current_value, previous_value, kind="count"):
    growth = _build_growth_payload(current_value, previous_value)
    return {
        "key": key,
        "label": label,
        "kind": kind,
        "current": current_value,
        "previous": previous_value,
        "growth": growth["value"],
        "growth_label": growth["label"],
        "trend": growth["trend"],
    }


def _validate_image_bytes(uploaded_file):
    header = uploaded_file.read(12)
    uploaded_file.seek(0)

    if len(header) < 4:
        raise ValidationError({"file": "The selected file is empty or corrupted."})

    suffix = Path(uploaded_file.name).suffix.lower()

    if suffix in {".jpg", ".jpeg"} and not header.startswith(b"\xff\xd8\xff"):
        raise ValidationError({"file": "Only JPG, JPEG, PNG, and WEBP files are allowed."})
    if suffix == ".png" and header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValidationError({"file": "Only JPG, JPEG, PNG, and WEBP files are allowed."})
    if suffix == ".webp" and not (header[:4] == b"RIFF" and header[8:12] == b"WEBP"):
        raise ValidationError({"file": "Only JPG, JPEG, PNG, and WEBP files are allowed."})


class AdminImageUploadView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("file") or request.FILES.get("image")
        if not uploaded_file:
            raise ValidationError({"file": "Please choose an image file to upload."})

        suffix = Path(uploaded_file.name).suffix.lower()
        if suffix not in ALLOWED_IMAGE_EXTENSIONS:
            raise ValidationError({"file": "Only JPG, JPEG, PNG, and WEBP files are allowed."})

        if uploaded_file.size > MAX_IMAGE_UPLOAD_SIZE:
            raise ValidationError({"file": "Images must be 5MB or smaller."})

        _validate_image_bytes(uploaded_file)

        saved_path = default_storage.save(
            f"admin/uploads/{uuid4().hex}{suffix}",
            ContentFile(uploaded_file.read()),
        )
        file_url = default_storage.url(saved_path)

        return Response(
            {
                "url": request.build_absolute_uri(file_url),
                "path": saved_path,
                "filename": uploaded_file.name,
                "size": uploaded_file.size,
            },
            status=status.HTTP_201_CREATED,
        )


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Get dashboard statistics."""
        today = timezone.localdate()
        comparison_start = today - timedelta(days=7)

        total_orders = Order.objects.count()
        previous_orders = Order.objects.filter(placed_at__date__lt=comparison_start).count()

        active_products = Product.objects.filter(is_active=True).count()
        previous_products = Product.objects.filter(
            is_active=True,
            created_at__date__lt=comparison_start,
        ).count()

        total_customers = User.objects.filter(is_staff=False, is_superuser=False).count()
        previous_customers = User.objects.filter(
            is_staff=False,
            is_superuser=False,
            date_joined__date__lt=comparison_start,
        ).count()

        delivered_orders = Order.objects.filter(status="delivered")
        total_revenue = delivered_orders.aggregate(total=Sum("total"))["total"] or Decimal("0.00")
        previous_revenue = delivered_orders.filter(placed_at__date__lt=comparison_start).aggregate(total=Sum("total"))["total"] or Decimal("0.00")

        pending_orders = Order.objects.filter(status="pending").count()
        processing_orders = Order.objects.filter(status__in=["confirmed", "packed"]).count()
        shipped_orders = Order.objects.filter(status="shipped").count()
        delivered_count = delivered_orders.count()

        low_stock_products = Product.objects.filter(stock__lte=10, is_active=True).count()
        new_reviews = ReviewEnhanced.objects.filter(approval_status="pending").count()

        revenue_map = {
            row["placed_at__date"]: row
            for row in delivered_orders.filter(
                placed_at__date__range=[comparison_start, today],
            )
            .values("placed_at__date")
            .annotate(total_revenue=Sum("total"), total_orders=Count("id"))
        }
        revenue_series = []
        for offset in range(7):
            day = comparison_start + timedelta(days=offset)
            row = revenue_map.get(day, {})
            revenue_series.append(
                {
                    "date": day.isoformat(),
                    "label": day.strftime("%a"),
                    "revenue": _format_decimal(row.get("total_revenue")),
                    "orders": int(row.get("total_orders") or 0),
                }
            )

        top_product_rows = (
            OrderItem.objects.filter(order__status="delivered")
            .values("product_id", "product__name", "product__slug")
            .annotate(
                units_sold=Sum("quantity"),
                revenue=Coalesce(
                    Sum(
                        ExpressionWrapper(
                            F("quantity") * F("price"),
                            output_field=DecimalField(max_digits=15, decimal_places=2),
                        )
                    ),
                    Value(Decimal("0.00"), output_field=DecimalField(max_digits=15, decimal_places=2)),
                ),
            )
            .order_by("-units_sold", "-revenue")[:10]
        )
        product_ids = [row["product_id"] for row in top_product_rows]
        image_map = {}
        if product_ids:
            for item in ProductImage.objects.filter(product_id__in=product_ids).order_by("-is_primary", "id").values(
                "product_id", "image_url"
            ):
                resolved_image_url = resolve_stored_image_url(item["image_url"], request)
                if resolved_image_url and item["product_id"] not in image_map:
                    image_map[item["product_id"]] = resolved_image_url

        top_products = [
            {
                "id": row["product_id"],
                "name": row["product__name"],
                "slug": row["product__slug"],
                "image_url": image_map.get(row["product_id"], ""),
                "units_sold": int(row["units_sold"] or 0),
                "revenue": _format_decimal(row["revenue"]),
            }
            for row in top_product_rows
        ]

        return Response(
            {
                "cards": [
                    _build_metric_payload("total_orders", "Total Orders", total_orders, previous_orders, "count"),
                    _build_metric_payload("active_products", "Active Products", active_products, previous_products, "count"),
                    _build_metric_payload("customers", "Customers", total_customers, previous_customers, "count"),
                    _build_metric_payload("revenue", "Revenue", _format_decimal(total_revenue), _format_decimal(previous_revenue), "currency"),
                ],
                "status_cards": [
                    {"key": "pending_orders", "label": "Pending Orders", "current": pending_orders, "icon": "clock"},
                    {"key": "processing_orders", "label": "Processing Orders", "current": processing_orders, "icon": "processing"},
                    {"key": "shipped_orders", "label": "Shipped Orders", "current": shipped_orders, "icon": "shipping"},
                    {"key": "delivered_orders", "label": "Delivered Orders", "current": delivered_count, "icon": "delivered"},
                ],
                "revenue_trends": revenue_series,
                "top_products": top_products,
                "quick_stats": {
                    "low_stock_products": low_stock_products,
                    "new_reviews": new_reviews,
                    "comparison_start": comparison_start.isoformat(),
                    "today": today.isoformat(),
                },
            }
        )

    @action(detail=False, methods=["get"])
    def revenue_trends(self, request):
        """Get revenue trends for the last 7 days."""
        days = max(1, int(request.query_params.get("days", 7)))
        end_date = timezone.localdate()
        start_date = end_date - timedelta(days=days - 1)

        revenue_map = {
            row["placed_at__date"]: row
            for row in Order.objects.filter(
                status="delivered",
                placed_at__date__range=[start_date, end_date],
            )
            .values("placed_at__date")
            .annotate(total_revenue=Sum("total"), total_orders=Count("id"))
        }

        series = []
        for offset in range(days):
            day = start_date + timedelta(days=offset)
            row = revenue_map.get(day, {})
            series.append(
                {
                    "date": day.isoformat(),
                    "label": day.strftime("%a"),
                    "revenue": _format_decimal(row.get("total_revenue")),
                    "orders": int(row.get("total_orders") or 0),
                }
            )

        return Response(series)

    @action(detail=False, methods=["get"])
    def top_products(self, request):
        """Get top selling products."""
        limit = max(1, int(request.query_params.get("limit", 10)))
        top_products = (
            OrderItem.objects.filter(order__status="delivered")
            .values("product__name", "product__id", "product__slug")
            .annotate(
                units_sold=Sum("quantity"),
                revenue=Coalesce(
                    Sum(
                        ExpressionWrapper(
                            F("quantity") * F("price"),
                            output_field=DecimalField(max_digits=15, decimal_places=2),
                        )
                    ),
                    Value(Decimal("0.00"), output_field=DecimalField(max_digits=15, decimal_places=2)),
                ),
            )
            .order_by("-units_sold", "-revenue")[:limit]
        )

        product_ids = [row["product__id"] for row in top_products]
        image_map = {}
        if product_ids:
            for item in ProductImage.objects.filter(product_id__in=product_ids).order_by("-is_primary", "id").values(
                "product_id", "image_url"
            ):
                resolved_image_url = resolve_stored_image_url(item["image_url"], request)
                if resolved_image_url and item["product_id"] not in image_map:
                    image_map[item["product_id"]] = resolved_image_url

        payload = [
            {
                "id": row["product__id"],
                "name": row["product__name"],
                "slug": row["product__slug"],
                "image_url": image_map.get(row["product__id"], ""),
                "units_sold": int(row["units_sold"] or 0),
                "revenue": _format_decimal(row["revenue"]),
            }
            for row in top_products
        ]

        return Response(payload)

    @action(detail=False, methods=["get"])
    def top_categories(self, request):
        """Get top categories by sales."""
        limit = max(1, int(request.query_params.get("limit", 10)))
        top_categories = Order.objects.filter(
            status="delivered",
        ).values("items__product__category__name").annotate(
            total_sales=Count("id")
        ).order_by("-total_sales")[:limit]

        return Response(list(top_categories))
