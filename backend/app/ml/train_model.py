import pandas as pd
import os
from preprocessor import ActivityPreprocessor
from anomaly_detector import SOCAnomalyDetector

def train_soc_model():
    # Load sample dataset
    data_path = "dataset/sample_activities.csv"
    if not os.path.exists(data_path):
        print("⚠️ Sample dataset not found. Please add data first.")
        return
    
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
    
    print("🎉 SOC ML Model Training Completed Successfully!")

if __name__ == "__main__":
    train_soc_model()