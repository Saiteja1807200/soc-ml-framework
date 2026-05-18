"""
Activity Service — CRUD operations for UserActivity records.
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from ..models.activity import UserActivity
from ..models.user import User
from ..schemas.activity import ActivityCreate
from datetime import datetime


async def log_activity(db: AsyncSession, activity_data: ActivityCreate) -> UserActivity:
    """
    Log a new user activity to the database.
    """
    # Determine if the activity happened at an unusual time
    hour = activity_data.timestamp.hour
    unusual_time = hour < 8 or hour > 20

    activity = UserActivity(
        user_id=0,  # Will be resolved below
        username=activity_data.username,
        timestamp=activity_data.timestamp,
        activity_type=activity_data.activity_type,
        ip_address=activity_data.ip_address,
        device_info=activity_data.device_info,
        location=activity_data.location,
        session_duration=activity_data.session_duration,
        files_accessed=activity_data.files_accessed,
        unusual_time=unusual_time,
        risk_contribution=0.0,
    )

    # Try to resolve user_id from username
    result = await db.execute(
        select(User.id).where(User.username == activity_data.username)
    )
    user_id = result.scalar_one_or_none()
    if user_id:
        activity.user_id = user_id

    db.add(activity)
    await db.commit()
    await db.refresh(activity)
    return activity


async def get_user_activities(
    db: AsyncSession, username: str, limit: int = 50
) -> list[UserActivity]:
    """
    Fetch the most recent activities for a specific user.
    """
    result = await db.execute(
        select(UserActivity)
        .where(UserActivity.username == username)
        .order_by(UserActivity.timestamp.desc())
        .limit(limit)
    )
    return result.scalars().all()


async def get_all_activities(db: AsyncSession, limit: int = 100) -> list[UserActivity]:
    """
    Fetch the most recent activities across all users.
    """
    result = await db.execute(
        select(UserActivity)
        .order_by(UserActivity.timestamp.desc())
        .limit(limit)
    )
    return result.scalars().all()


async def get_activity_stats(db: AsyncSession) -> dict:
    """
    Return aggregate activity statistics for the dashboard.
    """
    total = await db.execute(select(func.count()).select_from(UserActivity))
    total_count = total.scalar() or 0

    unusual = await db.execute(
        select(func.count())
        .select_from(UserActivity)
        .where(UserActivity.unusual_time == True)
    )
    unusual_count = unusual.scalar() or 0

    return {
        "total_activities": total_count,
        "unusual_time_activities": unusual_count,
        "unusual_percentage": round(
            (unusual_count / total_count * 100) if total_count > 0 else 0, 2
        ),
    }
