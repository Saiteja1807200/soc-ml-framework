from typing import Dict
import numpy as np

class RiskScoringEngine:
    """
    Enterprise-grade Risk Scoring Engine for User Behavior Analytics
    """
    
    @staticmethod
    def calculate_risk_score(features: Dict) -> float:
        """
        Calculate composite risk score (0.0 - 1.0)
        """
        score = 0.0
        
        # Failed login attempts weight
        if features.get('failed_logins', 0) > 3:
            score += 0.35
        
        # Unusual time access
        if features.get('unusual_time', 0) == 1:
            score += 0.25
        
        # Session duration anomaly
        if features.get('session_duration', 0) > 480:  # > 8 hours
            score += 0.15
        
        # High file access volume
        if features.get('files_accessed', 0) > 50:
            score += 0.20
        
        # Location / IP anomaly
        if features.get('ip_anomaly', 0) == 1:
            score += 0.30
        
        # Normalize to 0-1 range
        return round(min(score, 1.0), 4)

    @staticmethod
    def get_severity(risk_score: float) -> str:
        if risk_score >= 0.75:
            return "CRITICAL"
        elif risk_score >= 0.55:
            return "HIGH"
        elif risk_score >= 0.35:
            return "MEDIUM"
        else:
            return "LOW"