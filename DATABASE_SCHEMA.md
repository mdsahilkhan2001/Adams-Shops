# E-Commerce Admin Panel - Database Schema & UML Documentation

## 📊 Database Schema Overview

### Entity Relationship Diagram (ER Diagram)

```
┌─────────────────┐
│      User       │
│   (Django)      │
└────────┬────────┘
         │
    ┌────┼────┬────────┬──────────┐
    │    │    │        │          │
    v    v    v        v          v
┌────────────────┐ ┌──────────┐ ┌───────────┐
│   UserRole     │ │  Order   │ │   Review  │
│   (1:1)        │ │ (1:many) │ │ (1:many)  │
└────────────────┘ └──────────┘ └───────────┘
                         │
                         v
                    ┌──────────────┐
                    │   OrderItem  │
                    │   (1:many)   │
                    └──────────────┘
                         │
                         v
                    ┌──────────────┐
                    │   Product    │◄──────────┐
                    │              │           │
                    └──────────────┘           │
                    ▲    ▲      ▲              │
                    │    │      │              │
            ┌───────┴──┬─┴──┬───┴──┐           │
            │          │    │      │           │
            v          v    v      v           │
    ┌─────────────┐ ┌──────────┐ ┌──────────┐ │
    │  Category   │ │ ProductV │ │ProductAtt│ │
    │             │ │ ariant   │ │ribute    │ │
    └─────────────┘ └──────────┘ └──────────┘ │
                                               │
                                    ┌──────────┘
                                    │
                        ┌───────────┴──────────┐
                        │                      │
                        v                      v
                    ┌──────────┐          ┌─────────┐
                    │  Coupon  │          │ Banner  │
                    └──────────┘          └─────────┘
                        │                      │
                        v                      v
                    ┌────────────┐         ┌──────────┐
                    │CouponUsage │         │ Inventory│
                    └────────────┘         │   Log    │
                                          └──────────┘
```

---

## 🗂️ Detailed Model Relationships

### Core Models

#### **1. User (Django Built-in)**
```
User
├── username (PK)
├── email
├── first_name
├── last_name
├── is_staff (FK → UserRole.role)
├── is_active
├── date_joined
└── password (hashed)
```

#### **2. UserRole** (RBAC)
```
UserRole
├── id (PK)
├── user (FK → User) [1:1 Unique]
├── role (Choice: guest, customer, admin, super_admin)
├── permissions (JSONField - custom permissions)
├── created_at
└── updated_at
```

### Product Catalog

#### **3. Category**
```
Category
├── id (PK)
├── name
├── slug (Unique)
├── description
├── image_url
├── banner_image_url
├── seo_title
├── seo_description
├── display_order
├── is_hidden
├── parent_category (FK → Category, nullable) [Self-referential]
└── Relationships:
    ├── products (Reverse FK)
    ├── applicable_coupons (M2M)
    └── target_banners (Reverse FK)
```

#### **4. Product**
```
Product
├── id (PK)
├── category (FK → Category)
├── name
├── slug (Unique)
├── description
├── short_description
├── price (Decimal)
├── compare_at_price (Decimal, nullable)
├── stock (PositiveInteger)
├── sku (Unique)
├── brand
├── tags (CharField, comma-separated)
├── weight (Decimal, nullable - kg)
├── is_featured (Boolean)
├── is_best_seller (Boolean)
├── is_trending (Boolean)
├── is_active (Boolean)
├── sizes (JSONField - array)
├── colors (JSONField - array)
├── materials (JSONField - array)
├── seo_title
├── seo_description
├── seo_keywords
├── created_at
├── updated_at
└── Relationships:
    ├── images (Reverse FK)
    ├── variants (Reverse FK)
    ├── attributes (Reverse FK)
    ├── reviews (Reverse FK)
    ├── cart_items (Reverse FK)
    ├── order_items (Reverse FK)
    ├── applicable_coupons (M2M)
    ├── inventory_logs (Reverse FK)
    └── stock_alert (Reverse OneToOne)
```

