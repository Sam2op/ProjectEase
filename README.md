# ProjectEase – MERN Stack Project Management Platform

ProjectEase is an end-to-end project-request, approval, tracking, and delivery system built with the MERN stack.  
It users (clients) seamlessly request academic or professional projects, monitor progress, and pay online, while administrators manage all projects, users, and payments from a single dashboard.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Quick Start](#quick-start)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Clone & Install](#2-clone--install)
  - [3. Environment Variables](#3-environment-variables)
  - [4. Run in Development](#4-run-in-development)
- [Core Scripts](#core-scripts)
- [Key API Endpoints](#key-api-endpoints)
- [Visual Overview](#visual-overview)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Dual-role authentication:** JWT with role-based guards (`admin`, `user`), email verification, password reset.
- **Public project catalogue:** Anyone can browse and request existing projects; guests may submit contact info if not logged in.
- **Custom project requests:** Users specify requirements & tech stack via dynamic form.
- **Admin dashboard:** CRUD for projects and users, searchable tables, inline status updates, notes, GitHub links, pricing.
- **User dashboard:** Lists every request (pending → completed), rich progress timeline, payment buttons (advance / full).
- **Status history & email alerts:** Every status change triggers automatic email to user and admin.
- **Integrated payments:** Razorpay checkout with order creation, webhook-style verification.
- **Modern UI/UX:** React, Tailwind CSS, Framer Motion animations, Toast notifications, responsive layout.
- **Profile management:** Avatar upload, contact number, GitHub link, change/forgot password.
- **Clean codebase:** Fully typed Mongo schemas, modular Express controllers, reusable React components.

## Tech Stack
| Layer                | Libraries / Tools                              |
|----------------------|------------------------------------------------|
| Front-end            | React 18, Vite, React Router 6, Tailwind CSS, Framer Motion, React-Hook-Form, Lucide Icons, React-Toastify |
| Back-end             | Node.js 18, Express 4, Mongoose 7, JWT, Bcrypt, Dotenv |
| Database             | MongoDB 5/6 (Atlas or local)                  |
| Email / Notifications| Nodemailer (SMTP or SendGrid)                 |
| Payments             | Razorpay REST API & Checkout v1               |
| Tooling              | ESLint, Prettier, Husky, VS Code settings      |

## Monorepo Structure
```
projectease/
├── projectease-backend/         # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   └── server.js
├── projectease-frontend/        # React client
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   ├── .env.example
│   └── vite.config.js
└── README.md
```

## Quick Start

### 1. Prerequisites
- **Node.js** >= 18.x  
- **npm** >= 9.x  
- **MongoDB** local instance _or_ free MongoDB Atlas cluster  
- **Git**

### 2. Clone & Install
```bash
git clone https://github.com//projectease.git
cd projectease

# Back-end dependencies
cd projectease-backend
npm install
cd ..

# Front-end dependencies
cd projectease-frontend
npm install
cd ..
```

### 3. Environment Variables
1. Copy both sample files:
   ```bash
   cp projectease-backend/.env.example projectease-backend/.env
   cp projectease-frontend/.env.example projectease-frontend/.env
   ```
2. Fill in:
   - **Backend:**  
     - `MONGODB_URI` – MongoDB connection string  
     - `JWT_SECRET` – long random string  
     - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` – SMTP creds  
     - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` – Razorpay test keys  
     - `FRONTEND_URL` – `http://localhost:5173`
   - **Frontend:**  
     - `VITE_API_URL` – `http://localhost:5000/api`  
     - `VITE_RAZORPAY_KEY_ID` – Razorpay public test key

### 4. Run in Development
_Open two terminals._

**Backend**
```bash
cd projectease-backend
npm run dev        # nodemon on http://localhost:5000
```

**Frontend**
```bash
cd projectease-frontend
npm run dev        # Vite on http://localhost:5173
```

Open the browser at `http://localhost:5173`.

## Core Scripts
| Location | Script         | Action                                |
|----------|----------------|---------------------------------------|
| backend  | `npm run dev`  | Start Express server with Nodemon     |
| backend  | `npm start`    | Start Express server (production)     |
| frontend | `npm run dev`  | Vite dev server + hot reload          |
| frontend | `npm run build`| Production build to `dist/`           |
| frontend | `npm run preview` | Preview production build locally |

## Key API Endpoints
| Method | Endpoint                        | Access            | Description                           |
|--------|---------------------------------|-------------------|---------------------------------------|
| POST   | `/api/auth/signup`              | Public            | Register user                         |
| POST   | `/api/auth/login`               | Public            | User/Admin login                      |
| GET    | `/api/projects`                 | Public            | List active projects                  |
| POST   | `/api/requests`                 | Guest/User        | Submit project/custom request         |
| GET    | `/api/requests/my`              | User (token)      | User’s own requests                   |
| GET    | `/api/requests`                 | Admin (token)     | All requests                          |
|