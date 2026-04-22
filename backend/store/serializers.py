from django.contrib.auth import get_user_model
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


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.CharField(source="image_url", read_only=True)

    class Meta:
        model = Category
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "alt_text", "is_primary"]


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
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        return primary.image_url if primary else ""


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
