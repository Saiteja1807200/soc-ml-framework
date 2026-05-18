import pandas as pd
import os
import sys
from app.ml.preprocessor import ActivityPreprocessor
from app.ml.anomaly_detector import SOCAnomalyDetector

def train_soc_model():
    # Resolve dataset path:
    # __file__ = backend/app/ml/train_model.py  -> go up 3 levels to reach project root
    base_dir = os.path.dirname(os.path.abspath(__file__))  # backend/app/ml/
    project_root = os.path.normpath(os.path.join(base_dir, "..", "..", ".."))  # soc-ml-framework/
    data_path = os.path.join(project_root, "dataset", "sample_activities.csv")

    if not os.path.exists(data_path):
        print(f"WARNING: Sample dataset not found at: {data_path}")
        print("Run: python dataset/generate-sample-data.py first")
        return

    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])

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