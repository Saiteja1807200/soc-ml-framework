"""
Standalone training script for the SOC ML Isolation Forest model.

Usage (from the project root):
    python -m backend.app.ml.train_model

Or (from the backend/ directory):
    python -m app.ml.train_model
"""
import pandas as pd
import os
import sys
from pathlib import Path


def train_soc_model():
    # Resolve dataset path relative to this file
    base_dir = Path(__file__).resolve().parent          # backend/app/ml/
    project_root = base_dir.parents[2]                  # soc-ml-framework/
    data_path = project_root / "dataset" / "sample_activities.csv"

    if not data_path.exists():
        print(f"WARNING: Sample dataset not found at: {data_path}")
        print("Run: python dataset/generate-sample-data.py first")
        return

    # Add project paths so relative imports work when run as a script
    backend_dir = str(base_dir.parents[1])  # backend/
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    from app.ml.preprocessor import ActivityPreprocessor
    from app.ml.anomaly_detector import SOCAnomalyDetector

    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    preprocessor = ActivityPreprocessor()
    df = preprocessor.extract_features(df)

    # Prepare features
    X = df[preprocessor.feature_columns]
    preprocessor.fit_scaler(X)

    X_scaled = preprocessor.transform(df)

    # Train model
    detector = SOCAnomalyDetector()
    detector.train(X_scaled)

    print("SUCCESS: SOC ML Model Training Completed!")


if __name__ == "__main__":
    train_soc_model()