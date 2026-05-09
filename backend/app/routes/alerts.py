from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..utils.database import get_db
from ..services.alert_service import get_recent_alerts
from ..schemas.alert import AlertResponse, AlertUpdate

router = APIRouter()

@router.get("/", response_model=list[AlertResponse])
async def get_alerts(limit: int = 50, db: AsyncSession = Depends(get_db)):
    """Get recent security alerts"""
    alerts = await get_recent_alerts(db, limit)
    return alerts

@router.get("/high-risk")
async def get_high_risk_alerts(db: AsyncSession = Depends(get_db)):
    """Get only HIGH or CRITICAL alerts"""
    result = await db.execute(
        "SELECT * FROM security_alerts WHERE severity IN ('HIGH', 'CRITICAL') ORDER BY created_at DESC LIMIT 20"
    )
    return result.fetchall()

@router.patch("/{alert_id}", response_model=AlertResponse)
async def update_alert(alert_id: int, update: AlertUpdate, db: AsyncSession = Depends(get_db)):
    """Update alert status (Investigating / Resolved / False Positive)"""
    result = await db.execute(
        "UPDATE security_alerts SET status=:status, assigned_to=:assigned_to WHERE id=:id RETURNING *",
        {"id": alert_id, "status": update.status, "assigned_to": update.assigned_to}
    )
    alert = result.fetchone()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    await db.commit()
    return alert