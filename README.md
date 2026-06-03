# PharmaSync - Pharmaceutical SaaS Platform

PharmaSync is a modern, premium SaaS platform built for wholesale pharmaceutical inventory management. It streamlines operations between Central Administration and registered Pharmacies/Clinics (Sellers) by providing secure role-based dashboards, precise unit-conversion logic, and order management.

## 🚀 Tech Stack

### Frontend
- **React.js (Vite)** for lightning-fast UI rendering
- **Tailwind CSS** for a responsive, modern, "startup-grade" design system
- **Framer Motion** for smooth, professional micro-animations
- **React Router** for seamless Single Page Application (SPA) navigation
- **Lucide React** for minimalist iconography

### Backend
- **Node.js & Express.js** for a robust RESTful API
- **Prisma ORM** for type-safe database querying and schema modeling
- **Neon PostgreSQL** for serverless, high-performance database storage
- **JWT (JSON Web Tokens)** stored in HTTP-only cookies for secure authentication
- **Bcrypt.js** for strong password hashing

## ✨ Core Features

1. **Role-Based Access Control (RBAC)**
   - **Administrators**: Access to complete inventory controls, product management, and order fulfillment.
   - **Sellers (Pharmacies/Clinics)**: Access to personalized dashboards, catalog browsing, and quotation generation.
   - Dedicated Registration flows for both Roles.

2. **Precision Inventory & Unit Conversion**
   - Implements a strictly decoupled "Single Source of Truth" database structure using the PostgreSQL `Decimal` type to prevent floating-point calculation errors.
   - Automatically normalizes quantities to Base Units (`grams`, `milliliters`) during transactions while allowing users to interact via familiar units (`kg`, `L`).

3. **Production Ready (Vercel)**
   - Pre-configured `vercel.json` routing for React Router SPAs.
   - Dynamic CORS configuration explicitly designed for Vercel's serverless Edge network and preview domains.

## 🛠️ Local Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd <repository-directory>
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file in the `/server` directory:
```env
PORT=5000
DATABASE_URL="your_neon_postgresql_url"
JWT_SECRET="your_secure_random_secret"
```
- Initialize the Database:
```bash
npx prisma generate
npx prisma db push
```
- Start the backend server:
```bash
npm run dev
# or npm start
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
- Create a `.env` file in the `/client` directory:
```env
VITE_API_URL="http://localhost:5000"
```
- Start the frontend development server:
```bash
npm run dev
```

## 🌐 Deployment
This project is configured for one-click deployment on **Vercel**.
- **Backend:** Set the Root Directory to `/server`. Set the Build Command to `npm run postinstall` (which triggers `prisma generate`). Add your `.env` variables.
- **Frontend:** Set the Root Directory to `/client`. Add `VITE_API_URL` pointing to your Vercel Backend URL.
