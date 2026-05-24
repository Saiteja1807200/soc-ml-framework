import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT token if available
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('soc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('soc_token');
      // Redirect to login (avoid infinite loop if already on /login)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ---------- API Functions ----------

export const fetchDashboardStats = () => client.get('/analytics/analytics/dashboard');

export const fetchThreatTrends = () => client.get('/analytics/analytics/threat-trends');

export const fetchSuspiciousUsers = () => client.get('/analytics/analytics/suspicious-users');

export const fetchAlerts = (limit = 50) => client.get(`/alerts/?limit=${limit}`);

export const fetchHighRiskAlerts = () => client.get('/alerts/high-risk');

export const updateAlert = (alertId, data) => client.patch(`/alerts/${alertId}`, data);

export const predictAnomaly = (activityData) => client.post('/ml/predict', activityData);

export const login = (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  return client.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const register = (userData) => client.post('/auth/register', userData);

export default client;
