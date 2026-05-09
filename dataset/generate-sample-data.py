import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_synthetic_data(n_samples=1500):
    np.random.seed(42)
    
    users = [f"user{i:03d}" for i in range(1, 51)]
    activities = ['login', 'file_access', 'network_connect', 'email_send', 'database_query']
    
    data = {
        'username': np.random.choice(users, n_samples),
        'timestamp': [datetime.now() - timedelta(days=np.random.randint(0, 30), hours=np.random.randint(0, 24)) for _ in range(n_samples)],
        'activity_type': np.random.choice(activities, n_samples),
        'ip_address': [f"192.168.1.{np.random.randint(1,255)}" for _ in range(n_samples)],
        'device_info': np.random.choice(['Windows-10', 'macOS', 'Ubuntu', 'iPhone'], n_samples),
        'session_duration': np.random.exponential(scale=45, size=n_samples).round(2),
        'files_accessed': np.random.poisson(lam=8, size=n_samples),
        'failed_logins': np.random.poisson(lam=1, size=n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Create some anomalies
    anomaly_idx = np.random.choice(n_samples, int(n_samples * 0.05), replace=False)
    df.loc[anomaly_idx, 'session_duration'] *= 3.5
    df.loc[anomaly_idx, 'files_accessed'] += 45
    df.loc[anomaly_idx, 'failed_logins'] += 6
    
    # Save the file
    os.makedirs('dataset', exist_ok=True)
    df.to_csv('dataset/sample_activities.csv', index=False)
    
    print(f"✅ SUCCESS! Generated {n_samples} records")
    print(f"📁 File saved at: dataset/sample_activities.csv")
    return df

if __name__ == "__main__":
    generate_synthetic_data(1500)