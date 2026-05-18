"""
Convenience prediction module for quick anomaly detection on single activity records.
Wraps the preprocessor + detector pipeline.
"""
import pandas as pd
import numpy as np
from .preprocessor import ActivityPreprocessor
from .anomaly_detector import SOCAnomalyDetector
from ..services.risk_scoring import RiskScoringEngine


preprocessor = ActivityPreprocessor()
detector = SOCAnomalyDetector()


def predict_activity(activity_data: dict) -> dict:
    """
    Run the full ML prediction pipeline on a single activity record.
    
    Args:
        activity_data: dict with keys like username, timestamp, session_duration,
                       files_accessed, ip_address, failed_logins, etc.
    
    Returns:
        dict with is_anomaly, anomaly_score, risk_score, severity, prediction, confidence
    """
    # Convert to DataFrame
    df = pd.DataFrame([activity_data])
    
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Feature engineering
    df = preprocessor.extract_features(df)
    
    # Fill missing feature columns with defaults
    for col in preprocessor.feature_columns:
        if col not in df.columns:
            df[col] = 0
    
    # Scale features
    X_scaled = preprocessor.transform(df)
    
    # Predict
    prediction = detector.predict(X_scaled)[0]
    anomaly_score = float(detector.anomaly_score(X_scaled)[0])
    
    # Risk scoring
    risk_features = {
        'failed_logins': activity_data.get('failed_logins', 0),
        'unusual_time': int(df['unusual_time'].iloc[0]) if 'unusual_time' in df.columns else 0,
        'session_duration': activity_data.get('session_duration', 0),
        'files_accessed': activity_data.get('files_accessed', 0),
        'ip_anomaly': activity_data.get('ip_anomaly', 0),
    }
    
    risk_score = RiskScoringEngine.calculate_risk_score(risk_features)
    severity = RiskScoringEngine.get_severity(risk_score)
    
    is_anomaly = prediction == -1 or risk_score > 0.45
    
    return {
        "is_anomaly": bool(is_anomaly),
        "anomaly_score": round(anomaly_score, 4),
        "risk_score": risk_score,
        "severity": severity,
        "prediction": "ANOMALY" if is_anomaly else "NORMAL",
        "confidence": round(float(abs(anomaly_score)), 4),
    }
