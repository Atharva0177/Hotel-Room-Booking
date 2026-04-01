# Aurelia Grand Hotel - Full Stack Booking Website

A full-stack hotel booking application with a React + Vite frontend and Express + Prisma backend.

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Zustand, React Router v6, React Hook Form, Zod, Framer Motion
- Backend: Node.js, Express, Prisma, PostgreSQL, JWT auth, bcrypt, Stripe, Nodemailer, PDFKit

## Project Structure

- client: React frontend
- server: Express API + Prisma schema

## Prerequisites

- Node.js 20+
- PostgreSQL

## Setup

1. Install frontend dependencies

```bash
cd client
npm install
```

2. Install backend dependencies

```bash
cd ../server
npm install
```

3. Configure environment files

- Update client/.env
- Update server/.env

4. Run Prisma migration and seed

```bash
cd server
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
```

5. Start backend

```bash
cd server
npm run dev
```

6. Start frontend

```bash
cd client
npm run dev
```

7. Open app

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

## Seeded Credentials

- Admin: admin@aureliagrand.com / Admin@123
- Guest: guest@test.com / Guest@123

## Main Features

- JWT auth with access/refresh tokens in cookies
- Room search with filter and availability overlap checks
- Booking flow with 3-step wizard and promo input
- Profile and booking history
- Admin dashboard, bookings, rooms, guests, and settings views
- Offers, reviews, newsletter, and contact endpoints
- Dark luxury editorial UI style
