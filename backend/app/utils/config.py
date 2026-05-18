from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Application Settings
    APP_NAME: str = "User-Centric SOC ML Framework"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite+aiosqlite:///./soc_ml_framework.db"
    )
    
    # ML Model Settings — absolute paths relative to this config file
    _BASE: Path = Path(__file__).resolve().parent.parent  # → backend/app/
    MODEL_PATH: str = str(Path(__file__).resolve().parent.parent / "ml" / "models" / "isolation_forest_model.joblib")
    SCALER_PATH: str = str(Path(__file__).resolve().parent.parent / "ml" / "models" / "scaler.joblib")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]  # Change to frontend URL in production
    
    # Alert Thresholds
    HIGH_RISK_THRESHOLD: float = 0.75
    MEDIUM_RISK_THRESHOLD: float = 0.45
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()