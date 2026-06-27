from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from decimal import Decimal

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    banner_image_url = models.URLField(blank=True, null=True)
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=160, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_hidden = models.BooleanField(default=False)
    parent_category = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories'
    )

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE)
    name = models.CharField(max_length=180)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=120, unique=True)
    brand = models.CharField(max_length=100, blank=True)
    tags = models.CharField(max_length=255, blank=True)  # Comma-separated
    weight = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text="In kg")
    
    # Status fields
    is_featured = models.BooleanField(default=False)
    is_best_seller = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Variant options
    sizes = models.JSONField(default=list, blank=True)
    colors = models.JSONField(default=list, blank=True)
    materials = models.JSONField(default=list, blank=True)
    
    # SEO fields
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=160, blank=True)
    seo_keywords = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image_url = models.URLField()
    alt_text = models.CharField(max_length=180, blank=True)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product.name} image"


class Review(models.Model):
    product = models.ForeignKey(Product, related_name="reviews", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="reviews", on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)
    title = models.CharField(max_length=120)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.rating}"


class Address(models.Model):
    user = models.ForeignKey(User, related_name="addresses", on_delete=models.CASCADE)
    full_name = models.CharField(max_length=120)
    line1 = models.CharField(max_length=180)
    line2 = models.CharField(max_length=180, blank=True)
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=120)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=120, default="India")
    phone = models.CharField(max_length=40, blank=True)

    def __str__(self):
        return f"{self.full_name} - {self.city}"


class Cart(models.Model):
    user = models.ForeignKey(User, related_name="carts", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Cart {self.id} - {self.user}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="cart_items", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    selected_size = models.CharField(max_length=20, blank=True)
    selected_color = models.CharField(max_length=40, blank=True)
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class Wishlist(models.Model):
    user = models.ForeignKey(User, related_name="wishlists", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wishlist {self.id} - {self.user}"


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="wishlisted", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("packed", "Packed"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
        ("returned", "Returned"),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('cod', 'Cash On Delivery'),
        ('razorpay', 'Razorpay'),
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
    ]

    user = models.ForeignKey(User, related_name="orders", on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="INR")
    shipping_address = models.ForeignKey(Address, related_name="orders", on_delete=models.SET_NULL, null=True)
    
    # Payment fields
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cod')
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ], default='pending')
    
    # Shipping info
    tracking_number = models.CharField(max_length=100, blank=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    
    # Additional fields
    notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    placed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="order_items", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.order.id} - {self.product.name}"


# ============================================================================
# ADMIN & USER ROLE MANAGEMENT
# ============================================================================

class UserRole(models.Model):
    """User roles for RBAC"""
    ROLE_CHOICES = [
        ('guest', 'Guest'),
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_role')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    permissions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

    class Meta:
        indexes = [models.Index(fields=['role'])]


# ============================================================================
# PRODUCT VARIANTS & ATTRIBUTES
# ============================================================================

class ProductVariant(models.Model):
    """Product variants for different color, size combinations"""
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    sku = models.CharField(max_length=120, unique=True)
    name = models.CharField(max_length=180)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    stock = models.PositiveIntegerField(default=0)
    reserved_stock = models.PositiveIntegerField(default=0)
    weight = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True, help_text="In kg"
    )
    
    color = models.CharField(max_length=100, blank=True)
    size = models.CharField(max_length=100, blank=True)
    material = models.CharField(max_length=100, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.name} ({self.sku})"

    @property
    def available_stock(self):
        """Calculate available stock excluding reserved"""
        return max(0, self.stock - self.reserved_stock)

    class Meta:
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['product', 'is_active']),
        ]


class ProductAttribute(models.Model):
    """Reusable product attributes"""
    ATTRIBUTE_TYPE_CHOICES = [
        ('color', 'Color'),
        ('size', 'Size'),
        ('material', 'Material'),
        ('brand', 'Brand'),
    ]
    
    product = models.ForeignKey(Product, related_name='attributes', on_delete=models.CASCADE)
    attribute_type = models.CharField(max_length=50, choices=ATTRIBUTE_TYPE_CHOICES)
    value = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.product.name} - {self.attribute_type}: {self.value}"


# ============================================================================
# INVENTORY MANAGEMENT
# ============================================================================

class InventoryLog(models.Model):
    """Track inventory changes"""
    ACTION_CHOICES = [
        ('add', 'Added'),
        ('remove', 'Removed'),
        ('adjust', 'Adjusted'),
        ('sale', 'Sold'),
        ('return', 'Returned'),
    ]
    
    product = models.ForeignKey(Product, related_name='inventory_logs', on_delete=models.CASCADE)
    variant = models.ForeignKey(
        ProductVariant, related_name='inventory_logs', on_delete=models.SET_NULL, null=True, blank=True
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    quantity = models.IntegerField()
    reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='inventory_logs')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.action} {self.quantity}"

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['product', '-created_at'])]


class StockAlert(models.Model):
    """Alert when product stock is low"""
    product = models.OneToOneField(Product, related_name='stock_alert', on_delete=models.CASCADE)
    low_stock_threshold = models.PositiveIntegerField(default=10)
    alert_sent = models.BooleanField(default=False)
    alert_sent_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Stock Alert: {self.product.name}"


# ============================================================================
# COUPONS & DISCOUNTS
# ============================================================================

