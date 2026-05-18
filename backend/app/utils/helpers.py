"""
Utility helpers for the SOC ML Framework.
"""
from datetime import datetime, timezone
from typing import Optional


def format_datetime(dt: Optional[datetime] = None, fmt: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format a datetime object to a consistent string.
    Defaults to current UTC time if no datetime is provided.
    """
    if dt is None:
        dt = datetime.now(timezone.utc)
    return dt.strftime(fmt)


def format_iso(dt: Optional[datetime] = None) -> str:
    """Return an ISO-8601 formatted string."""
    if dt is None:
        dt = datetime.now(timezone.utc)
    return dt.isoformat()


def paginate(query, page: int = 1, page_size: int = 20):
    """
    Apply offset/limit pagination to a SQLAlchemy select query.
    
    Args:
        query: A SQLAlchemy select() statement
        page: 1-indexed page number
        page_size: Number of records per page
    
    Returns:
        The query with offset and limit applied
    """
    page = max(1, page)
    page_size = max(1, min(page_size, 100))  # cap at 100
    offset = (page - 1) * page_size
    return query.offset(offset).limit(page_size)


def sanitize_input(value: str, max_length: int = 255) -> str:
    """
    Basic input sanitization:
    - Strip leading/trailing whitespace
    - Truncate to max_length
    - Remove null bytes
    """
    if not isinstance(value, str):
        return str(value)[:max_length]
    
    value = value.strip()
    value = value.replace("\x00", "")
    return value[:max_length]


def severity_color(severity: str) -> str:
    """Map severity level to a display color (for logging / API responses)."""
    colors = {
        "CRITICAL": "#ff1744",
        "HIGH": "#ff5722",
        "MEDIUM": "#ff9800",
        "LOW": "#4caf50",
    }
    return colors.get(severity.upper(), "#9e9e9e")


def risk_level_label(score: float) -> str:
    """Return a human-readable risk label from a 0-1 score."""
    if score >= 0.75:
        return "Critical"
    elif score >= 0.55:
        return "High"
    elif score >= 0.35:
        return "Medium"
    elif score >= 0.15:
        return "Low"
    return "Minimal"
