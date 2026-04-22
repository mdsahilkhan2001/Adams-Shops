from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Sum, Count
from django.db import transaction
from decimal import Decimal
from django.contrib.auth import get_user_model
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
from .filters import ProductFilter
from .permissions import IsAdminOrReadOnly
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ReviewSerializer,
    CartSerializer,
    CartItemSerializer,
    WishlistSerializer,
    WishlistItemSerializer,
    OrderSerializer,
    AddressSerializer,
    RegisterSerializer,
    CheckoutSerializer,
    UserSerializer,
    ProductImageSerializer,
)

User = get_user_model()


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.prefetch_related("images").all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "description", "category__name"]
    ordering_fields = ["price", "created_at"]

    @action(detail=True, methods=["get"])
    def reviews(self, request, pk=None):
        product = self.get_object()
        serializer = ReviewSerializer(product.reviews.all(), many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def add_item(self, request, pk=None):
        cart = self.get_object()
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        price_snapshot = serializer.validated_data.get("price_snapshot") or product.price
        serializer.save(cart=cart, price_snapshot=price_snapshot)
        return Response(serializer.data)


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def add_item(self, request, pk=None):
        wishlist = self.get_object()
        serializer = WishlistItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(wishlist=wishlist)
        return Response(serializer.data)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"])
    def checkout(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        items = serializer.validated_data["items"]
        address_data = serializer.validated_data["shipping_address"]

        with transaction.atomic():
            address = Address.objects.create(user=request.user, **address_data)

            total = Decimal("0.00")
            order = Order.objects.create(user=request.user, total=total, shipping_address=address)

            for item in items:
                try:
                    product = Product.objects.select_for_update().get(id=item["product"])
                except Product.DoesNotExist:
                    raise ValidationError({"product": "Product not found."})
                quantity = item["quantity"]
                line_total = product.price * quantity
                total += line_total

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=product.price,
                )

                if product.stock >= quantity:
                    product.stock -= quantity
                    product.save(update_fields=["stock"])

            order.total = total
            order.save(update_fields=["total"])

        output = OrderSerializer(order).data
        return Response(output)

    @action(detail=False, methods=["get"])
    def analytics(self, request):
        orders = Order.objects.all() if request.user.is_staff else Order.objects.filter(user=request.user)
        daily_sales = (
            orders.values("placed_at__date")
            .annotate(total=Sum("total"), count=Count("id"))
            .order_by("-placed_at__date")[:7]
        )
        order_items = OrderItem.objects.filter(order__in=orders)
        top_products = (
            order_items.values("product__name")
            .annotate(quantity=Sum("quantity"))
            .order_by("-quantity")[:5]
        )
        return Response({"daily_sales": list(daily_sales), "top_products": list(top_products)})


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["post"]


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminOrReadOnly]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
