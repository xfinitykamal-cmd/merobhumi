# BuildEstate — Backend API

REST API server for the BuildEstate real estate platform. Built with Node.js, Express, and MongoDB.

[![Live API](https://img.shields.io/badge/Live_API-On_Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://real-estate-website-backend-zfu7.onrender.com/)

---

## Features

- **JWT Authentication** — Secure token-based auth with bcrypt password hashing
- **Property CRUD** — Add, list, update, delete properties with up to 4 images each
- **Image Upload** — Multer file handling → ImageKit CDN storage
- **Appointment Scheduling** — Guest and authenticated bookings with email notifications
- **AI Property Search** — GPT-4.1 (GitHub Models) + Firecrawl web scraping
- **Location Trends** — Scraped market data for Indian cities
- **Contact Forms** — Submissions stored to MongoDB
- **Admin Dashboard Stats** — Property, user, and appointment counts
- **Rate Limiting** — express-rate-limit for DDoS protection
- **Security Headers** — Helmet.js middleware
- **Email Notifications** — Branded transactional emails via Brevo SMTP

---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js | Web application framework |
| **Database** | MongoDB Atlas | NoSQL document database |
| **ODM** | Mongoose | MongoDB object modeling |
| **Authentication** | JWT + Bcrypt | Secure auth system |
| **File Upload** | Multer + ImageKit | File handling and CDN |
| **Email** | Nodemailer + Brevo | Transactional emails |
| **AI Services** | GPT-4.1 + Firecrawl | Property search and scraping |
| **Security** | Helmet + CORS + rate-limit | Security middleware |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** ([Local](https://docs.mongodb.com/manual/installation/) or [Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** 8+ or **yarn** 1.22+

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure environment variables (see below)
nano .env.local

# Start development server
npm run dev
```

Server starts at `http://localhost:4000`

### Environment Configuration

Create `backend/.env.local` with these variables (see `.env.example` for the template):

```bash
PORT=4000
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# JWT (generate with: openssl rand -hex 32)
JWT_SECRET=your_jwt_secret_here

# Brevo SMTP
SMTP_USER=your_smtp_login
SMTP_PASS=your_smtp_password
EMAIL=your_sender_email@gmail.com

# Admin credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_admin_password

# Frontend URL (for CORS + email links)
WEBSITE_URL=http://localhost:5173

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# AI Services (optional — only needed for AI Property Hub)
FIRECRAWL_API_KEY=your_firecrawl_api_key
GITHUB_MODELS_API_KEY=your_github_pat_token
```

---

## 🏗️ Project Structure

```
backend/
├── � config/                # Configuration files
│   ├── config.js             # App configuration
│   ├── mongodb.js            # Database connection
│   ├── imagekit.js           # ImageKit setup
│   └── nodemailer.js         # Email configuration
│
├── 📁 controller/            # Request handlers
│   ├── adminController.js    # Admin operations
│   ├── appointmentController.js # Appointment management
│   ├── formcontroller.js     # Contact forms
│   ├── newscontroller.js     # News/blog management
│   ├── productcontroller.js  # Legacy product controller
│   ├── propertyController.js # Property CRUD operations
│   └── Usercontroller.js     # User management
│
├── 📁 middleware/            # Custom middleware
│   ├── authmiddleware.js     # JWT authentication
│   ├── multer.js             # File upload handling
│   └── statsMiddleware.js    # Analytics middleware
│
├── 📁 models/                # MongoDB schemas
│   ├── appointmentModel.js   # Appointment schema
│   ├── formmodel.js          # Contact form schema
│   ├── newsmodel.js          # News/blog schema
│   ├── propertymodel.js      # Property schema
│   ├── statsModel.js         # Analytics schema
│   └── Usermodel.js          # User schema
│
├── 📁 routes/                # API routes
│   ├── adminRoute.js         # Admin API routes
│   ├── appointmentRoute.js   # Appointment routes
│   ├── formrouter.js         # Contact form routes
│   ├── newsRoute.js          # News/blog routes
│   ├── ProductRouter.js      # Legacy product routes
│   ├── propertyRoutes.js     # Property API routes
│   └── UserRoute.js          # User authentication routes
│
├── 📁 services/              # Business logic
│   ├── aiService.js          # AI integration service
│   └── firecrawlService.js   # Web scraping service
│
├── 📁 uploads/               # Temporary file uploads
│
├── 📄 server.js              # Main application entry
├── 📄 serverweb.js           # Alternative server setup
├── 📄 package.json           # Dependencies and scripts
├── 📄 docker-compose.yml     # Docker configuration
├── 📄 Dockerfile             # Docker image definition
└── 📄 vercel.json            # Vercel deployment config
```

---

## API Endpoints

### Authentication (`/api/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register new user |
| POST | `/login` | — | Login (returns JWT) |
| POST | `/admin` | — | Admin login |
| GET | `/me` | JWT | Get current user profile |
| POST | `/forgot` | — | Send password reset email |
| POST | `/reset/:token` | — | Reset password with token |

### Properties (`/api/products`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/list` | — | List all properties |
| GET | `/single/:id` | — | Get property by ID |
| POST | `/add` | Admin | Add property (multipart: up to 4 images) |
| POST | `/update` | Admin | Update property (multipart) |
| POST | `/remove` | Admin | Delete property |

### Appointments (`/api/appointments`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/schedule` | — | Schedule viewing (guest) |
| POST | `/schedule/auth` | JWT | Schedule viewing (logged in) |
| GET | `/user` | — | Get appointments by user email |
| GET | `/upcoming` | — | Get upcoming appointments |
| PUT | `/cancel/:id` | — | Cancel an appointment |
| PUT | `/feedback/:id` | — | Submit feedback |
| GET | `/all` | Admin | Get all appointments |
| GET | `/stats` | Admin | Appointment statistics |
| PUT | `/status` | Admin | Update appointment status |
| PUT | `/update-meeting` | Admin | Add meeting link |

### Admin (`/api/admin`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/stats` | Admin | Dashboard statistics |
| GET | `/appointments` | Admin | All appointments |
| PUT | `/appointments/status` | Admin | Update status |

### Contact Forms (`/api/forms`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/submit` | — | Submit contact form |

### AI Search (`/api`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/ai/search` | — | AI-powered property search |
| POST | `/properties/search` | — | Property search |
| GET | `/locations/:city/trends` | — | Location trends data |

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart on changes) |
| `npm start` | Start production server |

## How Image Upload Works

1. Admin panel uploads images via the form
2. **Multer** saves files temporarily to `uploads/`
3. Files are pushed to **ImageKit CDN** via the SDK
4. CDN URLs are stored in MongoDB
5. Temporary files are deleted

## Deployment (Render)

1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `npm start`
6. Add all env variables from `.env.example`
7. Set `NODE_ENV=production` and `WEBSITE_URL` to your frontend URL

Currently deployed at: **https://real-estate-website-backend-zfu7.onrender.com**

## Related

- [Admin Panel README](../admin/README.md)
- [Frontend README](../frontend/README.md)
- [Root README](../README.md)

---

Built with ❤️ by [Aayush Vaghela](https://aayush-vaghela.vercel.app/)
