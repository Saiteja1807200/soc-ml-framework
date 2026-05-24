from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AlertBase(BaseModel):
    username: str
    alert_type: str
    description: str
    risk_score: float
    severity: str

class AlertResponse(AlertBase):
    id: int
    status: str
    ml_confidence: Optional[float] = 0.0
    created_at: datetime
    assigned_to: Optional[str] = None

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    status: str
    assigned_to: Optional[str] = None