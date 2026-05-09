from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActivityBase(BaseModel):
    activity_type: str
    ip_address: str
    device_info: Optional[str] = None
    location: Optional[str] = None
    session_duration: Optional[float] = None
    files_accessed: Optional[int] = 0

class ActivityCreate(ActivityBase):
    username: str
    timestamp: datetime

class ActivityResponse(ActivityBase):
    id: int
    username: str
    timestamp: datetime
    unusual_time: bool
    risk_contribution: float

    class Config:
        from_attributes = True