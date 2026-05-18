from sqlalchemy import Column, String, Float, Text, Integer, DateTime
from .base import Base
from datetime import datetime

class SecurityAlert(Base):
    __tablename__ = "security_alerts"

    user_id = Column(Integer)
    username = Column(String(50), index=True)
    
    alert_type = Column(String(50))  # suspicious_login, anomaly, insider_threat
    severity = Column(String(20))     # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text)
    risk_score = Column(Float)
    
    status = Column(String(20), default="NEW")  # NEW, INVESTIGATING, RESOLVED, FALSE_POSITIVE
    assigned_to = Column(String(50), nullable=True)
    
    ml_confidence = Column(Float)

    def __repr__(self):
        return f"<Alert {self.username} - {self.severity}>"