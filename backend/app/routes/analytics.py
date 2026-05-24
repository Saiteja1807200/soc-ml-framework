from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from ..utils.database import get_db
from ..utils.auth import get_current_user
from ..models.user import User
from ..models.alert import SecurityAlert
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/analytics", tags=["Dashboard Analytics"])


@router.get("/dashboard")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """SOC Dashboard Statistics"""

    # Total Users
    total_users_result = await db.execute(select(func.count()).select_from(User))
    total_users = total_users_result.scalar() or 0

    # Active Alerts
    active_alerts_result = await db.execute(
        select(func.count()).select_from(SecurityAlert).where(SecurityAlert.status == "NEW")
    )
    active_alerts = active_alerts_result.scalar() or 0

    # High Risk Users
    high_risk_result = await db.execute(
        select(func.count()).select_from(User).where(User.risk_score >= 0.65)
    )
    high_risk = high_risk_result.scalar() or 0

    # Today's Alerts
    today = datetime.now(timezone.utc).date()
    today_alerts_result = await db.execute(
        select(func.count()).select_from(SecurityAlert)
        .where(func.date(SecurityAlert.created_at) == today)
    )
    today_alerts = today_alerts_result.scalar() or 0

    return {
        "total_users": total_users,
        "active_alerts": active_alerts,
        "high_risk_users": high_risk,
        "today_alerts": today_alerts,
        "overall_risk_level": "ELEVATED" if high_risk > 5 else "NORMAL",
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/threat-trends")
async def get_threat_trends(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """7-day threat trend — compatible with SQLite and PostgreSQL"""
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)

    result = await db.execute(
        select(
            func.date(SecurityAlert.created_at).label("date"),
            func.count(SecurityAlert.id).label("alert_count"),
            func.avg(SecurityAlert.risk_score).label("avg_risk"),
        )
        .where(SecurityAlert.created_at >= seven_days_ago)
        .group_by(func.date(SecurityAlert.created_at))
        .order_by(func.date(SecurityAlert.created_at))
    )
    rows = result.fetchall()
    return [
        {
            "date": str(row.date),
            "alert_count": row.alert_count,
            "avg_risk": round(float(row.avg_risk or 0), 4),
        }
        for row in rows
    ]


@router.get("/suspicious-users")
async def get_suspicious_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Top suspicious users by risk score"""
    result = await db.execute(
        select(User.username, User.risk_score, User.department)
        .where(User.risk_score > 0.4)
        .order_by(User.risk_score.desc())
        .limit(10)
    )
    rows = result.fetchall()
    return [
        {"username": row.username, "risk_score": row.risk_score, "department": row.department}
        for row in rows
    ]