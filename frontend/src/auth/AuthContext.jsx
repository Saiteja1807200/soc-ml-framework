import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('soc_token'));
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored token
  useEffect(() => {
    if (token) {
      // Decode the JWT payload to get username (base64 middle segment)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.sub });
      } catch {
        // Token is corrupted — clear it
        localStorage.removeItem('soc_token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const signin = (accessToken) => {
    localStorage.setItem('soc_token', accessToken);
    setToken(accessToken);
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      setUser({ username: payload.sub });
    } catch {
      // ignore
    }
  };

  const signout = () => {
    localStorage.removeItem('soc_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signin, signout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export default AuthContext;
