from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, text
from ..utils.database import get_db
from ..models.user import User
from ..models.alert import SecurityAlert
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Dashboard Analytics"])

@router.get("/dashboard")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """SOC Dashboard Statistics"""
    
    # Total Users
    total_users = await db.execute(select(func.count()).select_from(User))
    total_users = total_users.scalar()
    
    # Active Alerts
    active_alerts = await db.execute(
        select(func.count()).select_from(SecurityAlert).where(SecurityAlert.status == "NEW")
    )
    active_alerts = active_alerts.scalar()
    
    # High Risk Users
    high_risk = await db.execute(
        select(func.count()).select_from(User).where(User.risk_score >= 0.65)
    )
    high_risk = high_risk.scalar()
    
    # Today's Alerts
    today = datetime.utcnow().date()
    today_alerts = await db.execute(
        select(func.count()).select_from(SecurityAlert)
        .where(func.date(SecurityAlert.created_at) == today)
    )
    today_alerts = today_alerts.scalar()

    return {
        "total_users": total_users or 0,
        "active_alerts": active_alerts or 0,
        "high_risk_users": high_risk or 0,
        "today_alerts": today_alerts or 0,
        "overall_risk_level": "ELEVATED" if (high_risk or 0) > 5 else "NORMAL",
        "last_updated": datetime.utcnow().isoformat()
    }

@router.get("/threat-trends")
async def get_threat_trends(db: AsyncSession = Depends(get_db)):
    """7-day threat trend"""
    result = await db.execute(text("""
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as alert_count,
            AVG(risk_score) as avg_risk
        FROM security_alerts 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date
    """))
    return [dict(row) for row in result.fetchall()]

@router.get("/suspicious-users")
async def get_suspicious_users(db: AsyncSession = Depends(get_db)):
    """Top suspicious users"""
    result = await db.execute(
        select(User.username, User.risk_score, User.department)
        .where(User.risk_score > 0.4)
        .order_by(User.risk_score.desc())
        .limit(10)
    )
    return result.fetchall()