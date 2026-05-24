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
| Deploy     | Docker, Nginx, PostgreSQL                    |

---

## Quick Start (Local Development)

### 1. Environment Setup

```bash
# Clone and configure
cp .env.example .env
# Edit .env — set a strong SECRET_KEY
```

### 2. Backend

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

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at: **http://localhost:5173**

---

## 🐳 Docker Deployment (Production)

### Prerequisites

- Docker & Docker Compose installed

### Deploy

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env — set SECRET_KEY, POSTGRES_PASSWORD, FRONTEND_URL

# 2. Build and start all services
docker compose up --build -d

# 3. Access the application
#    Frontend:  http://localhost
#    API Docs:  http://localhost/docs
#    Backend:   http://localhost:8000
```

### Services

| Service    | Port | Description                         |
|------------|------|-------------------------------------|
| `frontend` | 80   | Nginx serving React SPA + API proxy |
| `backend`  | 8000 | FastAPI with Uvicorn (2 workers)    |
| `db`       | 5432 | PostgreSQL 16                       |

### Stop

```bash
docker compose down          # Stop services
docker compose down -v       # Stop + delete database volume
```

---

## API Endpoints

All data endpoints (except auth) require a valid JWT `Bearer` token.

| Method  | Endpoint                          | Auth   | Description                    |
|---------|-----------------------------------|--------|--------------------------------|
| POST    | `/api/auth/register`              | ✗      | Register a new user            |
| POST    | `/api/auth/login`                 | ✗      | Authenticate & get JWT token   |
| GET     | `/api/alerts/`                    | ✓      | List security alerts           |
| GET     | `/api/alerts/high-risk`           | ✓      | Get critical/high alerts only  |
| PATCH   | `/api/alerts/{id}`                | ✓      | Update alert status            |
| GET     | `/api/analytics/analytics/dashboard`    | ✓      | Dashboard statistics           |
| GET     | `/api/analytics/analytics/threat-trends`| ✓      | 7-day threat trends            |
| GET     | `/api/analytics/analytics/suspicious-users` | ✓ | Top suspicious users           |
| POST    | `/api/ml/predict`                 | ✓      | ML anomaly prediction          |
| GET     | `/health`                         | ✗      | Service + ML model health      |

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
│   │   │   ├── train_model.py
│   │   │   └── models/          # Trained .joblib files
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── routes/              # API route handlers
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   └── utils/               # Config, DB, auth, helpers
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/client.js        # Axios API client
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Dashboard, Alerts, Analytics
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── nginx.conf               # Production Nginx config
│   └── Dockerfile
├── dataset/
│   ├── generate-sample-data.py
│   └── sample_activities.csv
├── docker-compose.yml           # Production orchestration
├── .env.example                 # Environment template
└── README.md
```

---

## Environment Variables

| Variable            | Required | Default                    | Description                          |
|---------------------|----------|----------------------------|--------------------------------------|
| `SECRET_KEY`        | ✓        | —                          | JWT signing key (use `secrets.token_hex(32)`) |
| `DATABASE_URL`      | ✗        | SQLite (local file)        | Async DB URL                         |
| `DEBUG`             | ✗        | `false`                    | Enable debug mode                    |
| `LOG_LEVEL`         | ✗        | `INFO`                     | Python logging level                 |
| `FRONTEND_URL`      | ✗        | `http://localhost:5173`    | CORS allowed origin                  |
| `POSTGRES_USER`     | Docker   | `soc_admin`                | PostgreSQL username                  |
| `POSTGRES_PASSWORD` | Docker   | —                          | PostgreSQL password                  |
| `POSTGRES_DB`       | Docker   | `soc_ml_db`                | PostgreSQL database name             |
| `VITE_API_URL`      | Build    | `http://localhost:8000/api`| Frontend API base URL                |

---

## License

MIT