class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
        ('free_shipping', 'Free Shipping'),
    ]
    
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))]
    )
    
    min_cart_value = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))]
    )
    max_usage_per_user = models.PositiveIntegerField(default=1)
    total_usage_limit = models.PositiveIntegerField(null=True, blank=True)
    
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    applicable_categories = models.ManyToManyField(
        Category, blank=True, related_name='applicable_coupons'
    )
    applicable_products = models.ManyToManyField(
        Product, blank=True, related_name='applicable_coupons'
    )
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.code

    @property
    def is_valid(self):
        """Check if coupon is still valid"""
        now = timezone.now()
        return self.is_active and self.start_date <= now <= self.end_date

    class Meta:
        ordering = ['-created_at']


class CouponUsage(models.Model):
    """Track coupon usage per user"""
    coupon = models.ForeignKey(Coupon, related_name='usages', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='coupon_usages', on_delete=models.CASCADE)
    order = models.ForeignKey(Order, related_name='used_coupon', on_delete=models.SET_NULL, null=True)
    used_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['coupon', 'user', 'order']


# ============================================================================
# BANNERS & PROMOTIONS
# ============================================================================

class Banner(models.Model):
    BANNER_TYPE_CHOICES = [
        ('homepage', 'Homepage'),
        ('category', 'Category'),
        ('sale', 'Sale'),
        ('popup', 'Popup'),
    ]
    
    title = models.CharField(max_length=180)
    banner_type = models.CharField(max_length=20, choices=BANNER_TYPE_CHOICES)
    image_url = models.URLField()
    link = models.URLField(blank=True)
    
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    target_category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def is_active_now(self):
        """Check if banner should be displayed"""
        now = timezone.now()
        return self.is_active and self.start_date <= now <= self.end_date

    class Meta:
        ordering = ['display_order', '-created_at']


# ============================================================================
# NOTIFICATIONS
# ============================================================================

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('order_status', 'Order Status'),
        ('low_stock', 'Low Stock Alert'),
        ('new_customer', 'New Customer'),
        ('new_review', 'New Review'),
        ('payment_failed', 'Payment Failed'),
        ('password_reset', 'Password Reset'),
    ]
    
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=180)
    message = models.TextField()
    related_product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, blank=True
    )
    related_order = models.ForeignKey(
        Order, on_delete=models.SET_NULL, null=True, blank=True
    )
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.notification_type} - {self.user.username}"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['is_read']),
        ]


# ============================================================================
# REVIEWS ENHANCEMENT
# ============================================================================

class ReviewEnhanced(models.Model):
    """Enhanced review model with approval workflow"""
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    review = models.OneToOneField(Review, on_delete=models.CASCADE, related_name='enhanced')
    approval_status = models.CharField(
        max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending'
    )
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_reviews'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    helpful_count = models.PositiveIntegerField(default=0)
    unhelpful_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Review Enhanced: {self.review.product.name}"


# ============================================================================
# CMS - CONTENT MANAGEMENT
# ============================================================================

class CMSPage(models.Model):
    PAGE_TYPE_CHOICES = [
        ('about', 'About Us'),
        ('privacy', 'Privacy Policy'),
        ('terms', 'Terms & Conditions'),
        ('contact', 'Contact Us'),
        ('faq', 'FAQ'),
        ('custom', 'Custom Page'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    page_type = models.CharField(max_length=50, choices=PAGE_TYPE_CHOICES)
    content = models.TextField()
    meta_title = models.CharField(max_length=160, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class FAQItem(models.Model):
    """FAQ items for FAQ page"""
    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.CharField(max_length=100, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question

    class Meta:
        ordering = ['display_order']


# ============================================================================
# REPORTS & ANALYTICS
# ============================================================================

class Report(models.Model):
    REPORT_TYPE_CHOICES = [
        ('sales', 'Sales Report'),
        ('revenue', 'Revenue Report'),
        ('inventory', 'Inventory Report'),
        ('customer', 'Customer Report'),
        ('product', 'Product Report'),
    ]
    
    EXPORT_FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('csv', 'CSV'),
        ('xlsx', 'Excel'),
    ]
    
    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    export_format = models.CharField(max_length=10, choices=EXPORT_FORMAT_CHOICES)
    
    start_date = models.DateField()
    end_date = models.DateField()
    
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    file_url = models.URLField(blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')],
        default='pending'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.get_report_type_display()} ({self.start_date} to {self.end_date})"

    class Meta:
        ordering = ['-created_at']


class DailySalesMetric(models.Model):
    """Store daily sales metrics for dashboard analytics"""
    date = models.DateField(unique=True)
    total_orders = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_customers = models.PositiveIntegerField(default=0)
    low_stock_products = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Sales Metrics - {self.date}"

    class Meta:
        ordering = ['-date']


# ============================================================================
# SHIPPING & DELIVERY
# ============================================================================

class ShippingMethod(models.Model):
    """Shipping methods and rates"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    base_cost = models.DecimalField(max_digits=10, decimal_places=2)
    free_shipping_above = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    estimated_days = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# ============================================================================
# EMAIL TEMPLATES
# ============================================================================

class EmailTemplate(models.Model):
    """Email templates for notifications"""
    TEMPLATE_TYPE_CHOICES = [
        ('order_confirmation', 'Order Confirmation'),
        ('shipment', 'Shipment Notification'),
        ('delivery', 'Delivery Notification'),
        ('password_reset', 'Password Reset'),
        ('welcome', 'Welcome Email'),
        ('review_request', 'Review Request'),
    ]
    
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPE_CHOICES, unique=True)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    variables = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.get_template_type_display()

