# E-Commerce Application (Fullstack Assignment)

A complete fullstack e-commerce web application featuring a robust TypeScript/Express backend and a responsive React/Vite/Tailwind CSS frontend. This application includes an Admin Dashboard for managing products, search with filtering and sorting, persistent wishlist storage, and performant UI features like pagination and debouncing.

---

## 📁 Repository Structure

```text
ecommerce/
├── backend/          # Express.js, TypeScript, & MongoDB Server
│   ├── config/       # Database & Cloudinary configurations
│   ├── controllers/  # Route controller handlers
│   ├── middlewares/  # Express middlewares (Auth, Multer, Global Error handler.)
│   ├── models/       # Mongoose schemas & data models
│   ├── routes/       # API endpoints definitions
│   ├── utils/        # Utility helpers & services
│   └── server.ts     # Entry point of the backend server
├── frontend/         # React, Vite, TypeScript, & Tailwind CSS App
│   ├── public/       # Static assets
│   └── src/          # React components, contexts, & pages
└── README.md         # Main project documentation (This file)
```

---

## ⚙️ Backend (Server-Side)

The backend is built with **Express.js** and **TypeScript**, using **MongoDB** as the database. It provides secure authentication, image upload capabilities, and a structured API.

### 🛠️ Technologies & Packages

- **Language & Core:** `Express.js`, `TypeScript`, `Node.js`
- **Database:** `MongoDB` (using `Mongoose` ODM)
- **Key Packages Used:**
  - `bcrypt`: Secure password hashing for authentication.
  - `cloudinary`: Storage for uploaded product images.
  - `cors`: Cross-Origin Resource Sharing configuration for security.
  - `dotenv`: Safe environment variables loading.
  - `helmet`: HTTP header protection against common vulnerabilities.
  - `jsonwebtoken` (JWT): Secure stateless token-based authorization.
  - `multer`: File parser middleware for processing multipart form data (image uploads).
  - `morgan`: Clean HTTP request logging for development.

### 🔌 API Endpoints

#### Admin APIs

> [!NOTE]
> All admin operations (excluding login) require authentication and admin privileges verified via JSON Web Token (JWT).

| Endpoint               | Method   | Description                                                            |
| :--------------------- | :------- | :--------------------------------------------------------------------- |
| `/api/auth/login`      | `POST`   | Admin login & returns JWT token                                        |
| `/api/products`        | `POST`   | Create a new product (handles image uploads using Multer & Cloudinary) |
| `/api/products/:id`    | `PUT`    | Update details or image of an existing product                         |
| `/api/products/:id`    | `DELETE` | Delete a product                                                       |
| `/api/admin/dashboard` | `GET`    | Fetch admin dashboard statistics and data                              |

#### Public APIs

| Endpoint            | Method | Description                                                                   |
| :------------------ | :----- | :---------------------------------------------------------------------------- |
| `/api/products`     | `GET`  | Get all products (supports pagination, search, sorting, and category filters) |
| `/api/products/:id` | `GET`  | Get detailed information for a single product                                 |

---

## 🎨 Frontend (Client-Side)

The frontend is a single-page application built with **React**, **Vite**, and **TypeScript**, styled using **Tailwind CSS**.

### 🛠️ Technologies & Packages

- **Core Build Tool:** `React Vite` & `TypeScript`
- **Styling:** `Tailwind CSS`
- **Navigation:** `react-router-dom`
- **HTTP client:** `axios`
- **Feedback & Icons:** `react-toastify` (notification popups) & `react-icons`

### ✨ Key Features

- **State Management:** Powered globally by the React **Context API** (handles user authentication state, and wishlist across components).

- **Performant Enhancements:**
  - **Pagination:** Implemented to load products in chunks, optimizing loading speed and server load.
  - **Debouncing:** Restricts API call frequency during real-time product search.
- **Persistent Wishlist:** Managed via `localStorage` so user selections are preserved even after refresh or browser restart.
- **User Friendly & Interactive:**
  - Clean UI with a custom color theme.
  - Premium Admin Dashboard to easily manage stock items.
  - Interactive confirmation modals for logging out and clearing the wishlist.
  - Completely responsive layout optimized for Desktop, Tablet, and Mobile devices.
- **Filtering and Sorting:**
  - Instant text search filters.
  - Filter products dynamically by Category.
  - Sort products by price (Low to High, High to Low) or release date.

---

## 🚀 Setup & Installation Instructions

Follow these step-by-step instructions to clone, configure, and run the project locally.

### 📋 Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)
- [Cloudinary](https://cloudinary.com/) (Account credentials for image storage)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/kirankattii/ecom-assignment
cd ecommerce
```

---

### Step 2: Configure Backend Environment Variables

1. Navigate to the `backend` folder.
2. Create a `.env` file based on the keys below:

```env
# Server Configuration
PORT=3000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES=7d

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

### Step 3: Run the Backend Server

```bash
# From the project root directory
cd backend

# Install dependencies
npm install

# Start the development server (runs with nodemon auto-restart)
npm run server
```

The server will start running on **`http://localhost:3000`**.

---

### Step 4: Configure Frontend Environment Variables

1. Navigate to the `frontend` folder.
2. Create a `.env` file and point to the backend URL:

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

### Step 5: Run the Frontend Server

```bash
# From the project root directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open **`http://localhost:5173`** in your browser to view and interact with the application.
