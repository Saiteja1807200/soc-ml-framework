from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging

from .utils.database import engine, Base
from .utils.config import settings
from .routes import auth, alerts, analytics

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
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
    redoc_url="/redoc"
)

# CORS Middleware (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics & Dashboard"])

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
            "Threat Intelligence Dashboard"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "soc-ml-framework"}

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)