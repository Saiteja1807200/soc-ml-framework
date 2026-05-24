from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path
from dotenv import load_dotenv

# Always load from the project-root .env (3 levels up from utils/)
_ENV_PATH = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=_ENV_PATH)


class Settings(BaseSettings):
    # Application Settings
    APP_NAME: str = "User-Centric SOC ML Framework"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    # Security Settings
    SECRET_KEY: str = "CHANGE-ME-IN-PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./soc_ml_framework.db"

    # ML Model Settings — absolute paths relative to this config file
    MODEL_PATH: str = str(
        Path(__file__).resolve().parent.parent / "ml" / "models" / "isolation_forest_model.joblib"
    )
    SCALER_PATH: str = str(
        Path(__file__).resolve().parent.parent / "ml" / "models" / "scaler.joblib"
    )

    # CORS — set FRONTEND_URL in .env for production
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Alert Thresholds
    HIGH_RISK_THRESHOLD: float = 0.75
    MEDIUM_RISK_THRESHOLD: float = 0.45

    class Config:
        env_file = str(_ENV_PATH)
        case_sensitive = True


# Create settings instance
settings = Settings()