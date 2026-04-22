from django.contrib import admin
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

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(Review)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Wishlist)
admin.site.register(WishlistItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Address)
