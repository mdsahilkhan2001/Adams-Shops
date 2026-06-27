from urllib.parse import urlparse

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.storage import default_storage
from django.utils.text import slugify
from rest_framework import serializers
from .models import (
    Category,
    Product,
    ProductImage,
    Review,
    Cart,
    CartItem,
    Wishlist,
    WishlistItem,
    Order,
    OrderItem,
    Address,
)

User = get_user_model()


def _media_url_prefix():
    media_url = getattr(settings, "MEDIA_URL", "/media/") or "/media/"
    return media_url if media_url.startswith("/") else f"/{media_url}"


def normalize_stored_image_path(value):
    if not value:
        return ""

    raw = str(value).strip()
    if not raw:
        return ""

    if raw.startswith(("http://", "https://")):
        parsed = urlparse(raw)
        media_url = _media_url_prefix()
        if parsed.path.startswith(media_url):
            raw = parsed.path[len(media_url):]
        else:
            return raw

    media_url = _media_url_prefix()
    for prefix in (media_url, media_url.lstrip("/")):
        if raw.startswith(prefix):
            raw = raw[len(prefix):]
            break

    return raw.lstrip("/")


def resolve_stored_image_url(value, request=None):
    if not value:
        return ""

    raw = str(value).strip()
    if not raw:
        return ""

    if raw.startswith(("http://", "https://")):
        return raw

    media_path = default_storage.url(normalize_stored_image_path(raw))
    if request is not None:
        try:
            return request.build_absolute_uri(media_path)
        except Exception:
            return media_path
    return media_path


class StoredImagePathField(serializers.CharField):
    def to_internal_value(self, data):
        value = super().to_internal_value(data)
        return normalize_stored_image_path(value)

    def to_representation(self, value):
        request = self.context.get("request")
        return resolve_stored_image_url(value, request)


class CategorySerializer(serializers.ModelSerializer):
    image_url = StoredImagePathField(required=False, allow_blank=True, allow_null=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "image_url",
            "banner_image_url",
            "seo_title",
            "seo_description",
            "display_order",
            "is_hidden",
            "parent_category",
            "image",
        ]

    def get_image(self, obj):
        return resolve_stored_image_url(obj.image_url, self.context.get("request"))


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = StoredImagePathField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = ProductImage
        fields = ["id", "product", "image_url", "alt_text", "is_primary"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "compare_at_price",
            "stock",
            "is_featured",
            "is_best_seller",
            "sizes",
            "colors",
            "category",
            "category_name",
            "image",
            "images",
        ]

    def get_image(self, obj):
        images = list(obj.images.all())
        primary = next((image for image in images if image.is_primary), None) or (images[0] if images else None)
        if not primary:
            return ""
        return resolve_stored_image_url(primary.image_url, self.context.get("request"))

    def create(self, validated_data):
        # The admin product form does not expose SKU, so derive a stable fallback.
        validated_data.setdefault(
            "sku",
            slugify(validated_data.get("slug") or validated_data.get("name") or "product")
        )
        return super().create(validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "product", "user", "user_name", "rating", "title", "body", "created_at"]
        read_only_fields = ["user"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ["user"]


class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "cart",
            "product",
            "product_detail",
            "quantity",
            "selected_size",
            "selected_color",
            "price_snapshot",
        ]
        read_only_fields = ["cart"]
        extra_kwargs = {
            "price_snapshot": {"required": False},
        }


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "created_at", "is_active", "items"]
        read_only_fields = ["user"]


class WishlistItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = WishlistItem
        fields = ["id", "wishlist", "product", "product_detail", "created_at"]
        read_only_fields = ["wishlist"]


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "user", "created_at", "items"]
        read_only_fields = ["user"]


class OrderItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "order", "product", "product_detail", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "status",
            "total",
            "currency",
            "shipping_address",
            "placed_at",
            "items",
        ]
        read_only_fields = ["user"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_staff", "is_superuser"]


class CheckoutItemSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    selected_size = serializers.CharField(required=False, allow_blank=True)
    selected_color = serializers.CharField(required=False, allow_blank=True)


class CheckoutSerializer(serializers.Serializer):
    items = CheckoutItemSerializer(many=True)
    shipping_address = AddressSerializer()
    payment_method = serializers.CharField(required=False, allow_blank=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Cart items are required.")
        return value
