from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import pandas as pd
from ..utils.database import get_db
from ..utils.auth import get_current_user
from ..ml.preprocessor import ActivityPreprocessor
from ..ml.anomaly_detector import SOCAnomalyDetector
from ..services.risk_scoring import RiskScoringEngine
from ..services.alert_service import create_alert
from ..models.user import User
from ..models.activity import UserActivity
from ..schemas.alert import AlertResponse

router = APIRouter(prefix="/ml", tags=["Machine Learning"])

preprocessor = ActivityPreprocessor()
detector = SOCAnomalyDetector()


@router.post("/predict", response_model=dict)
async def predict_anomaly(
    activity_data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    ML Endpoint: Predict anomaly and generate alert if suspicious
    """
    try:
        # Convert incoming data to DataFrame
        df = pd.DataFrame([activity_data])
        if "timestamp" in df.columns:
            df["timestamp"] = pd.to_datetime(df["timestamp"])

        # Feature Engineering
        df = preprocessor.extract_features(df)
        X_scaled = preprocessor.transform(df)

        # Anomaly Prediction
        prediction = detector.predict(X_scaled)[0]
        anomaly_score = float(detector.anomaly_score(X_scaled)[0])

        # Calculate Risk Score
        risk_features = {
            "failed_logins": activity_data.get("failed_logins", 0),
            "unusual_time": int(df["unusual_time"].iloc[0]),
            "session_duration": activity_data.get("session_duration", 0),
            "files_accessed": activity_data.get("files_accessed", 0),
            "ip_anomaly": activity_data.get("ip_anomaly", 0),
        }

        risk_score = RiskScoringEngine.calculate_risk_score(risk_features)
        severity = RiskScoringEngine.get_severity(risk_score)

        is_anomaly = prediction == -1 or risk_score > 0.45

        response = {
            "is_anomaly": bool(is_anomaly),
            "anomaly_score": round(anomaly_score, 4),
            "risk_score": risk_score,
            "severity": severity,
            "prediction": "ANOMALY" if is_anomaly else "NORMAL",
            "confidence": round(float(abs(anomaly_score)), 4),
        }

        # Auto-create alert if anomaly detected and username is provided
        if is_anomaly and "username" in activity_data:
            # Build a lightweight activity-like object for the alert service
            pseudo_activity = UserActivity(
                user_id=0,
                username=activity_data["username"],
                activity_type=activity_data.get("activity_type", "unknown"),
            )
            alert = await create_alert(
                db, pseudo_activity, risk_score, ml_score=anomaly_score
            )
            response["alert_id"] = alert.id

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")