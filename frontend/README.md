# BuildEstate — Frontend

User-facing website for the BuildEstate platform. Built with React, TypeScript, Vite, and Tailwind CSS.

[![Live Demo](https://img.shields.io/badge/Live_Demo-buildestate.vercel.app-2ea44f?style=for-the-badge&logo=vercel)](https://buildestate.vercel.app)
[![Portfolio](https://img.shields.io/badge/Portfolio-Aayush_Vaghela-000000?style=for-the-badge)](https://aayush-vaghela.vercel.app/)

## Features

- **Property Browsing** — Filter by type, price, availability, and amenities with grid/list views
- **Property Details** — Full gallery, amenities list, and appointment booking
- **User Authentication** — Sign up, sign in, forgot/reset password
- **Appointment Booking** — Schedule property viewings as guest or logged-in user
- **AI Property Hub** — GPT-4.1 powered search and market analysis (local only — see below)
- **SEO Optimized** — Structured data, sitemap, robots.txt, meta tags per page
- **Page Transitions** — Smooth animations via Framer Motion

## Tech Stack

- **Framework**: React 18.3 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 + PostCSS
- **State Management**: React Context API
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Quick Start

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

Frontend runs at **http://localhost:5173**

## Environment Variables

Create `frontend/.env.local`:

```env
# Required — points to your backend API
VITE_API_BASE_URL=http://localhost:4000

# Optional — set to "true" to enable AI Property Hub locally
VITE_ENABLE_AI_HUB=true
```

> **Note:** Do not set `VITE_ENABLE_AI_HUB` on Vercel. Leaving it unset disables the AI Hub on the live site (saves API credits) and shows a "run locally" page instead.

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, featured properties, about sections |
| Properties | `/properties` | Browse with filters |
| Property Detail | `/properties/:id` | Full details + booking |
| AI Property Hub | `/ai-hub` | GPT-4.1 search (local only) |
| About | `/about` | Team and company info |
| Contact | `/contact` | Contact form |
| Sign In | `/signin` | User login |
| Sign Up | `/signup` | User registration |
| Forgot Password | `/forgot-password` | Password reset request |

## Project Structure

```
frontend/src/
├── components/
│   ├── ai-hub/           → AI Property Hub components
│   ├── common/           → Navbar, Footer, StructuredData, PageTransition
│   ├── home/             → Homepage sections
│   ├── properties/       → Filter sidebar, property cards, grid
│   ├── property-details/ → Gallery, amenities, booking form
│   ├── about/            → About page sections
│   └── contact/          → Contact page sections
├── contexts/             → AuthContext
├── hooks/                → useSEO custom hook
├── pages/                → All page components (lazy loaded)
├── services/             → api.ts (centralized Axios client)
└── styles/               → Global CSS
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_BASE_URL` = your Render backend URL
5. Do **not** set `VITE_ENABLE_AI_HUB` in Vercel (leave it unset)
6. Deploy

Currently deployed at: **https://buildestate.vercel.app**

## Related

- [Backend README](../backend/README.md)
- [Admin Panel README](../admin/README.md)
- [Root README](../README.md)

---

Created by [Aayush Vaghela](https://aayush-vaghela.vercel.app/)
