# 🏫 SchoolFlow

**SchoolFlow** is a modern multi-tenant school management SaaS platform designed to help schools manage students, fees, academic performance, attendance, and parent communication in one unified system.

---

## 🚀 Overview

SchoolFlow is built as a **multi-school (SaaS) platform**, meaning each school has isolated data under a shared system.

It supports:

- Private schools
- Academies
- Tuition centers

---

## 🎯 Core Features (MVP)

### 👨‍🏫 Admin & Teachers
- Manage students and classes
- Record attendance
- Manage exam results
- Track school fees and payments
- View analytics dashboard

### 👨‍👩‍👧 Parents
- View student performance
- Track attendance
- Monitor fee payments
- Receive updates and notifications

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control:
  - Admin
  - Teacher
  - Parent
- Multi-tenant (school_id isolation)

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MySQL

### ORM
- Sequelize

### Security
- JWT Authentication
- bcrypt password hashing
- Helmet security middleware
- Rate limiting

---

## 📁 Project Structure
schoolflow/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── app.js
│ └── server.js
│
├── frontend/
│ ├── admin/
│ ├── teacher/
│ ├── parent/
│ └── assets/
│
├── .env
├── package.json
└── README.md


---

## ⚙️ Installation & Setup

### 1. Clone repository
```bash
git clone <your-repo-url>
cd schoolflow/backend
2. Install dependencies
npm install
3. Setup environment variables

Create .env file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=schoolflow

JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret

MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
4. Run server

Development:

npm run dev

Production:

npm start
🌐 API Base URL
http://localhost:5000/api
🧠 Architecture

Frontend → Express API → Controllers → Sequelize Models → MySQL

Multi-tenant design ensures:

Each school is isolated via school_id
Secure role-based access control
💰 Business Model
SaaS subscription per school
Tiered plans:
Basic
Pro
Enterprise
Future: M-Pesa + Stripe integration
🔮 Future Enhancements
SMS & WhatsApp notifications
Mobile app (Flutter / React Native)
Automated report cards (PDF)
AI analytics for performance tracking
Online admissions system
👨‍💻 Author

Built as a production-ready SaaS school management system.

📄 License

Proprietary — for commercial deployment use.