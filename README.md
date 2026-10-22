# Aetheris Premier - Full-Stack Online Banking System

An ultra-modern, high-security Online Banking Application featuring an **ultra-sleek ReactJS frontend** (Glassmorphism design, 3D card flip effects, expense analytics) coupled with a robust **Java Spring Boot 3 backend** powered by **Spring Security 6**, **JWT stateless authentication**, and **MySQL Database**.

---

## 🚀 Key Features

### 🎨 Frontend (ReactJS + Vite)
- **Glassmorphism UI**: High-end dark theme, vibrant gradient accents, backdrop filters, custom scrollbars, and smooth micro-animations.
- **Interactive Dashboard**: Real-time portfolio liquidity tracker, accounts overview, copy-to-clipboard account numbers, weekly expense bar chart, recent transactions feed.
- **Instant Money Transfer**: Modal form with source/target selection, instant validation, $0.00 fee breakdown, and transaction receipt generator.
- **3D Card & Security Manager**: Flip card animation to reveal CVV/expiry date, freeze/unfreeze card toggle, spending limit visualization.
- **Full Statement Ledger**: Search & filter transaction history by reference/type, with one-click **CSV Statement Export**.
- **Dual API Client**: Automatically connects live to Spring Boot backend (`http://localhost:8080/api`), with **seamless fallback mock mode** for instant frontend preview.

### 🛡️ Backend (Spring Boot 3 + Spring Security + JWT + MySQL)
- **Spring Security 6 Chain**: Custom `JwtAuthenticationFilter` protecting REST endpoints (`/api/accounts`, `/api/transactions`).
- **Stateless JWT Auth**: Signed token generation using HMAC-SHA256 with 24-hour expiration.
- **MySQL Persistence & JPA**: Relational database entities for `User`, `Account`, and `Transaction`.
- **Database Auto-Initialization**: Pre-configured `schema.sql` and `data.sql` scripts.

---

## 📁 Directory Structure

```
online-banking-system/
├── backend/                  # Spring Boot 3 Java Backend
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/bank/online/
│           │   ├── config/ SecurityConfig.java
│           │   ├── controller/ AuthController.java, AccountController.java, TransactionController.java
│           │   ├── dto/ AuthRequest.java, JwtResponse.java, TransferRequest.java, ...
│           │   ├── model/ User.java, Account.java, Transaction.java, ...
│           │   ├── repository/ UserRepository.java, AccountRepository.java, TransactionRepository.java
│           │   ├── security/ JwtTokenProvider.java, JwtAuthenticationFilter.java, CustomUserDetailsService.java
│           │   └── service/ AuthService.java, AccountService.java, TransactionService.java
│           └── resources/
│               ├── application.properties
│               ├── schema.sql
│               └── data.sql
└── frontend/                 # ReactJS + Vite Frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── index.css
        ├── components/ Dashboard.jsx, Header.jsx, Sidebar.jsx, TransferModal.jsx, CardsView.jsx, TransactionsView.jsx, AuthModal.jsx
        ├── context/ AuthContext.jsx
        └── services/ api.js
```

---

## 🛠️ Step-by-Step Setup Guide

### 1️⃣ Setting up MySQL Database
1. Make sure **MySQL Server** is running on `localhost:3306`.
2. Open MySQL Workbench or command line client and verify credentials:
   - Default Database Name: `online_banking_db`
   - Default Username: `root`
   - Default Password: `root1234` *(Update in `backend/src/main/resources/application.properties` if yours differs)*

### 2️⃣ Running the Spring Boot Backend
1. Open a terminal in `backend/`:
   ```bash
   cd C:\Users\Rohit\.gemini\antigravity\scratch\online-banking-system\backend
   ```
2. Build and run using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The API will start on **`http://localhost:8080`**.

### 3️⃣ Running the ReactJS Frontend
1. Open a terminal in `frontend/`:
   ```bash
   cd C:\Users\Rohit\.gemini\antigravity\scratch\online-banking-system\frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your browser at **`http://localhost:3000`**.

---

## 🔑 Pre-Configured Test Credentials

- **Username**: `john_doe`
- **Password**: `password123`