#### **5. ProductVariant**
```
ProductVariant
├── id (PK)
├── product (FK → Product)
├── sku (Unique)
├── name
├── price (Decimal)
├── compare_at_price (Decimal, nullable)
├── stock (PositiveInteger)
├── reserved_stock (PositiveInteger)
├── weight (Decimal, nullable - kg)
├── color (CharField)
├── size (CharField)
├── material (CharField)
├── is_active (Boolean)
├── created_at
├── updated_at
└── Properties:
    └── available_stock = stock - reserved_stock
```

#### **6. ProductAttribute**
```
ProductAttribute
├── id (PK)
├── product (FK → Product)
├── attribute_type (Choice: color, size, material, brand)
├── value (CharField)
└── Description: Reusable attributes for filtering
```

#### **7. ProductImage**
```
ProductImage
├── id (PK)
├── product (FK → Product)
├── image_url
├── alt_text
├── is_primary (Boolean)
└── Description: Multiple images per product
```

### Order Management

#### **8. Order**
```
Order
├── id (PK)
├── user (FK → User)
├── status (Choice: pending, confirmed, packed, shipped, delivered, cancelled, refunded, returned)
├── total (Decimal)
├── currency (CharField, default='INR')
├── shipping_address (FK → Address, nullable)
├── payment_method (Choice: cod, razorpay, stripe, paypal, default='cod')
├── payment_status (Choice: pending, completed, failed)
├── tracking_number (CharField)
├── estimated_delivery (DateTime, nullable)
├── notes (TextField)
├── admin_notes (TextField)
├── placed_at
├── updated_at
└── Relationships:
    ├── items (Reverse FK)
    ├── used_coupon (Reverse FK)
    └── related_notifications (Reverse FK)
```

#### **9. OrderItem**
```
OrderItem
├── id (PK)
├── order (FK → Order)
├── product (FK → Product)
├── quantity (PositiveInteger)
├── price (Decimal - snapshot at purchase time)
└── Description: Line items for each order
```

### Customer Management

#### **10. Address**
```
Address
├── id (PK)
├── user (FK → User)
├── full_name
├── line1
├── line2 (nullable)
├── city
├── state
├── postal_code
├── country (default='India')
├── phone
└── Relationships:
    └── orders (Reverse FK)
```

#### **11. Cart & CartItem**
```
Cart
├── id (PK)
├── user (FK → User)
├── created_at
├── is_active (Boolean)
└── items (Reverse FK)

CartItem
├── id (PK)
├── cart (FK → Cart)
├── product (FK → Product)
├── quantity (PositiveInteger)
├── selected_size
├── selected_color
└── price_snapshot (Decimal - price at add time)
```

#### **12. Wishlist & WishlistItem**
```
Wishlist
├── id (PK)
├── user (FK → User)
├── created_at
└── items (Reverse FK)

WishlistItem
├── id (PK)
├── wishlist (FK → Wishlist)
├── product (FK → Product)
└── created_at
```

### Review Management

#### **13. Review**
```
Review
├── id (PK)
├── product (FK → Product)
├── user (FK → User)
├── rating (PositiveInteger, 1-5)
├── title
├── body
├── created_at
└── Relationship:
    └── enhanced (Reverse OneToOne)
```

#### **14. ReviewEnhanced**
```
ReviewEnhanced
├── id (PK)
├── review (FK → Review, OneToOne)
├── approval_status (Choice: pending, approved, rejected)
├── approved_by (FK → User, nullable)
├── approved_at (DateTime, nullable)
├── rejection_reason
├── helpful_count
└── unhelpful_count
```

### Inventory Management

#### **15. InventoryLog**
```
InventoryLog
├── id (PK)
├── product (FK → Product)
├── variant (FK → ProductVariant, nullable)
├── action (Choice: add, remove, adjust, sale, return)
├── quantity (Integer - can be negative)
├── reference (CharField - order ID, etc.)
├── notes
├── created_by (FK → User, nullable)
├── created_at
└── Index: product, created_at
```

