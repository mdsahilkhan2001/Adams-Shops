from decimal import Decimal
from django.core.management.base import BaseCommand
from store.models import Category, Product, ProductImage

CATEGORIES = [
    {
        "name": "Abayas",
        "slug": "abayas",
        "description": "Signature abayas crafted in premium fabrics.",
        "image_url": "https://images.unsplash.com/photo-1503342452485-86b7f54527ef?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Abaya Inners",
        "slug": "abaya-inners",
        "description": "Luxurious inner layers for modest comfort.",
        "image_url": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Hijabs",
        "slug": "hijabs",
        "description": "Silk and chiffon hijabs in refined tones.",
        "image_url": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Stoles",
        "slug": "stoles",
        "description": "Statement stoles with elegant drape.",
        "image_url": "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Jilbabs",
        "slug": "jilbabs",
        "description": "Modest silhouettes with refined tailoring.",
        "image_url": "https://images.unsplash.com/photo-1467043237213-65f2da53396f?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Hijab Accessories",
        "slug": "hijab-accessories",
        "description": "Pearl pins, clips, and luxe essentials.",
        "image_url": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Men's Kurtas",
        "slug": "mens-kurtas",
        "description": "Modern kurtas with heritage detailing.",
        "image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Thobes",
        "slug": "thobes",
        "description": "Classic thobes for ceremonies and daily wear.",
        "image_url": "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Pakistani Pathani",
        "slug": "pakistani-pathani",
        "description": "Regal pathani suits with premium finish.",
        "image_url": "https://images.unsplash.com/photo-1484329089093-60b9a2b5b172?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Kids Thobes",
        "slug": "kids-thobes",
        "description": "Comfortable kids thobes for festive moments.",
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Middle East Perfumes",
        "slug": "middle-east-perfumes",
        "description": "Oud-inspired luxury fragrances.",
        "image_url": "https://images.unsplash.com/photo-1523293836414-7a2a3f2c5b27?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Attars",
        "slug": "attars",
        "description": "Concentrated attars for sacred rituals.",
        "image_url": "https://images.unsplash.com/photo-1523293836414-7a2a3f2c5b27?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Hajj Essentials",
        "slug": "hajj-essentials",
        "description": "Curated kits for the Hajj journey.",
        "image_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Umrah Essentials",
        "slug": "umrah-essentials",
        "description": "Travel essentials for Umrah pilgrims.",
        "image_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
    {
        "name": "Prayer Accessories",
        "slug": "prayer-accessories",
        "description": "Prayer sets and accessories for sacred moments.",
        "image_url": "https://images.unsplash.com/photo-1503341338985-c0477be52513?auto=format&fit=crop&w=900&q=80&fm=webp",
    },
]

PRODUCTS = [
    {
        "name": "Noor Luxe Abaya",
        "slug": "noor-luxe-abaya",
        "category_slug": "abayas",
        "description": "A flowing abaya with gold-thread finishing and emerald lining.",
        "price": Decimal("3499.00"),
        "compare_at_price": Decimal("3999.00"),
        "stock": 40,
        "is_featured": True,
        "is_best_seller": True,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Midnight", "Emerald", "Sand"],
        "images": [
            "https://images.unsplash.com/photo-1503342452485-86b7f54527ef?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Zaria Evening Abaya",
        "slug": "zaria-evening-abaya",
        "category_slug": "abayas",
        "description": "An evening abaya with soft satin finish and delicate piping.",
        "price": Decimal("5299.00"),
        "compare_at_price": Decimal("5899.00"),
        "stock": 24,
        "is_featured": True,
        "is_best_seller": True,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Onyx", "Sand", "Rose Gold"],
        "images": [
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Emerald Silk Hijab",
        "slug": "emerald-silk-hijab",
        "category_slug": "hijabs",
        "description": "Silk blend hijab with a luminous emerald sheen.",
        "price": Decimal("1299.00"),
        "compare_at_price": None,
        "stock": 60,
        "is_featured": True,
        "is_best_seller": True,
        "sizes": [],
        "colors": ["Emerald", "Sand", "Midnight"],
        "images": [
            "https://images.unsplash.com/photo-1503341338985-c0477be52513?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Velvet Abaya Inner",
        "slug": "velvet-abaya-inner",
        "category_slug": "abaya-inners",
        "description": "A breathable inner layer for effortless layering.",
        "price": Decimal("899.00"),
        "compare_at_price": None,
        "stock": 80,
        "is_featured": False,
        "is_best_seller": False,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Sand", "Cocoa", "Black"],
        "images": [
            "https://images.unsplash.com/photo-1503341338985-c0477be52513?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Lumen Stole",
        "slug": "lumen-stole",
        "category_slug": "stoles",
        "description": "Softly textured stole with subtle gold shimmer.",
        "price": Decimal("1199.00"),
        "compare_at_price": None,
        "stock": 55,
        "is_featured": False,
        "is_best_seller": True,
        "sizes": [],
        "colors": ["Champagne", "Sand"],
        "images": [
            "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Sahara Pathani Set",
        "slug": "sahara-pathani-set",
        "category_slug": "pakistani-pathani",
        "description": "A refined pathani suit with elegant piping and modern fit.",
        "price": Decimal("3899.00"),
        "compare_at_price": Decimal("4399.00"),
        "stock": 30,
        "is_featured": True,
        "is_best_seller": True,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Sand", "Olive", "Black"],
        "images": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Midnight Kurta",
        "slug": "midnight-kurta",
        "category_slug": "mens-kurtas",
        "description": "Tailored kurta in breathable cotton silk.",
        "price": Decimal("2499.00"),
        "compare_at_price": None,
        "stock": 45,
        "is_featured": False,
        "is_best_seller": False,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Midnight", "Sand"],
        "images": [
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Desert Thobe",
        "slug": "desert-thobe",
        "category_slug": "thobes",
        "description": "Classic thobe with minimalist detailing.",
        "price": Decimal("3199.00"),
        "compare_at_price": None,
        "stock": 36,
        "is_featured": False,
        "is_best_seller": True,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Ivory", "Sand", "Ash"],
        "images": [
            "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Kids Ivory Thobe",
        "slug": "kids-ivory-thobe",
        "category_slug": "kids-thobes",
        "description": "Comfortable kids thobe with soft lining.",
        "price": Decimal("1599.00"),
        "compare_at_price": None,
        "stock": 50,
        "is_featured": False,
        "is_best_seller": False,
        "sizes": ["3-4", "5-6", "7-8", "9-10"],
        "colors": ["Ivory"],
        "images": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Royal Oud Attar",
        "slug": "royal-oud-attar",
        "category_slug": "attars",
        "description": "Concentrated oud attar with warm amber notes.",
        "price": Decimal("1599.00"),
        "compare_at_price": None,
        "stock": 70,
        "is_featured": True,
        "is_best_seller": True,
        "sizes": [],
        "colors": [],
        "images": [
            "https://images.unsplash.com/photo-1523293836414-7a2a3f2c5b27?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Oud Royale Perfume",
        "slug": "oud-royale-perfume",
        "category_slug": "middle-east-perfumes",
        "description": "Luxury perfume with saffron, rose, and oud.",
        "price": Decimal("2299.00"),
        "compare_at_price": None,
        "stock": 65,
        "is_featured": False,
        "is_best_seller": True,
        "sizes": [],
        "colors": [],
        "images": [
            "https://images.unsplash.com/photo-1523293836414-7a2a3f2c5b27?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Umrah Travel Essentials",
        "slug": "umrah-travel-essentials",
        "category_slug": "umrah-essentials",
        "description": "Curated essentials for a serene Umrah journey.",
        "price": Decimal("2199.00"),
        "compare_at_price": None,
        "stock": 40,
        "is_featured": True,
        "is_best_seller": True,
        "sizes": [],
        "colors": [],
        "images": [
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Qibla Prayer Set",
        "slug": "qibla-prayer-set",
        "category_slug": "prayer-accessories",
        "description": "Prayer mat and tasbih set in emerald velvet pouch.",
        "price": Decimal("1399.00"),
        "compare_at_price": None,
        "stock": 48,
        "is_featured": False,
        "is_best_seller": False,
        "sizes": [],
        "colors": ["Emerald", "Sand"],
        "images": [
            "https://images.unsplash.com/photo-1503341338985-c0477be52513?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
    {
        "name": "Pearl Hijab Pin Set",
        "slug": "pearl-hijab-pin-set",
        "category_slug": "hijab-accessories",
        "description": "Elegant pearl pins for refined hijab styling.",
        "price": Decimal("499.00"),
        "compare_at_price": None,
        "stock": 120,
        "is_featured": False,
        "is_best_seller": False,
        "sizes": [],
        "colors": ["Pearl"],
        "images": [
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80&fm=webp",
        ],
    },
]


class Command(BaseCommand):
    help = "Seed Adams boutique categories and products."

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true", help="Clear existing data before seeding")

    def handle(self, *args, **options):
        if options["clear"]:
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()

        for data in CATEGORIES:
            category, created = Category.objects.get_or_create(
                slug=data["slug"],
                defaults={
                    "name": data["name"],
                    "description": data["description"],
                    "image_url": data["image_url"],
                },
            )
            if not created:
                category.name = data["name"]
                category.description = data["description"]
                category.image_url = data["image_url"]
                category.save()

        for data in PRODUCTS:
            category = Category.objects.get(slug=data["category_slug"])
            product, _ = Product.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "category": category,
                    "name": data["name"],
                    "description": data["description"],
                    "price": data["price"],
                    "compare_at_price": data["compare_at_price"],
                    "stock": data["stock"],
                    "is_featured": data["is_featured"],
                    "is_best_seller": data["is_best_seller"],
                    "sizes": data["sizes"],
                    "colors": data["colors"],
                },
            )

            for index, image_url in enumerate(data["images"]):
                ProductImage.objects.get_or_create(
                    product=product,
                    image_url=image_url,
                    defaults={
                        "alt_text": product.name,
                        "is_primary": index == 0,
                    },
                )

        self.stdout.write(self.style.SUCCESS("Seeded Adams boutique data."))
