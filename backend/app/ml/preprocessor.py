import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
import os
from ..utils.config import settings

class ActivityPreprocessor:
    def __init__(self):
        self.scaler = None
        self.feature_columns = [
            'session_duration', 'files_accessed', 'unusual_time',
            'hour_of_day', 'day_of_week'
        ]
        self.model_dir = os.path.dirname(settings.MODEL_PATH)
        os.makedirs(self.model_dir, exist_ok=True)

    def extract_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extract engineered features for ML"""
        df = df.copy()
        
        # Time-based features
        df['hour_of_day'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Unusual login time (outside 8 AM - 8 PM)
        df['unusual_time'] = ((df['hour_of_day'] < 8) | (df['hour_of_day'] > 20)).astype(int)
        
        # Normalize session duration
        if 'session_duration' in df.columns:
            df['session_duration'] = df['session_duration'].fillna(df['session_duration'].mean())
        
        return df

    def fit_scaler(self, X_train):
        self.scaler = StandardScaler()
        self.scaler.fit(X_train[self.feature_columns])
        joblib.dump(self.scaler, settings.SCALER_PATH)
        return self.scaler

    def transform(self, df: pd.DataFrame):
        if self.scaler is None:
            self.scaler = joblib.load(settings.SCALER_PATH)
        
        X = df[self.feature_columns].copy()
        X_scaled = self.scaler.transform(X)
        return X_scaled