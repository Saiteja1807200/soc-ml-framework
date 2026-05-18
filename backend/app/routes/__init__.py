from .auth import router as auth_router
from .alerts import router as alerts_router
from .analytics import router as analytics_router
from .ml import router as ml_router

__all__ = ["auth_router", "alerts_router", "analytics_router", "ml_router"]
