import joblib
from sklearn.ensemble import IsolationForest
import pandas as pd
from ..utils.config import settings

class SOCAnomalyDetector:
    def __init__(self):
        self.model = None
        self.model_path = settings.MODEL_PATH

    def train(self, X_train):
        """Train Isolation Forest for anomaly detection"""
        self.model = IsolationForest(
            n_estimators=100,
            contamination=0.05,      # 5% expected anomalies
            random_state=42,
            max_samples=256
        )
        self.model.fit(X_train)
        joblib.dump(self.model, self.model_path)
        print("✅ Isolation Forest model trained and saved!")
        return self.model

    def predict(self, X):
        """Return -1 for anomaly, 1 for normal"""
        if self.model is None:
            self.model = joblib.load(self.model_path)
        return self.model.predict(X)

    def anomaly_score(self, X):
        if self.model is None:
            self.model = joblib.load(self.model_path)
        return -self.model.score_samples(X)  # Higher = more anomalous