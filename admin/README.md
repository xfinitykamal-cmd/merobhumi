# BuildEstate — Admin Panel

Administrative dashboard for managing the BuildEstate real estate platform. Built with React, Vite, and Tailwind CSS.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Dashboard-EA4335?style=for-the-badge&logo=render)](https://real-estate-website-admin.onrender.com/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Aayush_Vaghela-000000?style=for-the-badge)](https://aayush-vaghela.vercel.app/)

## Key Features

- **Dashboard Analytics** — Real-time charts for properties, users, and appointment stats
- **Property Management** — Add, update, and delete property listings with image upload
- **Appointment Management** — View, approve, cancel, and add meeting links to bookings
- **User Overview** — View registered users
- **Image Upload** — Upload up to 4 property images via ImageKit CDN

## Tech Stack

- **Framework:** React 18 + Vite 6
- **Styling:** Tailwind CSS v3
- **Charts:** Chart.js
- **Icons:** Lucide React
- **Notifications:** Sonner
- **HTTP Client:** Axios


## Quick Start

```bash
cd admin
npm install
cp .env.example .env.local
npm run dev
```

Admin panel runs at **http//localhost:5174**

## Environment Variables

Create `admin/.env.local`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

For production set VITE_BACKEND_URL to your deployed backend URL.

## Pages

| Page | Route | Description |
|---|---|---|
| Login | `/` | Admin authentication |
| Dashboard | `/dashboard` | Stats overview with charts |
| Add Property | `/add` | Add new listing with images |
| List Properties | `/list` | View and manage all listings |
| Update Property | `/update/:id` | Edit existing listing |
| Appointments | `/appointments` | View and manage all bookings |

## Project Structure

```
admin/src/
├── components/  login Navbar
├── config/      constants backend URL property types
├── contexts/    AdminContext auth state
├── pages/
│   ├── Dashboard.jsx
│   ├── Add.jsx
│   ├── List.jsx
│   ├── Update.jsx
│   └── Appointments.jsx
└── App.jsx
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Deployment

1. Push to GitHub
2. Create a Web Service on Render or import to Vercel
3. Set Root Directory to `admin`
4. Build Command: `npm install`
5. Publish Directory: `dist`
6. Add env var: `VITE_BACKEND_URL` = your backend URL

Deployed at: **https://real-estate-website-admin.onrender.com**

## Related

- [Backend README](../backend/README.md)
- [Frontend README](../frontend/README.md)
- [Root README](../README.md)

---

Created by [Aayush Vaghela](https://aayush-vaghela.vercel.app/)
