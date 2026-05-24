from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging
from pathlib import Path

from .utils.database import engine, Base
from .utils.config import settings
from .routes import auth, alerts, analytics, ml

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL, logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    logger.info("🚀 Starting User-Centric SOC ML Framework...")
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Database tables initialized")
    yield
    logger.info("🛑 Shutting down SOC Framework...")


app = FastAPI(
    title="User-Centric SOC ML Framework",
    description="AI-Powered User Behavior Analytics & Threat Detection for Cybersecurity Operations Center",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware — uses settings; override ALLOWED_ORIGINS / FRONTEND_URL in .env
origins = list(set(settings.ALLOWED_ORIGINS + [settings.FRONTEND_URL]))
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics & Dashboard"])
app.include_router(ml.router, prefix="/api", tags=["Machine Learning"])


@app.get("/")
async def root():
    return {
        "message": "🛡️ User-Centric Machine Learning Framework for SOC",
        "status": "active",
        "version": "1.0.0",
        "features": [
            "User Behavior Analytics",
            "Isolation Forest Anomaly Detection",
            "Real-time Risk Scoring",
            "Threat Intelligence Dashboard",
        ],
    }


@app.get("/health")
async def health_check():
    model_ok = Path(settings.MODEL_PATH).is_file()
    scaler_ok = Path(settings.SCALER_PATH).is_file()
    return {
        "status": "healthy" if model_ok and scaler_ok else "degraded",
        "service": "soc-ml-framework",
        "ml_model_loaded": model_ok,
        "ml_scaler_loaded": scaler_ok,
    }


if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)