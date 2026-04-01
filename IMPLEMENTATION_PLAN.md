# 🏨 Hotel Room Booking Website — Full Implementation Prompt for AI

## PROJECT OVERVIEW

Build a **complete, full-stack Hotel Room Booking Website** called **"Aurélia Grand Hotel"** — a luxury 5-star hotel. This must be a production-ready, fully functional web application with a polished UI, working booking flow, admin dashboard, and all supporting pages. Every feature listed below must be implemented end-to-end.

---

## TECH STACK

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3 + custom CSS for animations
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Date Picker**: React Day Picker
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Image Carousel**: Embla Carousel
- **Maps**: React Leaflet (for location page)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: JWT (access + refresh tokens) + bcrypt
- **Email**: Nodemailer (with HTML email templates)
- **File Uploads**: Multer + Cloudinary
- **Validation**: Zod
- **Payment**: Stripe (test mode)
- **PDF Generation**: PDFKit (for booking invoices)
- **Scheduler**: node-cron (for booking reminders)

### DevOps / Config
- **Environment**: `.env` files for frontend and backend
- **Database Migrations**: Prisma Migrate
- **API Documentation**: Swagger UI at `/api-docs`
- **Linting**: ESLint + Prettier

---

## AESTHETIC DIRECTION

**Theme**: Luxury editorial — dark warm background (`#1a1410`), gold accent (`#c9a96e`), ivory text (`#f5f0e8`), deep burgundy highlights (`#6b2737`).

**Typography**:
- Display/headings: `Cormorant Garamond` (Google Font) — elegant serif
- Body: `Jost` (Google Font) — clean, modern sans-serif
- Accent labels: `Cinzel` (Google Font) — classic Roman caps

**Design Principles**:
- Full-screen hero with parallax scroll
- Smooth page transitions (Framer Motion `AnimatePresence`)
- Gold horizontal rule dividers
- Subtle grain texture overlay on hero sections
- Hover effects on cards: scale + golden border glow
- Sticky navbar that transitions from transparent to dark on scroll
- Mobile-first, fully responsive (breakpoints: sm/md/lg/xl)

---

## FILE & FOLDER STRUCTURE

