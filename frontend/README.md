# 🏠 BuildEstate Frontend

The modern, responsive user interface for the BuildEstate platform. Built with **React**, **Vite**, and **TailwindCSS**.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-2ea44f?style=for-the-badge&logo=vercel)](https://buildestate.vercel.app)
[![Portfolio](https://img.shields.io/badge/Portfolio-Aayush_Vaghela-000000?style=for-the-badge)](https://aayush-vaghela.vercel.app/)

## ✨ Features

- **Responsive Design**: Mobile-first approach using TailwindCSS.
- **AI-Powered Search**: Smart property filtering and recommendations.
- **Interactive Maps**: Location-based property discovery.
- **User Dashboard**: Manage profile, favorites, and appointments.
- **Optimized Performance**: Vite-powered build with code splitting.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS + PostCSS
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **UI Components**: Radix UI, Headless UI, Lucide React
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the `frontend` directory:

    ```env
    # Points to your backend API
    VITE_API_BASE_URL=http://localhost:4000

    # Enable AI features (optional)
    VITE_ENABLE_AI_HUB=true
    ```

4.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:5173`.

## 📜 Available Scripts

| Script            | Description                           |
| :---------------- | :------------------------------------ |
| `npm run dev`     | Starts the development server         |
| `npm run build`   | Builds the app for production         |
| `npm run preview` | Previews the production build locally |
| `npm run lint`    | Runs ESLint for code quality          |

## 🌐 Deployment

This project is optimized for deployment on **Vercel**.

1.  **Push to GitHub.**
2.  **Import project** in Vercel.
3.  **Set Environment Variables** in Vercel Project Settings:
    - `VITE_API_BASE_URL`: `https://real-estate-website-backend-zfu7.onrender.com`
4.  **Deploy.**

---

Created by [Aayush Vaghela](https://aayush-vaghela.vercel.app/)
