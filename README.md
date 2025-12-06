# 🚗 Vehicle Rental System – REST API

A role-based vehicle rental management system built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**.
This backend provides authentication, vehicle management, bookings, and admin/customer-specific operations.

---

## 🌐 Live API URL

```
https://vehicle-rental-system-brown.vercel.app/
```

---

## 🧩 Features

### 🔐 Authentication

- Register & Login
- JWT-based authentication
- Role-based access: **admin**, **customer**

### 🚘 Vehicle Management

- Add a vehicle (admin only)
- Get all vehicles
- Get single vehicle
- Update/Delete vehicle (admin only)
- Vehicle availability auto-updated on booking/return

### 📅 Booking System

- Create Booking
- Customers can cancel booking (before start date)
- Admin can mark booking as returned
- Auto return system (based on `rent_end_date`)
- Vehicle availability updates automatically

### 👤 User Management

- Admin can view all users
- Users can view their profile

### 🛡 Middlewares

- Token verification
- Role-based protection
- Admin or Self verification

---

## 🛠️ Tech Stack

| Category           | Technology         |
| ------------------ | ------------------ |
| Runtime            | Node.js            |
| Framework          | Express.js         |
| Language           | TypeScript         |
| Database           | PostgreSQL         |
| ORM / DB Client    | node-postgres (pg) |
| Auth               | jsonwebtoken                |
| Password Hashing   | bcryptjs           |
| Environment Config | dotenv             |

---

## 📁 Project Structure

```
src/
 ├── config/
 │   ├── config.ts
 │   └── db.ts
 ├── middlewares/
 │   ├── adminOrSelfVerify.ts
 │   └── roleTokenVerify.ts
 ├── modules/
 │   ├── auth/
 │   ├── bookings/
 │   ├── user/
 │   └── vehicles/
 ├── types/
 │   └── app.ts
 ├── app.ts
 └── server.ts
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```sh
git clone https://github.com/rafiqmia65/vehicle-rental-system.git
cd vehicle-rental-system
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file:

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/vehicle_rental
JWT_SECRET=your-secret-key
```

### 4️⃣ Run in Development

```sh
npm run dev
```

### 5️⃣ Build for Production

```sh
npm run build
```

### 6️⃣ Start Production Server

```sh
npm start
```

---

## 📡 API Endpoints Overview

### 🔐 Auth

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/v1/auth/signup` | Register user     |
| POST   | `/api/v1/auth/signin`    | Login & get token |

### 🚘 Vehicles

| Method | Endpoint               | Role  | Description        |
| ------ | ---------------------- | ----- | ------------------ |
| POST   | `/api/v1/vehicles`     | Admin | Create vehicle     |
| GET    | `/api/v1/vehicles`     | All   | Get all vehicles   |
| GET    | `/api/v1/vehicles/:id` | All   | Get single vehicle |

### 📅 Bookings

| Method | Endpoint                      | Role           | Description            |
| ------ | ----------------------------- | -------------- | ---------------------- |
| POST   | `/api/v1/bookings`            | Customer       | Create booking         |
| GET    | `/api/v1/bookings`            | Admin/Customer | Get bookings           |
| PUT    | `/api/v1/bookings/:bookingId` | Admin/Customer | Update (cancel/return) |

---

## 🧪 Testing Tools (Optional)

You can use:

- Postman / Thunder Client
- Swagger (coming soon)

---

## 📦 Deployment (Vercel)

### Build Command

```
npm run build
```

### Output Directory

```
dist
```

Add `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/server.js"
    }
  ]
}
```