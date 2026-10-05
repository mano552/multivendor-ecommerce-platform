# ShopO — Multi-Vendor E-commerce (MERN + PostgreSQL)

Full-stack multi-vendor marketplace: buyer / seller / admin auth, product catalog with categories,
cart, wishlist, product reviews, seller messaging, and checkout with **Stripe (card)** or
**Cash on Delivery**.

```
multivendor-ecommerce/
  backend/   -> Node + Express + PostgreSQL (Sequelize) + JWT + Stripe
  frontend/  -> React + Vite + Tailwind CSS
```



## 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally (or a hosted instance like Neon/Supabase/Railway)
- A free Stripe account for **test mode** keys: https://dashboard.stripe.com/test/apikeys

## 2. Database setup

Create an empty PostgreSQL database:

```bash
psql -U postgres -c "CREATE DATABASE multivendor_shop;"
```

## 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in:
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT` — your Postgres credentials
- `JWT_SECRET` — any long random string (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` — dashboard.stripe.com → **Developers → API keys**
  (test mode toggle ON, top-right) → copy both `pk_test_...` and `sk_test_...`
- `STRIPE_WEBHOOK_SECRET` — see step 5 below
- `SMTP_*` — optional, see step 6 below (forgot-password works without this, it just prints
  the reset link to the server console / shows it directly in the UI instead of emailing it)

Create tables + seed dummy data (categories, products, brands, ratings, sold counts,
and 3 demo accounts):

```bash
npm run seed
```

This prints demo logins:
```
admin@shopo.com  / Admin@123   (admin)
seller@shopo.com / Seller@123  (seller)
buyer@shopo.com  / Buyer@123   (buyer)
```

Start the API:

```bash
npm run dev
```

API runs at `http://localhost:5000`.

## 4. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173` (Vite proxies `/api` and `/uploads` to the backend automatically —
see `vite.config.js`).

## 5. Stripe webhook (for card payments to mark orders "paid")

In a separate terminal, using the Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/orders/webhook
```

It will print a `whsec_...` value — put that into `backend/.env` as `STRIPE_WEBHOOK_SECRET`
and restart the backend. Without this, Cash on Delivery still works perfectly; card
payments will complete on Stripe's side but the order's `paymentStatus` won't flip to "paid"
until the webhook is wired up.

## 6. Email (SMTP) for forgot-password — optional

Without this, forgot-password still works: the reset link is printed to the backend
console **and** shown directly in the frontend UI (with a clickable link), so you can test
the full flow with zero email setup.

To send real emails, pick one:

**Option A — Gmail (quick, for testing)**
1. Enable 2-Step Verification on your Google account
2. Create an "App Password": https://myaccount.google.com/apppasswords
3. Fill in:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=youraddress@gmail.com
   SMTP_PASSWORD=<the 16-character app password>
   ```

**Option B — Mailtrap (free, catches emails in a test inbox instead of real delivery)**
1. Sign up at https://mailtrap.io → create an inbox → "SMTP Settings" tab
2. Copy the host/user/password shown there into `SMTP_HOST`/`SMTP_USER`/`SMTP_PASSWORD`

**Option C — Brevo / SendGrid (free tier, for real production email)**
- Sign up, verify a sender, grab their SMTP credentials from their dashboard

> ⚠️ Forgot-password only shows a link for an email that's actually registered (for
> security, we never reveal whether an email exists). Test with a seeded account:
> `buyer@shopo.com`, `seller@shopo.com`, or `admin@shopo.com`.

## 7. Changing the color theme

Everything (navbar, buttons, links) reads from 3 CSS variables in
`frontend/src/index.css`:

```css
:root {
  --color-primary: #4338ca;
  --color-primary-dark: #312e81;
  --color-accent: #16a34a;
}
```

Change those 3 hex values to re-theme the whole site instantly.

## 8. What's implemented

- Multi-vendor auth: buyer / seller / admin roles (JWT)
- Signup with profile picture upload (from device gallery)
- Login with "remember me" checkbox
- **Real forgot/reset password** — emails a reset link (via nodemailer; prints to the
  server console instead if SMTP isn't configured), token expires in 1 hour
- Landing page: hero, popular categories, best sellers, featured products, events banner
- Category browsing with dummy seeded products (ratings, sold count, price/discount)
- Product detail modal: image, seller info, ratings, quantity selector, wishlist heart,
  add to cart, description, reviews (post + list), **live chat with the seller**, related products
- **Real-time messaging** (Socket.IO): a Messages inbox with conversation threads, typing
  happens instantly on both sides, REST fallback if the socket briefly drops
- Cart page + Checkout (shipping address → payment: card via Stripe / Cash on Delivery → success)
- **Refunds workflow**: buyers request a refund per order item from their Orders tab;
  sellers/admins approve or reject from their own dashboards
- **Real shipment tracking**: every order gets a timeline (Order Placed → Shipped → Out for
  Delivery → Delivered) that updates automatically whenever a seller/admin changes order status
- Profile page: avatar upload, personal info, Orders (with refund + track buttons), Refunds,
  Track Order, Inbox, Payment Methods, Address tabs
- **Seller dashboard**: My Products, Add Product, Orders (update status), Refunds, **Earnings**
  (total, monthly breakdown, by-product breakdown), Inbox
- **Admin panel**: platform stats, approve/revoke sellers, all products, categories (add/delete),
  all orders (update status), all refunds
- **Saved payment methods**: real Stripe card saving via SetupIntent + Stripe Elements,
  from Profile → Payment Methods → "+ Add now" (use test card `4242 4242 4242 4242`)
- Seeded demo products now have real photos (via picsum.photos) instead of blank placeholders
- Category dropdown (navbar) and homepage "Popular Categories" show a matching emoji per category
- Footer: subscribe bar + company/shop/support links + brand partner strip (Dell, Apple, LG,
  Sony, Microsoft)

## 9. Not yet built (next increment)

- Saved payment methods / cards UI (Stripe Customer + SetupIntent)
- Push notifications for order status changes
- Admin analytics charts (currently table-based)
- Automated tests