#### **16. StockAlert**
```
StockAlert
├── id (PK)
├── product (OneToOne → Product)
├── low_stock_threshold (PositiveInteger, default=10)
├── alert_sent (Boolean)
└── alert_sent_at (DateTime, nullable)
```

### Discounts & Promotions

#### **17. Coupon**
```
Coupon
├── id (PK)
├── code (CharField, Unique)
├── discount_type (Choice: percentage, fixed, free_shipping)
├── discount_value (Decimal)
├── min_cart_value (Decimal, default=0)
├── max_usage_per_user (PositiveInteger, default=1)
├── total_usage_limit (PositiveInteger, nullable)
├── start_date (DateTime)
├── end_date (DateTime)
├── applicable_categories (M2M → Category)
├── applicable_products (M2M → Product)
├── is_active (Boolean)
├── created_at
├── updated_at
└── Relationships:
    └── usages (Reverse FK)
```

#### **18. CouponUsage**
```
CouponUsage
├── id (PK)
├── coupon (FK → Coupon)
├── user (FK → User)
├── order (FK → Order, nullable)
├── used_at
└── Unique: (coupon, user, order)
```

#### **19. Banner**
```
Banner
├── id (PK)
├── title
├── banner_type (Choice: homepage, category, sale, popup)
├── image_url
├── link (CharField, nullable)
├── start_date (DateTime)
├── end_date (DateTime)
├── display_order (PositiveInteger)
├── is_active (Boolean)
├── target_category (FK → Category, nullable)
├── created_at
├── updated_at
└── Properties:
    └── is_active_now = is_active AND start_date <= now <= end_date
```

### Notifications & Communication

#### **20. Notification**
```
Notification
├── id (PK)
├── notification_type (Choice: order_status, low_stock, new_customer, new_review, payment_failed, password_reset)
├── user (FK → User)
├── title
├── message
├── related_product (FK → Product, nullable)
├── related_order (FK → Order, nullable)
├── is_read (Boolean)
├── created_at
├── read_at (DateTime, nullable)
└── Index: user, created_at; is_read
```

#### **21. EmailTemplate**
```
EmailTemplate
├── id (PK)
├── template_type (Choice: order_confirmation, shipment, delivery, password_reset, welcome, review_request) [Unique]
├── subject
├── body
├── variables (JSONField - array of variable names)
├── is_active (Boolean)
├── created_at
└── updated_at
```

### Content Management & Analytics

#### **22. CMSPage**
```
CMSPage
├── id (PK)
├── title
├── slug (Unique)
├── page_type (Choice: about, privacy, terms, contact, faq, custom)
├── content (TextField - HTML content)
├── meta_title
├── meta_description
├── is_published (Boolean)
├── created_at
└── updated_at
```

#### **23. FAQItem**
```
FAQItem
├── id (PK)
├── question
├── answer
├── category
├── display_order
├── is_active (Boolean)
├── created_at
└── updated_at
```

#### **24. Report**
```
Report
├── id (PK)
├── report_type (Choice: sales, revenue, inventory, customer, product)
├── export_format (Choice: pdf, csv, xlsx)
├── start_date (Date)
├── end_date (Date)
├── generated_by (FK → User, nullable)
├── file_url
├── status (Choice: pending, completed, failed)
├── created_at
└── completed_at (DateTime, nullable)
```

#### **25. DailySalesMetric**
```
DailySalesMetric
├── id (PK)
├── date (Date, Unique)
├── total_orders (PositiveInteger)
├── total_revenue (Decimal)
├── total_customers (PositiveInteger)
└── low_stock_products (PositiveInteger)
```

#### **26. ShippingMethod**
```
ShippingMethod
├── id (PK)
├── name
├── description
├── base_cost (Decimal)
├── free_shipping_above (Decimal, nullable)
├── estimated_days (PositiveInteger)
└── is_active (Boolean)
```

---

## 📋 Database Constraints & Indexes

