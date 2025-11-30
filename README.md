# Expense Tracker Backend

**Project:** `Expense_Tracker_Backend`

Backend for Expense Tracker application that powers authentication, expense CRUD, summary data for graphs, percentage calculations, and secure data management.

---

## Table of Contents

* [Overview](#overview)
* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Endpoints](#endpoints)
* [Authentication Flow](#authentication-flow)
* [Environment Variables](#environment-variables)
* [Installation & Setup](#installation--setup)
* [CORS Setup](#cors-setup)
* [Deployment (Vercel)](#deployment-vercel)
* [Common Issues](#common-issues)
* [Contributing](#contributing)

---

## Overview

This is the backend API built using **Node.js + Express + MongoDB** for the Expense Tracker app. It enables users to register, log in, and store expense records securely. It also provides summary and graph-ready data for frontend dashboards.

---

## Key Features

* User Authentication (JWT Based)
* Add / Edit / Delete / Get expenses
* Monthly & category-based summary for graphs
* Total expense calculation
* Designed to integrate directly with React frontend
* CORS enabled for Vercel deployments
* Modular code structure and clean architecture

---

## Tech Stack

| Technology                | Purpose                          |
| ------------------------- | -------------------------------- |
| Node.js                   | backend runtime                  |
| Express.js                | server framework                 |
| MongoDB                   | database                         |
| Mongoose                  | ORM for MongoDB                  |
| JSON Web Token            | authentication                   |
| bcrypt.js                 | password hashing                 |
| cors                      | security & cross origin requests |
| dotenv                    | environment variables            |
| Vercel / Railway / Render | deployment                       |

---

## Project Structure

```
Expense_Tracker_Backend/
├─ config/
│  └─ db.js
├─ controllers/
│  ├─ authController.js
│  └─ expenseController.js
├─ middleware/
│  ├─ authMiddleware.js
│  └─ errorHandler.js
├─ models/
│  ├─ User.js
│  └─ Expense.js
├─ routes/
│  ├─ authRoutes.js
│  └─ expenseRoutes.js
├─ .env
├─ server.js
└─ package.json
```

---

## Endpoints

### **Auth Routes** (`/api/auth`)

| Method | Endpoint    | Description             |
| ------ | ----------- | ----------------------- |
| POST   | `/register` | Register new user       |
| POST   | `/login`    | Login user & return JWT |
| GET    | `/me`       | Get logged-in user data |

### **Expense Routes** (`/api/expenses`)

| Method | Endpoint   | Description                             |
| ------ | ---------- | --------------------------------------- |
| GET    | `/`        | Get all expenses for logged user        |
| POST   | `/`        | Add new expense                         |
| PUT    | `/:id`     | Update expense                          |
| DELETE | `/:id`     | Delete expense                          |
| GET    | `/summary` | Summary for charts (category & monthly) |

---

## Authentication Flow

1. User signs up → password hashed using **bcrypt**
2. On login → token created using **JWT**
3. Token stored in frontend (localStorage or cookie)
4. Secure routes checked by middleware:

```js
Authorization: Bearer <token>
```

---

## Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_URL=https://expense-tracker-frontend-859b.vercel.app
```

---

## Installation & Setup

```bash
git clone https://github.com/<your-user>/Expense_Tracker_Backend.git
cd Expense_Tracker_Backend
npm install
npm start
```

API runs at: `http://localhost:5000`

---

## CORS Setup

```js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
```

---

## Deployment (Vercel)

1. Push code to GitHub
2. Import backend repo in Vercel
3. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT` = 5000)
4. Build & Run
5. Set Express entry as `server.js`

### **Important for Vercel**

```
"build": "echo building backend...",
"start": "node server.js"
```

If you see **Cannot GET /**, it is normal — this is API, not UI.

---

## Common Issues

| Issue                           | Fix                                     |
| ------------------------------- | --------------------------------------- |
| CORS blocked                    | set correct CLIENT_URL in backend       |
| 500: serverless crash on Vercel | missing `.env` or DB connection error   |
| Unauthorized (401)              | token missing in `Authorization` header |

---

## Contributing

1. Fork
2. Create branch
3. Commit & PR

---

### Contact

If you want me to add full code samples for controllers, routes, or DB connection, tell me and I will insert them here.

---

**Backend ready for production & Vercel deployment 🚀**
