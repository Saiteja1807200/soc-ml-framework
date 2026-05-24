# 🚀 SOC ML Framework — Step-by-Step Deployment Guide

This guide walks you through deploying the **User-Centric SOC ML Framework** in three different environments:
1. **Local Environment** (For development and testing)
2. **Docker Compose** (Production-ready container orchestration)
3. **Cloud Platforms** (Vercel for Frontend + Render/Railway for Backend)

---

## 📋 Prerequisites
Before starting, ensure you have:
* **Git** installed and configured
* **Python 3.10+** (if deploying locally)
* **Node.js 18+ & npm** (if deploying locally)
* **Docker & Docker Compose** (if deploying via containers)

---

## 🛠️ Environment Configuration (`.env`)
Both backend and frontend require environment configuration. Create a `.env` file at the **project root** based on the `.env.example` template:

```ini
# Generate a secret key with: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-super-secret-key-change-in-production-NOW
DATABASE_URL=sqlite+aiosqlite:///./soc_ml_framework.db
DEBUG=false
LOG_LEVEL=INFO
FRONTEND_URL=http://localhost

# Docker Compose PostgreSQL Settings
POSTGRES_USER=soc_admin
POSTGRES_PASSWORD=choose-a-strong-password-here
POSTGRES_DB=soc_ml_db
```

---

## 🖥️ Option 1: Local Development Deployment

### Step 1: Prepare the Dataset & ML Model
1. Generate the sample activity log dataset:
   ```bash
   python dataset/generate-sample-data.py
   ```
2. Train and save the Isolation Forest model and scaler:
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m app.ml.train_model
   ```
   *Verify that `.joblib` files are created under `backend/app/ml/models/`.*

### Step 2: Run the FastAPI Backend
Start the FastAPI server using Uvicorn:
```bash
python -m uvicorn app.main:app --reload --port 8000
```
* The backend API docs will be active at: **`http://localhost:8000/docs`**
* Health check endpoint: **`http://localhost:8000/health`**

### Step 3: Run the React Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
* The frontend app will be active at: **`http://localhost:5173`**
* Enter a username and password at `/register` to create your administrator account, then login.

---

## 🐳 Option 2: Production Container Deployment (Docker Compose)
Docker Compose spins up three containers: PostgreSQL (database), FastAPI (backend), and Nginx (frontend reverse proxy).

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Docker Compose Network                        │
│                                                                         │
│   ┌────────────────┐      Proxy /api      ┌─────────────────┐           │
│   │    frontend    │ ───────────────────> │     backend     │           │
│   │    (Nginx)     │                      │ (FastAPI:8000)  │           │
│   └────────────────┘                      └─────────────────┘           │
│           │                                        │                    │
│      Port 80 (HTTP)                           PostgreSQL                │
│           ▼                                        ▼                    │
│      [Public User]                         ┌────────────────┐           │
│                                            │       db       │           │
│                                            │ (Postgres:5432)│           │
│                                            └────────────────┘           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Set Up Variables
1. Copy the example environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and change the default `POSTGRES_PASSWORD` and `SECRET_KEY`.

### Step 2: Build & Start Containers
Run the build command from the root directory:
```bash
docker compose up --build -d
```

### Step 3: Accessing the Services
Once container orchestration starts:
* **Frontend Application:** `http://localhost` (Port 80)
* **Backend API Docs:** `http://localhost/docs`
* **Health Check status:** `http://localhost/health`

### Step 4: Maintenance Commands
* **Stop services:** `docker compose down`
* **Stop and remove data volume:** `docker compose down -v`
* **Check backend logs:** `docker compose logs backend -f`

---

## ☁️ Option 3: Cloud Deployment (Vercel + Render/Railway)
If you do not have Docker or want to host it on the cloud for free/cheap:

```
┌────────────────────────┐               ┌────────────────────────┐
│   Vercel (Frontend)    │ ────────────> │    Render (Backend)    │
│   Static React SPA     │  API Queries  │  Python FastAPI + DB   │
└────────────────────────┘               └────────────────────────┘
```

### 1. Deploy Frontend on Vercel
1. Log in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your repository.
3. Configure the Project parameters:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Add the following **Environment Variable**:
   * `VITE_API_URL` = `https://your-backend-url.onrender.com/api` (Leave blank or update after deploying the backend).
5. Click **Deploy**. Vercel will build and serve your static React SPA.

### 2. Deploy Backend on Render
1. Log in to [Render](https://render.com) and click **New + > Web Service**.
2. Select your repository.
3. Configure the Service parameters:
   * **Language/Runtime:** `Python 3` (or choose `Docker` to deploy using our prebuilt Dockerfile)
   * **Build Command:** `pip install -r backend/requirements.txt`
   * **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 10000`
4. Add the following **Environment Variables**:
   * `SECRET_KEY` = *[Your Random Hex Secret]*
   * `DATABASE_URL` = `sqlite+aiosqlite:////opt/render/project/src/backend/soc_ml_framework.db` *(Or link to an external free Neon/Supabase Postgres database URL)*
   * `FRONTEND_URL` = `https://your-frontend-domain.vercel.app` (Your deployed Vercel URL)
5. Click **Create Web Service**.

*Note: Update the Vercel `VITE_API_URL` with your Render backend URL once the backend deployment completes.*

---

## 🔒 Security Best Practices for Production
1. **Rotate Secrets:** Never use placeholder secrets (`your-super-secret-key...`) in live deployments.
2. **CORS Configuration:** Limit backend CORS allowed origins by setting the `FRONTEND_URL` variable to your production frontend domain instead of allowing dev ports.
3. **Database Migration:** For multi-user environments, swap out the SQLite URL for a dedicated managed PostgreSQL database service.
4. **HTTPS:** Enforce SSL/TLS certificates on all API and frontend traffic (handled automatically by Nginx or Cloud Providers like Vercel and Render).
