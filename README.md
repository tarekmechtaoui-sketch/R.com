# R.com — Mobile Accessories E-Commerce Platform

A complete, production-ready e-commerce website for a mobile accessories store, built with React + Vite + Tailwind CSS and Supabase as the backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Routing | React Router v6 |
| Forms | React Hook Form |
| Notifications | React Hot Toast |
| Icons | Lucide React |

---

## Quick Start

### 1. Clone & Install

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, run the contents of `supabase/schema.sql`.
3. Optionally, run `supabase/seed.sql` to add sample categories and products.

### 3. Configure Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both values are found in **Supabase Dashboard → Project Settings → API**.

### 4. Create the First Super Admin

1. Go to **Supabase Dashboard → Authentication → Users → Add User**.
2. Create a user with email and password.
3. Run this SQL to make them Super Admin:

```sql
UPDATE profiles
SET role = 'super_admin'
WHERE email = 'your-admin@email.com';
```

### 5. Set Up Storage (for product images)

1. Go to **Supabase Dashboard → Storage → New Bucket**.
2. Name it `products` and make it **Public**.
3. The schema already contains the commented RLS policies — uncomment and run them.

### 6. Run Development Server

```bash
npm run dev
```

---

## Routes

### Client (Public)
| Route | Page |
|---|---|
| `/` | Home — Hero, Categories, Promo, Best Sellers |
| `/products` | All Products with category filter + search |
| `/products/:id` | Product Detail — images, description, add to cart |
| `/cart` | Shopping Cart |
| `/checkout` | Checkout form (no account required) |
| `/order-confirmation/:id` | Order success page |

### Admin
| Route | Access |
|---|---|
| `/admin/login` | Public |
| `/admin` | Dashboard (Admin+) |
| `/admin/products` | Product CRUD (Admin+) |
| `/admin/orders` | Order management (Admin+) |
| `/admin/users` | User/role management (Super Admin only) |
| `/admin/settings` | Profile & password (Super Admin only) |

---

## Features

### Storefront
- Responsive navbar with dark/light mode toggle
- Hero section with stats
- Category grid (4 cards with images)
- Promotional banner
- Best sellers product grid
- Product listing with category tabs and search
- Product detail with multiple images + quantity selector
- Persistent cart (localStorage)
- Guest checkout with Algerian wilaya/commune selector
- Order confirmation page

### Admin Panel
- Secure JWT-based auth via Supabase
- Role-based access: **Super Admin** and **Admin**
- Dashboard with stats and recent orders
- Full product CRUD with image uploads to Supabase Storage
- Order management with status updates (New → Confirmed → Preparing → Delivered → Cancelled)
- User management with role assignment (Super Admin only)
- Profile and password settings

### Database
- `categories` — product categories
- `products` — product catalog with images array
- `orders` — customer orders (no auth required)
- `order_items` — order line items
- `profiles` — admin user profiles (linked to Supabase Auth)

### Security
- Row Level Security on all tables
- Public can only read active products and create orders
- Authenticated admins can manage products and orders
- Super admin can manage profiles/roles
- All admin routes protected by `ProtectedRoute` component

---

## Build

```bash
npm run build
```

Output is in `dist/`.

---

## Project Structure

```
src/
├── components/
│   ├── admin/        # Sidebar, Header, StatsCard, ProductForm, ProtectedRoute
│   ├── home/         # Hero, PromoBanner, BestSellers, CategoriesSection
│   ├── layout/       # Navbar, Footer
│   └── ui/           # Button, Modal, ProductCard, CategoryCard, Badge, EmptyState
├── contexts/         # CartContext, AuthContext, ThemeContext
├── hooks/            # useProducts, useOrders, useCategories, useUsers
├── lib/              # supabase.js
├── pages/
│   ├── admin/        # LoginPage, Dashboard, Products, Orders, Users, Settings
│   └── client/       # HomePage, ProductsPage, ProductDetailPage, Cart, Checkout, Confirmation
└── utils/            # constants.js (wilayas, statuses), helpers.js (formatPrice, etc.)
supabase/
├── schema.sql        # Full DB schema + RLS policies
└── seed.sql          # Sample categories and products
```
