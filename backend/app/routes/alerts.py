from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from ..utils.database import get_db
from ..utils.auth import get_current_user
from ..models.alert import SecurityAlert
from ..models.user import User
from ..services.alert_service import get_recent_alerts
from ..schemas.alert import AlertResponse, AlertUpdate

router = APIRouter()


@router.get("/", response_model=list[AlertResponse])
async def get_alerts(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get recent security alerts"""
    alerts = await get_recent_alerts(db, limit)
    return alerts


@router.get("/high-risk", response_model=list[AlertResponse])
async def get_high_risk_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get only HIGH or CRITICAL alerts"""
    result = await db.execute(
        select(SecurityAlert)
        .where(SecurityAlert.severity.in_(["HIGH", "CRITICAL"]))
        .order_by(SecurityAlert.created_at.desc())
        .limit(20)
    )
    return result.scalars().all()


@router.patch("/{alert_id}", response_model=AlertResponse)
async def update_alert(
    alert_id: int,
    payload: AlertUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update alert status (Investigating / Resolved / False Positive)"""
    # Fetch the alert first
    result = await db.execute(select(SecurityAlert).where(SecurityAlert.id == alert_id))
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = payload.status
    alert.assigned_to = payload.assigned_to
    await db.commit()
    await db.refresh(alert)
    return alert