from sqlalchemy import Column, String, Float, Boolean
from .base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    department = Column(String(50))
    role = Column(String(20), default="analyst")  # admin, analyst, viewer
    
    # Behavior Profile
    risk_score = Column(Float, default=0.0)
    anomaly_score = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True))
    profile_baseline_created = Column(Boolean, default=False)

    def __repr__(self):
        return f"<User {self.username}>"