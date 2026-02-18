# 🎯 BuildEstate Admin Panel

The administrative dashboard for managing the BuildEstate platform. Built with **React**, **Vite**, and **TailwindCSS**.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Dashboard-EA4335?style=for-the-badge&logo=render)](https://real-estate-website-admin.onrender.com/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Aayush_Vaghela-000000?style=for-the-badge)](https://aayush-vaghela.vercel.app/)

## ✨ Key Capabilities

- **Dashboard Analytics**: Real-time charts for properties, users, and revenue.
- **Property Management**: Create, update, and delete property listings.
- **User Management**: View and manage registered users.
- **Appointment Scheduling**: Manage property viewing appointments.
- **Bulk Upload**: Import multiple properties via CSV/Excel.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **Charts**: Chart.js / Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

1.  **Navigate to the admin directory:**

    ```bash
    cd admin
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the `admin` directory:

    ```env
    # Points to your backend API
    VITE_BACKEND_URL=http://localhost:4000
    ```

4.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    The dashboard will run at `http://localhost:5174`.

## 📜 Available Scripts

| Script            | Description                           |
| :---------------- | :------------------------------------ |
| `npm run dev`     | Starts the development server         |
| `npm run build`   | Builds the app for production         |
| `npm run preview` | Previews the production build locally |
| `npm run lint`    | Runs ESLint for code quality          |

## 🌐 Deployment

This project is optimized for deployment on **Render** or **Vercel**.

1.  **Push to GitHub.**
2.  **Import project** in your hosting provider.
3.  **Set Environment Variables**:
    - `VITE_BACKEND_URL`: `https://real-estate-website-backend-zfu7.onrender.com`
4.  **Deploy.**

---

Created by [Aayush Vaghela](https://aayush-vaghela.vercel.app/)