### Primary Keys
```
All models: id (AutoField)
UserRole: (OneToOne with User)
StockAlert: (OneToOne with Product)
ReviewEnhanced: (OneToOne with Review)
```

### Unique Constraints
```
Product.slug → UNIQUE
Product.sku → UNIQUE
Category.slug → UNIQUE
Coupon.code → UNIQUE
CMSPage.slug → UNIQUE
DailySalesMetric.date → UNIQUE
EmailTemplate.template_type → UNIQUE
CouponUsage → UNIQUE (coupon, user, order)
```

### Indexes (Performance)
```
UserRole → role
Product → category_id, is_active, created_at
ProductVariant → (product_id, is_active), sku
InventoryLog → (product_id, created_at) DESC
Notification → (user_id, created_at) DESC, is_read
Order → user_id, status
```

### Foreign Key Cascades
```
Category.parent → SET_NULL
Product.category → CASCADE
Order.user → CASCADE
Review.user → CASCADE
... (most FK relationships CASCADE)
```

---

## 🔗 Many-to-Many Relationships

```
Coupon ←M2M→ Category (applicable_categories)
Coupon ←M2M→ Product (applicable_products)
```

---

## 📊 Typical Query Patterns

### Get Revenue by Date
```sql
SELECT placed_at::date as date, SUM(total) as revenue
FROM store_order
WHERE payment_status = 'completed'
GROUP BY placed_at::date
ORDER BY date DESC;
```

### Get Low Stock Products
```sql
SELECT p.id, p.name, pv.stock, sa.low_stock_threshold
FROM store_product p
LEFT JOIN store_productvariant pv ON p.id = pv.product_id
LEFT JOIN store_stockalert sa ON p.id = sa.product_id
WHERE pv.stock <= sa.low_stock_threshold;
```

### Get Top Products by Sales
```sql
SELECT p.id, p.name, SUM(oi.quantity) as total_sold
FROM store_product p
JOIN store_orderitem oi ON p.id = oi.product_id
JOIN store_order o ON oi.order_id = o.id
WHERE o.payment_status = 'completed'
GROUP BY p.id
ORDER BY total_sold DESC;
```

### Get Customer Lifetime Value
```sql
SELECT u.id, u.username, COUNT(o.id) as order_count, SUM(o.total) as lifetime_value
FROM auth_user u
LEFT JOIN store_order o ON u.id = o.user_id
WHERE o.payment_status = 'completed'
GROUP BY u.id;
```

---

## 🎯 Data Integrity Rules

1. **Stock Management**
   - stock >= 0 (ProductVariant)
   - available_stock = stock - reserved_stock >= 0

2. **Pricing**
   - price >= 0 (Decimal, min_value)
   - compare_at_price >= price (if provided)

3. **Orders**
   - total = SUM(OrderItem.quantity * OrderItem.price)
   - status transitions follow defined workflow

4. **Coupons**
   - start_date < end_date
   - usage <= total_usage_limit
   - user usage <= max_usage_per_user

5. **Date Ranges**
   - Banner.start_date <= Banner.end_date
   - Coupon.start_date <= Coupon.end_date

---

## 🚀 Scalability Considerations

### Current Capacity
- SQLite supports ~100K-1M records comfortably
- Suitable for development & small deployments

### For Production (Scale to 1M+ records)
1. **Migrate to PostgreSQL**
   - Better concurrency
   - Full-text search
   - JSONB support

2. **Add Partitioning**
   - InventoryLog by date
   - Order by created_at
   - Notification by date

3. **Add Caching**
   - Redis for product catalog
   - Cache inventory data
   - Cache daily metrics

4. **Add Search**
   - Elasticsearch for product search
   - Advanced filtering

5. **Monitoring**
   - Query performance monitoring
   - Slow query logs
   - Database backups

---

**Database Version**: 1.0  
**Last Updated**: January 2024  
**ORM**: Django ORM  
**Compatible DBs**: SQLite (dev), PostgreSQL (prod)
