# 🛡️ User-Centric Machine Learning Framework for SOC

> AI-Powered User Behavior Analytics & Threat Detection for Cybersecurity Operations Centers

## Overview

This framework combines **Machine Learning** (Isolation Forest anomaly detection) with real-time **User Behavior Analytics (UBA)** to detect insider threats, suspicious logins, and behavioral anomalies within a Security Operations Center.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                    │
│   Dashboard  │  Alerts  │  Analytics  │  ML Predict  │
├─────────────────────────────────────────────────────┤
│                   FastAPI Backend                    │
│   Auth  │  Alerts API  │  Analytics  │  ML Engine   │
├─────────────────────────────────────────────────────┤
│  SQLite / PostgreSQL  │  Isolation Forest Model     │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 19, Vite, Recharts, Lucide Icons      |
| Backend    | FastAPI, SQLAlchemy (async), Pydantic        |
| ML Engine  | scikit-learn (Isolation Forest), pandas      |
| Database   | SQLite (dev) / PostgreSQL (production)       |
| Auth       | JWT (python-jose), bcrypt (passlib)          |

---

## Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
# Optional: generate sample data
python ../dataset/generate-sample-data.py
# Train the ML model
python -m app.ml.train_model
# Start the API server
uvicorn app.main:app --reload --port 8000
```

The API docs will be available at: **http://localhost:8000/docs**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at: **http://localhost:5173**

---

## API Endpoints

| Method  | Endpoint                         | Description                    |
|---------|----------------------------------|--------------------------------|
| POST    | `/api/auth/register`             | Register a new user            |
| POST    | `/api/auth/login`                | Authenticate & get JWT token   |
| GET     | `/api/alerts/`                   | List security alerts           |
| GET     | `/api/alerts/high-risk`          | Get critical/high alerts only  |
| PATCH   | `/api/alerts/{id}`               | Update alert status            |
| GET     | `/api/analytics/dashboard`       | Dashboard statistics           |
| GET     | `/api/analytics/threat-trends`   | 7-day threat trends            |
| GET     | `/api/analytics/suspicious-users`| Top suspicious users           |
| POST    | `/api/ml/predict`                | ML anomaly prediction          |

---

## Project Structure

```
soc-ml-framework/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry
│   │   ├── ml/                  # ML pipeline
│   │   │   ├── anomaly_detector.py
│   │   │   ├── preprocessor.py
│   │   │   ├── predict.py
│   │   │   └── train_model.py
│   │   ├── models/              # SQLAlchemy models
│   │   ├── routes/              # API route handlers
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   └── utils/               # Config, DB, helpers
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/client.js        # Axios API client
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Dashboard, Alerts, Analytics
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── dataset/
│   ├── generate-sample-data.py
│   └── sample_activities.csv
└── docs/
    └── docker-compose.yml
```

---

## License

MIT
