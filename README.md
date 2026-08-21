# Coffee Shop - NestJS API

A complete NestJS backend for a coffee shop bookstore with user authentication, book management, and purchase functionality.

## Features

### 1. User Authentication & Authorization
- Email/Password registration and login
- JWT token-based authentication
- Social login support (Google, Facebook)
- Role-based access control (Admin/User)

### 2. Book Categories CRUD
- Create, Read, Update, Delete book categories
- Admin-only for create/update/delete
- Public read access

### 3. Book Management (Public/Sell)
- Create, Read, Update, Delete books
- Visibility control: public or for sale
- Category assignment
- Admin-only for mutations
- Public read access

### 4. Purchase System (Cash & More)
- Purchase books with cash (default), card, or transfer
- Track purchase history
- Admin can manage purchase status

## Tech Stack

- **Framework**: NestJS
- **Database**: SQLite (TypeORM)
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
JWT_SECRET=your-jwt-secret-key
```

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run start:prod

# Build
npm run build
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/social/google` - Google social login
- `POST /api/auth/social/facebook` - Facebook social login
- `GET /api/auth/profile` - Get current user profile

### Users (Admin only for mutations)
- `GET /api/users` - Get all users
- `GET /api/users/profile` - Get own profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete user

### Book Categories
- `GET /api/book-categories` - Get all categories
- `GET /api/book-categories/:id` - Get category by ID
- `POST /api/book-categories` - Create category (Admin)
- `PUT /api/book-categories/:id` - Update category (Admin)
- `DELETE /api/book-categories/:id` - Delete category (Admin)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/public` - Get public books
- `GET /api/books/sell` - Get books for sale
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (Admin)
- `PUT /api/books/:id` - Update book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Purchases
- `GET /api/purchases` - Get all purchases (Admin)
- `GET /api/purchases/my-purchases` - Get my purchases
- `GET /api/purchases/:id` - Get purchase by ID
- `POST /api/purchases` - Create purchase (buy a book)
- `PUT /api/purchases/:id/status` - Update purchase status (Admin)

## Data Models

### User
- email, password, name, avatar
- role: user | admin
- authProvider: local | google | facebook

### BookCategory
- name, description, isActive

### Book
- title, author, description
- visibility: public | sell
- price, coverImage, content
- categoryId

### Purchase
- userId, bookId
- totalAmount
- paymentMethod: cash | card | transfer
- status: pending | completed | cancelled

## License

UNLICENSED
