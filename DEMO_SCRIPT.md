# Coffee Shop Demo Script

## Before Demo
- Open frontend: `https://coffe-shop-one-beta.vercel.app`
- Open backend Swagger: `https://coffe-shop-api.onrender.com/docs`

---

## Scene 1: Project Overview (1 min)
> "This is a full-stack coffee shop bookstore built with NestJS backend and Next.js frontend, deployed on Render and Vercel."

- Show Swagger docs briefly to prove API is live.

---

## Scene 2: User Registration & Login (2 min)

### Option A — Register new user
1. Click **Register** on the login page
2. Fill in: Name, Email, Password
3. Click **Register** → redirects to `/books`

### Option B — Login with demo account
1. Click **Login**
2. Email: `admin@coffee.shop` / Password: `admin123`
3. Shows navbar with user name and **Logout** button

### Option C — Social Login
1. Click **Google** or **Facebook** on login/register
2. Auto-creates account with demo token

---

## Scene 3: Browse Books (2 min)

1. Navigate to **Books** from navbar
2. Show **Public** tab: free books anyone can read
3. Show **For Sale** tab: books with prices
4. Use **Category filter** dropdown to filter by Fiction, Science, etc.
5. Point out seeded demo data:
   - *The Coffee House* (free)
   - *Latte Art Basics* ($9.99)
   - *History of Coffee* (free)
   - *Quantum Brewing* ($14.50)
   - *Poems for Mornings* (free)
   - *Modern Web Dev* ($19.99)

---

## Scene 4: Book Category CRUD — Regular User (3 min)

1. Click **Logout** if logged in, and login as a **regular user** (`user@coffee.shop` / `user123`)
2. Navigate to **Categories**
3. **Create**: Fill name + description, click **Add Category**
4. **Edit**: Click **Edit** on a category card, change name, click **Save**
5. **Delete**: Click **Delete**, confirm → card removed
6. Note: "Any authenticated user can manage book categories, just as requested in the scope."

---

## Scene 5: Book CRUD — Regular User (3 min)

1. Navigate to the **Books** page
2. Click **Add Book** (top right)
3. Fill form:
   - Title, Author, Description
   - Visibility: **Public** or **For Sale**
   - Category: select from dropdown
   - If "For Sale": enter Price
4. Click **Save** → new book card appears
5. Click **Edit** on a book card → modify → **Save**
6. Click **Delete** → confirm → removed

---

## Scene 6: Purchase Flow — Regular User (3 min)

1. Stay on the **Books** page
2. Go to the **For Sale** tab
3. Click **Buy Now** on any sell book (e.g., *Latte Art Basics*)
5. On checkout:
   - Book details shown
   - Payment Method: **Cash** (default)
   - Add optional notes
   - Click **Place Order**
6. Redirected to **My Purchases** with:
   - Order status: **Pending**
   - Book title, price, payment method
   - Total amount

---

## Scene 7: Admin — Manage Purchases (2 min)

1. Logout, login as **admin** (`admin@coffee.shop` / `admin123`)
2. Click **All Purchases** in the navbar
3. Show all orders from all users (admin sees everything)
4. Click **Complete** or **Cancel** to update an order status

---

## Closing (1 min)
> "The project covers all 4 scopes: auth with email/social, category CRUD, book CRUD with public/sell visibility, and cash purchase flow. Backend is NestJS with TypeORM and SQLite, frontend is Next.js with Tailwind CSS, both deployed."

---

## Quick Troubleshooting
- If books/categories don't load: check Render logs — seed runs on startup
- If login fails: verify credentials `admin@coffee.shop` / `admin123`
- If you see "User not found" after a deployment: logout and login again — the database was re-seeded, so old JWT tokens point to missing users
- If 404 on frontend: Vercel may still be deploying, wait 1-2 min
