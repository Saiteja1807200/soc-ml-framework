from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from ..models.alert import SecurityAlert
from ..models.activity import UserActivity
from ..schemas.alert import AlertResponse
from .risk_scoring import RiskScoringEngine

async def create_alert(db: AsyncSession, activity: UserActivity, risk_score: float, ml_score: float = 0.0):
    severity = RiskScoringEngine.get_severity(risk_score)
    
    alert = SecurityAlert(
        user_id=activity.user_id,
        username=activity.username,
        alert_type="behavior_anomaly" if ml_score > 0 else "suspicious_activity",
        severity=severity,
        description=f"Suspicious {activity.activity_type} detected for user {activity.username}",
        risk_score=risk_score,
        ml_confidence=ml_score
    )
    
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    return alert

async def get_recent_alerts(db: AsyncSession, limit: int = 50):
    result = await db.execute(
        select(SecurityAlert)
        .order_by(SecurityAlert.created_at.desc())
        .limit(limit)
    )
    return result.scalars().all()