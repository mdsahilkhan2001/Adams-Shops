"""
Extended serializers for admin panel features
Add these to serializers.py
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .serializers import StoredImagePathField, resolve_stored_image_url
from .models import (
    UserRole, ProductVariant, ProductAttribute, InventoryLog, StockAlert,
    Coupon, CouponUsage, Banner, Notification, ReviewEnhanced,
    CMSPage, FAQItem, Report, DailySalesMetric, ShippingMethod, EmailTemplate,
    Category, Product, ProductImage, Review, Order, OrderItem, Cart, CartItem,
    Wishlist, WishlistItem, Address
)

User = get_user_model()


# ============================================================================
# AUTHENTICATION & USER ROLES
# ============================================================================

class UserRoleSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserRole
        fields = ['id', 'user', 'user_username', 'user_email', 'role', 'permissions', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    user_role = UserRoleSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'user_role']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError("Passwords don't match.")
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        UserRole.objects.create(user=user, role='customer')
        return user


# ============================================================================
# PRODUCT VARIANTS & ATTRIBUTES
# ============================================================================

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'sku', 'name', 'price', 'compare_at_price', 'stock', 
                 'reserved_stock', 'available_stock', 'weight', 'color', 'size', 'material', 
                 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'available_stock']


class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ['id', 'product', 'attribute_type', 'value']


# ============================================================================
# INVENTORY MANAGEMENT
# ============================================================================

class InventoryLogSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = InventoryLog
        fields = ['id', 'product', 'product_name', 'variant', 'action', 'quantity', 'reference', 
                 'notes', 'created_by', 'created_by_username', 'created_at']
        read_only_fields = ['created_at']


class StockAlertSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    current_stock = serializers.SerializerMethodField()
    
    class Meta:
        model = StockAlert
        fields = ['id', 'product', 'product_name', 'low_stock_threshold', 'current_stock', 
                 'alert_sent', 'alert_sent_at']
    
    def get_current_stock(self, obj):
        return obj.product.stock


# ============================================================================
# COUPONS & DISCOUNTS
# ============================================================================

class CouponUsageSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    order_id = serializers.CharField(source='order.id', read_only=True)
    
    class Meta:
        model = CouponUsage
        fields = ['id', 'coupon', 'user', 'user_username', 'order', 'order_id', 'used_at']
        read_only_fields = ['used_at']


class CouponSerializer(serializers.ModelSerializer):
    usages = CouponUsageSerializer(many=True, read_only=True)
    is_valid = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_type', 'discount_value', 'min_cart_value', 
                 'max_usage_per_user', 'total_usage_limit', 'start_date', 'end_date',
                 'applicable_categories', 'applicable_products', 'is_active', 'is_valid',
                 'usages', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'usages']


# ============================================================================
# BANNERS & PROMOTIONS
# ============================================================================

class BannerSerializer(serializers.ModelSerializer):
    is_active_now = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Banner
        fields = ['id', 'title', 'banner_type', 'image_url', 'link', 'start_date', 'end_date',
                 'display_order', 'is_active', 'is_active_now', 'target_category', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


# ============================================================================
# NOTIFICATIONS
# ============================================================================

class NotificationSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    product_name = serializers.CharField(source='related_product.name', read_only=True, allow_null=True)
    order_id = serializers.CharField(source='related_order.id', read_only=True, allow_null=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'user', 'user_username', 'title', 'message',
                 'related_product', 'product_name', 'related_order', 'order_id',
                 'is_read', 'created_at', 'read_at']
        read_only_fields = ['created_at', 'user']


class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['notification_type', 'user', 'title', 'message', 'related_product', 'related_order']


# ============================================================================
# REVIEWS
# ============================================================================

class ReviewEnhancedSerializer(serializers.ModelSerializer):
    review_data = serializers.SerializerMethodField()
    approved_by_username = serializers.CharField(source='approved_by.username', read_only=True, allow_null=True)
    
    class Meta:
        model = ReviewEnhanced
        fields = ['id', 'review', 'review_data', 'approval_status', 'approved_by', 'approved_by_username',
                 'approved_at', 'rejection_reason', 'helpful_count', 'unhelpful_count']
    
    def get_review_data(self, obj):
        review = obj.review
        return {
            'id': review.id,
            'product': review.product.id,
            'product_name': review.product.name,
            'user': review.user.id,
            'user_username': review.user.username,
            'rating': review.rating,
            'title': review.title,
            'body': review.body,
            'created_at': review.created_at,
        }


# ============================================================================
# CMS - CONTENT MANAGEMENT
# ============================================================================

class CMSPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CMSPage
        fields = ['id', 'title', 'slug', 'page_type', 'content', 'meta_title', 'meta_description',
                 'is_published', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = ['id', 'question', 'answer', 'category', 'display_order', 'is_active',
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


# ============================================================================
# REPORTS & ANALYTICS
# ============================================================================

class ReportSerializer(serializers.ModelSerializer):
    generated_by_username = serializers.CharField(source='generated_by.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Report
        fields = ['id', 'report_type', 'export_format', 'start_date', 'end_date',
                 'generated_by', 'generated_by_username', 'file_url', 'status',
                 'created_at', 'completed_at']
        read_only_fields = ['created_at', 'completed_at']


class DailySalesMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySalesMetric
        fields = ['id', 'date', 'total_orders', 'total_revenue', 'total_customers', 'low_stock_products']


# ============================================================================
# SHIPPING & EMAIL
# ============================================================================

class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = ['id', 'name', 'description', 'base_cost', 'free_shipping_above', 'estimated_days', 'is_active']


class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = ['id', 'template_type', 'subject', 'body', 'variables', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


# ============================================================================
# ENHANCED PRODUCT & CATEGORY SERIALIZERS
# ============================================================================

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = StoredImagePathField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image_url', 'alt_text', 'is_primary']


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    attributes = ProductAttributeSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    reviews_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'category', 'category_name', 'name', 'slug', 'description', 'short_description',
                 'price', 'compare_at_price', 'stock', 'sku', 'brand', 'tags', 'weight',
                 'is_featured', 'is_best_seller', 'is_trending', 'is_active',
                 'sizes', 'colors', 'materials',
                 'seo_title', 'seo_description', 'seo_keywords',
                 'images', 'variants', 'attributes',
                 'reviews_count', 'average_rating', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_reviews_count(self, obj):
        return obj.reviews.count()
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0
        return sum(r.rating for r in reviews) / len(reviews)


class CategoryDetailSerializer(serializers.ModelSerializer):
    image_url = StoredImagePathField(required=False, allow_blank=True, allow_null=True)
    products_count = serializers.SerializerMethodField()
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image_url', 'banner_image_url',
                 'seo_title', 'seo_description', 'display_order', 'is_hidden',
                 'parent_category', 'products_count', 'subcategories']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()
    
    def get_subcategories(self, obj):
        subs = obj.subcategories.all()
        return CategoryDetailSerializer(subs, many=True).data if subs else []


# ============================================================================
# ORDER MANAGEMENT
# ============================================================================

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'product_name', 'product_image', 'quantity', 'price']
    
    def get_product_image(self, obj):
        image = obj.product.images.filter(is_primary=True).first() or obj.product.images.first()
        if not image:
            return None
        return resolve_stored_image_url(image.image_url, self.context.get("request"))


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    shipping_address_data = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'user_email', 'status', 'total', 'currency',
                 'shipping_address', 'shipping_address_data', 'payment_method', 'payment_status',
                 'tracking_number', 'estimated_delivery', 'notes', 'admin_notes',
                 'items', 'placed_at', 'updated_at']
        read_only_fields = ['placed_at', 'updated_at']
    
    def get_shipping_address_data(self, obj):
        if obj.shipping_address:
            return {
                'full_name': obj.shipping_address.full_name,
                'line1': obj.shipping_address.line1,
                'line2': obj.shipping_address.line2,
                'city': obj.shipping_address.city,
                'state': obj.shipping_address.state,
                'postal_code': obj.shipping_address.postal_code,
                'country': obj.shipping_address.country,
                'phone': obj.shipping_address.phone,
            }
        return None


# ============================================================================
# DASHBOARD STATISTICS
# ============================================================================

class DashboardStatsSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    today_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    pending_orders = serializers.IntegerField()
    cancelled_orders = serializers.IntegerField()
    low_stock_products = serializers.IntegerField()
    new_reviews = serializers.IntegerField()
