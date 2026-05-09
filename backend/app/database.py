from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite+aiosqlite:///./soc_ml_framework.db"  # Default to SQLite for easy development
)

# For PostgreSQL (recommended for production)
# DATABASE_URL = "postgresql+asyncpg://user:password@localhost/soc_ml_db"

engine = create_async_engine(
    DATABASE_URL, 
    echo=False,
    future=True,
    pool_pre_ping=True  # Helps with connection reliability
)

AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

# Dependency for FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# For synchronous operations if needed (e.g., training scripts)
sync_engine = create_engine(
    DATABASE_URL.replace("aiosqlite", "sqlite").replace("+asyncpg", ""),
    echo=False
)