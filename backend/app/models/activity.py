from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Boolean
from .base import Base

class UserActivity(Base):
    __tablename__ = "user_activities"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    username = Column(String(50), index=True)
    
    # Activity Details
    timestamp = Column(DateTime(timezone=True), nullable=False)
    activity_type = Column(String(50))  # login, file_access, network, etc.
    ip_address = Column(String(45))
    device_info = Column(String(100))
    location = Column(String(100))
    
    # Features for ML
    session_duration = Column(Float)  # in minutes
    files_accessed = Column(Integer, default=0)
    unusual_time = Column(Boolean, default=False)
    risk_contribution = Column(Float, default=0.0)

    def __repr__(self):
        return f"<Activity {self.username} - {self.activity_type}>"