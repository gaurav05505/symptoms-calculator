# MediCalc AI - Symptoms & BMI Health Calculator

A modern, responsive full-stack web application providing intelligent symptom checking, precision BMI calculation, patient age calculation, and user authentication with integrated Dark Mode.

---

## 🌟 Key Features

- **🌙 System-Wide Dark Mode**: Seamless toggle with persistent storage (`localStorage`) and system preference synchronization.
- **🩺 Intelligent Symptom Checker**: Real-time search across 75+ categorized symptoms, 1-click quick presets, and confidence-scored condition analysis with suggested OTC care, diet, and clinical red-flag warnings.
- **⚖️ Precision BMI Gauge**: Dual Metric (cm/kg) and Imperial (ft/in/lbs) unit support, visual color-coded spectrum pointer, ideal weight targets, and customized lifestyle advice.
- **🎂 Age & Milestone Calculator**: Exact date-of-birth age computation down to years, months, days, and a countdown to the next birthday.
- **🔐 User Authentication & Dashboard**: Secure cryptographic password hashing (`scrypt`) with registration, login, and personalized user dashboard.
- **⚡ Unified Backend & Frontend**: Express.js server automatically serves the static frontend with intelligent port-conflict fallback (e.g. 3005 ➔ 3006).

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 Custom Properties (Design System), Vanilla JavaScript (ES6+), Plus Jakarta Sans
- **Backend**: Node.js, Express.js, CORS
- **Storage**: JSON-based user database (`users.json`) with cryptographic salts
- **Deployment**: Compatible with Render, Railway, Vercel, or standalone Node.js environments

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
Run from either the root folder or the `symptoms-calculator` folder:
```bash
npm start
```

### 3. Open in Browser
Visit **[http://localhost:3005](http://localhost:3005)** *(or `http://localhost:3006` if port 3005 was already occupied)*.

---

## 📁 Project Structure

```text
app/
├── package.json
└── symptoms-calculator/
    ├── home.html         # Modern landing & overview page
    ├── index.html        # Symptom checker & age calculator
    ├── bmi.html          # BMI calculator with visual gauge
    ├── sample.html       # Authentication (Sign In & Register)
    ├── dashboard.html    # Patient user dashboard
    ├── calculator.js     # Diagnostic rules & calculation engine
    ├── theme.css         # Modern design system & dark mode tokens
    ├── theme.js          # Theme controller, auth state & toasts
    ├── server.js         # Express backend & static file server
    ├── users.json        # Encrypted user records
    ├── package.json      # Dependencies and start scripts
    └── README.md         # Documentation
```

---

## ⚠️ Disclaimer

*This application is engineered for informational and educational awareness only. It does not replace professional medical evaluation, diagnosis, or emergency care.*
