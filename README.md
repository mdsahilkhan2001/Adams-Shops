# Adams - The Islamic Boutique

Premium luxury e-commerce platform for Islamic fashion and lifestyle.

## Structure

- `frontend/` React (Vite), Redux Toolkit + RTK Query, TailwindCSS, Framer Motion
- `backend/` Django + DRF + JWT, PostgreSQL-ready

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `.env` from `.env.example` if you need a custom API URL.

## Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` from `.env.example` and update your PostgreSQL credentials. Then run:

```bash
python manage.py migrate
python manage.py seed_data --clear
python manage.py createsuperuser
python manage.py runserver
```

## Key API Routes

- `/api/auth/token/`
- `/api/auth/token/refresh/`
- `/api/auth/me/`
- `/api/auth/register/`
- `/api/products/`
- `/api/product-images/`
- `/api/categories/`
- `/api/orders/`
- `/api/orders/checkout/`
- `/api/cart/`
- `/api/wishlist/`
- `/api/reviews/`

### Product Filters

Use query params on `/api/products/`:

- `search` (full-text search)
- `category_slug` or `category` (id)
- `min_price` / `max_price`
- `ordering=price|-price|-created_at`
- `page` / `page_size`

## Admin Dashboard

- Frontend admin UI: `/admin/login` (requires staff user)
- Django admin: `/admin/`

## Notes

- Product images use webp-ready URLs.
- Tailwind theme matches the specified luxury palette.
- Framer Motion handles hero, card, and section animations.
