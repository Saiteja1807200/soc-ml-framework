from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./soc_ml_framework.db"  # Default to SQLite for easy development
)

# For PostgreSQL (recommended for production):
# DATABASE_URL = "postgresql+asyncpg://user:password@localhost/soc_ml_db"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Import the single shared Base (defined in models/base.py)
from .models.base import Base  # noqa: E402 — imported here to avoid circular imports


# Dependency for FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# For synchronous operations if needed (e.g., training scripts)
if "aiosqlite" in DATABASE_URL:
    sync_url = DATABASE_URL.replace("sqlite+aiosqlite", "sqlite")
elif "asyncpg" in DATABASE_URL:
    sync_url = DATABASE_URL.replace("postgresql+asyncpg", "postgresql+psycopg2")
else:
    sync_url = DATABASE_URL

sync_engine = create_engine(sync_url, echo=False)