```
hotel-booking/
├── client/                         # React Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   └── hotel-logo.svg
│   ├── src/
│   │   ├── assets/                 # Images, icons
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── PageLayout.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── StarRating.jsx
│   │   │   │   ├── DateRangePicker.jsx
│   │   │   │   ├── GuestSelector.jsx
│   │   │   │   └── ImageGallery.jsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── FeaturedRooms.jsx
│   │   │   │   ├── Amenities.jsx
│   │   │   │   ├── Testimonials.jsx
│   │   │   │   ├── SpecialOffers.jsx
│   │   │   │   └── LocationSection.jsx
│   │   │   ├── rooms/
│   │   │   │   ├── RoomCard.jsx
│   │   │   │   ├── RoomFilters.jsx
│   │   │   │   └── RoomGallery.jsx
│   │   │   ├── booking/
│   │   │   │   ├── BookingSummary.jsx
│   │   │   │   ├── GuestDetailsForm.jsx
│   │   │   │   ├── PaymentForm.jsx
│   │   │   │   └── BookingConfirmation.jsx
│   │   │   └── admin/
│   │   │       ├── AdminSidebar.jsx
│   │   │       ├── StatsCard.jsx
│   │   │       ├── BookingsTable.jsx
│   │   │       ├── RoomsTable.jsx
│   │   │       └── RevenueChart.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── RoomsPage.jsx
│   │   │   ├── RoomDetailPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── BookingConfirmationPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   ├── AmenitiesPage.jsx
│   │   │   ├── GalleryPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminBookings.jsx
│   │   │       ├── AdminRooms.jsx
│   │   │       ├── AdminGuests.jsx
│   │   │       └── AdminSettings.jsx
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── bookingStore.js
│   │   │   └── roomStore.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useBooking.js
│   │   │   └── useRooms.js
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── roomService.js
│   │   │   ├── bookingService.js
│   │   │   └── paymentService.js
│   │   ├── utils/
│   │   │   ├── dateUtils.js
│   │   │   ├── priceUtils.js
│   │   │   └── validators.js
│   │   ├── constants/
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                         # Express Backend
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── cloudinary.js
│   │   │   ├── stripe.js
│   │   │   └── nodemailer.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── admin.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── rooms.routes.js
│   │   │   ├── bookings.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── payments.routes.js
│   │   │   ├── reviews.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── rooms.controller.js
│   │   │   ├── bookings.controller.js
│   │   │   ├── users.controller.js
│   │   │   ├── payments.controller.js
│   │   │   ├── reviews.controller.js
│   │   │   └── admin.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── rooms.service.js
│   │   │   ├── bookings.service.js
│   │   │   ├── email.service.js
│   │   │   ├── payment.service.js
│   │   │   └── pdf.service.js
│   │   ├── schemas/
│   │   │   ├── auth.schema.js
│   │   │   ├── booking.schema.js
│   │   │   └── room.schema.js
│   │   ├── jobs/
│   │   │   └── reminderJob.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   └── tokenUtils.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## DATABASE SCHEMA (Prisma)

```prisma
model User {
  id            String     @id @default(uuid())
  firstName     String
  lastName      String
  email         String     @unique
  password      String
  phone         String?
  avatar        String?
  role          Role       @default(GUEST)
  nationality   String?
  idProofUrl    String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  bookings      Booking[]
  reviews       Review[]
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Room {
  id            String        @id @default(uuid())
  name          String
  slug          String        @unique
  type          RoomType
  description   String
  longDesc      String
  pricePerNight Float
  maxGuests     Int
  bedType       String
  size          Float         // sq ft
  floor         Int
  viewType      String
  images        String[]      // array of Cloudinary URLs
  amenities     String[]
  isAvailable   Boolean       @default(true)
  isFeatured    Boolean       @default(false)
  createdAt     DateTime      @default(now())
  bookings      Booking[]
  reviews       Review[]
}

model Booking {
  id              String        @id @default(uuid())
  bookingCode     String        @unique
  userId          String
  roomId          String
  user            User          @relation(fields: [userId], references: [id])
  room            Room          @relation(fields: [roomId], references: [id])
  checkIn         DateTime
  checkOut        DateTime
  nights          Int
  adults          Int
  children        Int
  totalPrice      Float
  taxAmount       Float
  finalPrice      Float
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)
  stripePaymentId String?
  specialRequests String?
  guestName       String
  guestEmail      String
  guestPhone      String
  invoiceUrl      String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model Review {
  id        String   @id @default(uuid())
  userId    String
  roomId    String
  user      User     @relation(fields: [userId], references: [id])
  room      Room     @relation(fields: [roomId], references: [id])
  rating    Int      // 1–5
  title     String
  comment   String
  createdAt DateTime @default(now())
}

model Offer {
  id          String   @id @default(uuid())
  title       String
  description String
  discount    Float    // percentage
  code        String   @unique
  validFrom   DateTime
  validUntil  DateTime
  isActive    Boolean  @default(true)
  minNights   Int      @default(1)
}

enum Role          { GUEST ADMIN }
enum RoomType      { STANDARD DELUXE SUITE PRESIDENTIAL }
enum BookingStatus { PENDING CONFIRMED CHECKED_IN CHECKED_OUT CANCELLED }
enum PaymentStatus { UNPAID PAID REFUNDED }
```

---

## PAGES — DETAILED SPECIFICATION

### 1. HOME PAGE (`/`)
- **Hero Section**: Full-viewport background video or high-res image parallax. Overlay with hotel name in `Cormorant Garamond`. Tagline beneath. "Explore Rooms" CTA button.
- **Search/Booking Bar**: Floating bar over hero (or pinned below). Fields: Check-in date, Check-out date, Adults (dropdown 1–10), Children (dropdown 0–5), Room Type (All/Standard/Deluxe/Suite/Presidential). "Check Availability" button. On submit → navigates to `/rooms` with query params.
- **Featured Rooms Section**: Horizontal scrollable cards (3 visible on desktop) for `isFeatured` rooms. Each card: image, name, type badge, price/night, key amenities icons, "Book Now" button.
- **Hotel Amenities Strip**: Icon grid — Pool, Spa, Restaurant, Gym, Free WiFi, Concierge, Valet, Bar.
- **Special Offers Carousel**: Cards showing active `Offer` records from DB. Each has discount badge, title, validity date, promo code copy button.
- **Testimonials Section**: Static + DB reviews displayed in a testimonial carousel with star ratings, guest name, nationality flag emoji.
- **Location Section**: Embedded React Leaflet map with hotel pin. Address, phone, email.
- **Newsletter Signup**: Email input that POSTs to `/api/newsletter` (stores in a simple table).

---

### 2. ROOMS PAGE (`/rooms`)
- **Filter Sidebar** (desktop) / **Filter Drawer** (mobile):
  - Room Type: checkbox multi-select
  - Price range: dual-handle slider (₹0 – ₹50,000/night)
  - Guests: number input
  - Amenities: checkboxes (AC, Pool Access, Jacuzzi, Ocean View, etc.)
  - Bed Type: radio buttons
  - Sort: Price Low→High, High→Low, Rating, Newest
- **Room Grid**: Responsive 3-col → 2-col → 1-col. Each `RoomCard`:
  - Image carousel (multiple images)
  - Room type badge (color-coded)
  - Name, bed type, size, max guests
  - Key amenities as icon pills
  - Price per night (bold, gold)
  - "View Details" button
  - Availability indicator (Green dot / "Unavailable" overlay)
- **No Results State**: Illustrated empty state with "Clear Filters" button.
- Reads check-in/check-out/guests from URL query params and pre-fills filters.

---

### 3. ROOM DETAIL PAGE (`/rooms/:slug`)
- **Image Gallery**: Full-width hero image + thumbnail strip. Clicking opens a lightbox (fullscreen modal carousel).
- **Room Info Column** (left 60%):
  - Name, type badge, floor/view details
  - Long description (rich text rendered)
  - Amenities: icon + label grid
  - Room specifications table: Size, Bed, Max Guests, Floor, View
  - Reviews section: average star rating + count, individual review cards with pagination
  - "Write a Review" button (requires login + past completed booking for this room)
- **Booking Widget** (right 40%, sticky):
  - Price per night display
  - Date picker (check-in / check-out) — disables already-booked dates (fetched from API)
  - Guest selector
  - Price breakdown: Subtotal, Taxes (18% GST), Total
  - "Book Now" button → redirects to `/booking/:roomId` with dates in state
  - "Add to Wishlist" button (stores in localStorage)

---

### 4. BOOKING PAGE (`/booking/:roomId`) — 3-Step Wizard

**Step 1 — Review & Dates**
- Selected room summary card (image, name, price)
- Editable dates and guests
- Price breakdown table
- Promo code input: validates against `Offer` table, applies discount
- "Continue" → Step 2

**Step 2 — Guest Details**
Form fields (React Hook Form + Zod):
- First Name, Last Name (required)
- Email (required, valid email)
- Phone (required, 10-digit)
- Nationality (dropdown)
- ID Proof Type (Passport / Aadhar / Driving License) + Number
- Special Requests (textarea, optional)
- "Back" / "Continue" → Step 3

**Step 3 — Payment**
- Booking summary (read-only)
- Stripe Elements card input (test mode)
- "Pay ₹[amount]" button
- On Stripe success → POST `/api/bookings` with payment intent ID
- Loading state with spinner during payment
- On success → redirect to `/booking/confirmation/:bookingCode`

---

### 5. BOOKING CONFIRMATION PAGE (`/booking/confirmation/:bookingCode`)
- Success animation (checkmark lottie or CSS animation)
- Booking reference code (large, copyable)
- Summary: Room, Dates, Guests, Amount Paid
- "Download Invoice PDF" button (calls `/api/bookings/:id/invoice`)
- "View My Bookings" button
- Automated confirmation email was sent (info banner)

---

### 6. AUTH PAGES

**Login Page** (`/login`):
- Email + Password form
- "Remember Me" checkbox (persists refresh token)
- "Forgot Password?" link → modal that sends reset email
- Google OAuth button (optional, mark as TODO if not implementing)
- Link to Register
- On success → redirect to intended page or home

**Register Page** (`/register`):
- First Name, Last Name, Email, Password, Confirm Password, Phone
- Terms & Conditions checkbox
- On success → auto-login → redirect to home

**Forgot Password** (modal or page `/forgot-password`):
- Email input → POST `/api/auth/forgot-password` → sends email with token
- `/reset-password?token=xxx` page with new password form

---

### 7. USER PROFILE PAGE (`/profile`)
Protected route (requires login).
- **My Info tab**: Edit name, phone, nationality, avatar upload
- **My Bookings tab**: List of all bookings with status badges
  - Each row: Room name, dates, amount, status, actions
  - Actions: "View Details" (modal), "Download Invoice", "Cancel" (if >48hrs before check-in), "Leave Review" (if checked out)
- **Security tab**: Change password form (current + new + confirm)
- **Preferences tab**: Newsletter opt-in toggle

---

### 8. ADMIN DASHBOARD (`/admin`) — Protected (ADMIN role only)

**Sidebar Navigation**:
- Dashboard, Bookings, Rooms, Guests, Reviews, Offers, Settings

**Dashboard Page**:
- KPI Cards: Total Bookings (today/month), Total Revenue (today/month), Occupancy Rate, New Guests
- Revenue Line Chart (last 30 days) — Recharts
- Bookings by Room Type — Pie Chart — Recharts
- Recent Bookings table (last 10)
- Room Status grid (mini grid showing each room: available/occupied/maintenance)

**Bookings Management** (`/admin/bookings`):
- Full table with search, filter by status/date range
- Sortable columns
- Inline status update dropdown (Confirmed / Checked-In / Checked-Out / Cancelled)
- View full booking details modal
- Export to CSV button

**Rooms Management** (`/admin/rooms`):
- Table of all rooms
- "Add Room" button → modal form:
  - Name, Type, Description, Long Description, Price/Night, Max Guests, Bed Type, Size, Floor, View Type, Amenities (multi-select), Images (drag-drop upload to Cloudinary), Featured toggle, Available toggle
- "Edit" button per room → same modal pre-filled
- "Delete" with confirmation modal

**Guests Management** (`/admin/guests`):
- Table: Name, Email, Phone, Total Bookings, Total Spent, Joined Date
- Click row → Guest detail panel (booking history)

**Reviews Management** (`/admin/reviews`):
- Table with approve/delete actions
- Unapproved reviews shown with warning badge

**Offers Management** (`/admin/offers`):
- Create/Edit/Delete discount offers
- Toggle active/inactive

**Settings** (`/admin/settings`):
- Hotel name, address, contact info
- Email configuration test
- Maintenance mode toggle

---

### 9. OTHER PAGES

**About Page** (`/about`):
- Hotel story, founding year, mission
- Team section (static staff cards with photos)
- Awards & Certifications section
- Timeline of hotel history

**Amenities Page** (`/amenities`):
- Detailed sections for each amenity: Pool, Spa, Restaurant, Gym, Bar, Concierge
- Each section: full-width image, description, hours, highlights

**Gallery Page** (`/gallery`):
- Masonry grid of hotel photos
- Filter tabs: Rooms, Pool, Restaurant, Events, Exterior
- Lightbox on click

**Contact Page** (`/contact`):
- Contact form (Name, Email, Subject, Message) → POST `/api/contact` → sends email to hotel
- Hotel address, phone, email
- Google Maps embed
- Social media links

---

## API ENDPOINTS — COMPLETE LIST

### Auth Routes (`/api/auth`)
```
POST   /register              Register new user
POST   /login                 Login, returns access + refresh tokens
POST   /logout                Invalidate refresh token
POST   /refresh-token         Get new access token
POST   /forgot-password       Send reset email
POST   /reset-password        Reset with token
GET    /me                    Get current user (protected)
```

### Room Routes (`/api/rooms`)
```
GET    /                      Get all rooms (with filters: type, minPrice, maxPrice, guests, amenities, sort)
GET    /:slug                 Get single room by slug
GET    /:id/availability      Get booked date ranges for a room
GET    /:id/reviews           Get reviews for a room
POST   /                      Create room (admin only)
PUT    /:id                   Update room (admin only)
DELETE /:id                   Delete room (admin only)
POST   /:id/images            Upload images (admin, multipart)
```

### Booking Routes (`/api/bookings`)
```
GET    /                      Get all bookings (admin: all; user: own)
GET    /:id                   Get single booking
POST   /                      Create booking
PATCH  /:id/status            Update booking status (admin)
DELETE /:id                   Cancel booking (user, with 48hr rule)
GET    /:id/invoice            Download invoice PDF
```

### Payment Routes (`/api/payments`)
```
POST   /create-intent         Create Stripe payment intent
POST   /webhook               Stripe webhook handler
```

### Review Routes (`/api/reviews`)
```
POST   /                      Create review (must have completed booking)
GET    /                      Get all reviews (admin)
PATCH  /:id/approve           Approve review (admin)
DELETE /:id                   Delete review (admin or owner)
```

### User Routes (`/api/users`)
```
GET    /profile               Get own profile
PATCH  /profile               Update profile
PATCH  /change-password       Change password
POST   /avatar                Upload avatar
GET    /bookings              Get own bookings
```

### Admin Routes (`/api/admin`)
```
GET    /stats                 Dashboard KPIs
GET    /revenue               Revenue data by date range
GET    /guests                All guests list
GET    /occupancy             Room occupancy rates
```

### Offer Routes (`/api/offers`)
```
GET    /                      Get active offers (public)
POST   /validate              Validate promo code
POST   /                      Create offer (admin)
PUT    /:id                   Update offer (admin)
DELETE /:id                   Delete offer (admin)
```

---

## KEY BUSINESS LOGIC

### Availability Checking
When searching rooms:
1. Accept `checkIn`, `checkOut` query params
2. Query bookings where status NOT IN `[CANCELLED]` and dates overlap:
   - `booking.checkIn < checkOut AND booking.checkOut > checkIn`
3. Exclude rooms with overlapping bookings from results
4. On room detail, return array of `{start, end}` blocked date ranges for the date picker to disable

### Booking Creation Flow
1. Validate dates, room exists, room is available for those dates
2. Calculate: `nights = checkOut - checkIn (days)`, `subtotal = nights × room.pricePerNight`, `tax = subtotal × 0.18`, `total = subtotal + tax`
3. Apply promo code discount if provided (validate code, check validity dates, min nights)
4. Create Stripe Payment Intent for `total` amount
5. On Stripe webhook `payment_intent.succeeded`:
   - Create Booking record in DB
   - Generate unique `bookingCode` (format: `AUR-YYYYMMDD-XXXXX`)
   - Generate PDF invoice
   - Upload PDF to Cloudinary
   - Send confirmation email with PDF attachment
6. Return booking with confirmation code

### Cancellation Policy
- Cancel >48 hours before check-in: Full refund (Stripe refund API)
- Cancel <48 hours: No refund, booking marked CANCELLED
- Admin can always cancel with manual refund option

### Review Eligibility
- User must have a booking for that room with status `CHECKED_OUT`
- One review per booking
- Reviews need admin approval before showing publicly (flag: `isApproved`)

---

## EMAIL TEMPLATES (HTML)

Build the following email templates in `/server/src/templates/`:

1. **booking-confirmation.html** — booking details, check-in instructions, hotel map, QR code with booking code
2. **booking-cancellation.html** — cancellation confirmation, refund info
3. **reset-password.html** — password reset link (valid 1 hour)
4. **welcome.html** — welcome email on registration
5. **checkin-reminder.html** — sent 24 hours before check-in via cron job
6. **review-request.html** — sent after check-out, prompting a review

All emails must be responsive HTML with the hotel's dark-gold branding.

---

## SEED DATA

Create a `prisma/seed.js` that seeds:

**1 Admin User**:
- email: `admin@aureliagrand.com`, password: `Admin@123`, role: `ADMIN`

**1 Test Guest**:
- email: `guest@test.com`, password: `Guest@123`

**8 Rooms**:
- 2× Standard (₹5,000/night) — Garden View, City View
- 2× Deluxe (₹10,000/night) — Pool View, Sea View
- 2× Suite (₹20,000/night) — Ocean Suite, Rooftop Suite
- 1× Presidential (₹50,000/night)
- 1× Honeymoon Suite (₹30,000/night), isFeatured: true

**3 Active Offers**:
- `EARLY10` — 10% off, min 2 nights
- `SUMMER20` — 20% off, valid June–August
- `WEEKEND15` — 15% off weekend bookings

**10 Sample Reviews** across rooms

---

## ENVIRONMENT VARIABLES

### `client/.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_GOOGLE_MAPS_KEY=xxxxx
```

### `server/.env`
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/aurelia_hotel
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hotel@gmail.com
SMTP_PASS=app_password_here
EMAIL_FROM="Aurélia Grand Hotel <hotel@aureliagrand.com>"

CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

## NON-FUNCTIONAL REQUIREMENTS

### Security
- Passwords hashed with bcrypt (salt rounds: 12)
- JWT stored in httpOnly cookies (not localStorage)
- CSRF protection on state-changing routes
- Rate limiting: 100 req/15min on auth routes (express-rate-limit)
- Helmet.js for HTTP security headers
- Input sanitization on all user inputs
- SQL injection prevention via Prisma parameterized queries
- File upload validation: images only, max 5MB

### Performance
- Image lazy loading with `loading="lazy"`
- React Query for server state caching and background refresh
- Pagination on all list endpoints (default page size: 12)
- Database indexes on: `Room.type`, `Booking.userId`, `Booking.roomId`, `Booking.checkIn`, `Booking.status`

### Error Handling
- Global error boundary in React (shows friendly error page)
- Express global error handler middleware
- All API errors return consistent `{ success, message, errors? }` format
- 404 page for unknown routes

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Sufficient color contrast ratios
- Skip navigation link

---

## IMPLEMENTATION ORDER

Implement in this exact sequence:

1. **Project Setup**: Initialize both `client/` and `server/` with all dependencies, folder structure, ESLint/Prettier config
2. **Database**: Prisma schema, migrations, seed data
3. **Backend — Auth**: Register, Login, JWT middleware, refresh tokens
4. **Backend — Rooms**: CRUD, availability logic, filters
5. **Backend — Bookings**: Create, list, cancel, availability check
6. **Backend — Payments**: Stripe integration, webhook
7. **Backend — Reviews, Offers, Admin**: Remaining routes
8. **Backend — Email & PDF**: Templates, invoice generation, cron reminders
9. **Frontend — Foundation**: Vite setup, Tailwind, fonts, global styles, Axios instance, Zustand stores
10. **Frontend — Layout**: Navbar, Footer, PageLayout, routing
11. **Frontend — Home Page**: All sections
12. **Frontend — Rooms Page**: Filters, grid, cards
13. **Frontend — Room Detail Page**: Gallery, booking widget
14. **Frontend — Booking Wizard**: 3-step flow, Stripe Elements
15. **Frontend — Auth Pages**: Login, Register, Forgot/Reset Password
16. **Frontend — Profile & My Bookings**: User dashboard
17. **Frontend — Admin Dashboard**: All admin pages
18. **Frontend — Remaining Pages**: About, Amenities, Gallery, Contact
19. **Testing & Polish**: Error states, loading states, empty states, mobile responsiveness
20. **README**: Complete setup instructions

---

## IMPORTANT INSTRUCTIONS FOR THE AI

- **Write ALL files completely** — no placeholders, no `// TODO`, no `...rest of code`. Every file must be production-ready.
- **Every component must handle**: loading state, error state, empty state.
- **Mobile-first responsive design** — test at 320px, 768px, 1024px, 1440px.
- **Consistent code style**: use async/await (not .then()), destructuring, named exports for components.
- **All forms**: real-time validation with error messages below each field.
- **Admin routes**: must be protected — return 403 if not ADMIN role.
- **Images**: use placeholder images from `https://picsum.photos` seeded with room IDs until real images are available.
- **Dark mode**: not required, the design is dark-themed by default.
- **Currency**: Indian Rupees (₹) throughout.
- **Stripe**: use test keys and test card `4242 4242 4242 4242`.
- **README.md**: must include full setup steps: clone → install → DB setup → seed → run.

---

*End of Prompt — This is a complete specification. Implement the full application exactly as described.*