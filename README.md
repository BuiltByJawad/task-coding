# MERN Shop – Full‑Stack E‑commerce Task

A full‑stack MERN e‑commerce application built for an assignment requiring JWT auth, protected routes, Redux Toolkit, RTK Query, and a modern Tailwind UI.

- **Backend:** Node.js, Express, MongoDB (Mongoose), Zod, JWT, bcryptjs
- **Frontend:** Next.js (App Router, TypeScript), Redux Toolkit, RTK Query, Tailwind CSS
- **State:** `auth`, `products`, `cart`, `orders` slices + RTK Query API slice
- **Deployments:**
  - **Frontend:** https://task-coding-zd5a.vercel.app
  - **Backend API base URL:** https://task-coding.onrender.com
  - **Backend health check:** https://task-coding.onrender.com/health

---

## Monorepo Structure

- `backend/` – REST API, MongoDB models, auth, cart, orders
- `frontend/` – Next.js storefront, auth pages, cart/checkout, orders dashboard
- `mern-shop.postman_collection` – Postman collection covering all required endpoints

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas database

### 1. Backend

```bash
cd backend
npm install
```

Create `.env` based on `.env.example`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Run locally:

```bash
npm run dev
```

API will be available at `http://localhost:5000`.

Health check:

```http
GET /health -> { "status": "ok" }
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the Next.js dev server:

```bash
npm run dev
```

App will be available at `http://localhost:3000`.

---

## API Overview

All endpoints are implemented in the backend and documented in more detail in `backend/README.md`.

- `POST /auth/register` – Register new user (returns `{ user, token }`)
- `POST /auth/login` – Login existing user (returns `{ user, token }`)
- `GET /products` – Public product list
- `GET /products/:id` – Product details
- `POST /cart` – Add/update cart item (JWT required)
- `DELETE /cart/:id` – Remove cart item by cart item id (JWT required)
- `POST /orders` – Place order from current cart (JWT required)
- `GET /orders` – Get current users orders (JWT required)

---

## Frontend Features

- **Auth:** Register, Login, Logout; JWT stored in `localStorage` and Redux
- **Protected Routes:** `/cart`, `/checkout`, `/orders` require a valid token
- **Guarded Auth Pages:** If already logged in, `/login` and `/register` redirect to `/products` with a loading UI
- **Products:** Listing, detail page, skeleton loaders while fetching
- **Cart:** Add/update/remove items, plus/minus quantity selector, login redirect for guests
- **Checkout & Orders:** Place order and view order history dashboard
- **Global UX:**
  - App-wide fullscreen loader while auth hydrates
  - Logout overlay loader until redirect to `/login`
  - Consistent buttons, cards, and spacing with Tailwind

---

## Postman Collection

- File: `mern-shop.postman_collection`
- Contains requests for all task endpoints (`/auth`, `/products`, `/cart`, `/orders`).
- Recommended usage:
  1. Import collection into Postman.
  2. Create an environment with variables:
     - `baseUrl` – `http://localhost:5000` or your Render URL
     - `token` – set via Login test script.
  3. Use the Login request script to auto-save `token` to the environment.

---

## Live Demo Checklist

Using the live URLs, you can verify the full flow:

1. Register a new user.
2. Log in, verify navbar shows user name and protected routes.
3. Browse products and open a product detail page.
4. Add items to cart, change quantities, remove items.
5. Go to checkout and place an order.
6. View the order in the Orders dashboard.
7. Logout and confirm redirect/loader behavior.

For more implementation details, see `backend/README.md` and `frontend/README.md`.

---

## Screenshots

Save final screenshots in a `screenshots/` folder at the repo root and reference them here:

- `screenshots/home.png` – Home page with trending products section
- `screenshots/register.png` – Register page
- `screenshots/login.png` – Login page
- `screenshots/products.png` – Products listing page
- `screenshots/product-detail.png` – Single product detail page
- `screenshots/cart.png` – Cart page
- `screenshots/checkout.png` – Checkout / order confirmation
- `screenshots/orders.png` – Orders history/dashboard

Update the filenames if you choose different names or formats.
