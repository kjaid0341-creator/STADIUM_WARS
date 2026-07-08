import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'FAN' | 'VOLUNTEER' | 'STAFF';
  preferredLanguage: 'en' | 'es' | 'hi';
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'FAN' | 'VOLUNTEER' | 'STAFF', language?: 'en' | 'es' | 'hi') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name?: string, preferredLanguage?: 'en' | 'es' | 'hi') => Promise<void>;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
}

// Configurable API base url for custom cloud deployments (e.g. Render / Heroku backend URL)
const API_BASE = ((import.meta as any).env?.VITE_API_URL || '').replace(/\/$/, '');

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-refresh access token on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const res = await response.json();
          const token = res.data.accessToken;
          setAccessToken(token);

          // Get profile
          const profileResponse = await fetch(`${API_BASE}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (profileResponse.ok) {
            const profileRes = await profileResponse.json();
            setUser(profileRes.data.user);
          }
        }
      } catch (err) {
        console.error('Failed auto-auth check:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || 'Login failed');
    }

    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'FAN' | 'VOLUNTEER' | 'STAFF',
    preferredLanguage: 'en' | 'es' | 'hi' = 'en'
  ) => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, preferredLanguage }),
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to log out on server:', err);
    }
    setAccessToken(null);
    setUser(null);
  };

  const updateProfile = async (name?: string, preferredLanguage?: 'en' | 'es' | 'hi') => {
    if (!accessToken) throw new Error('Unauthenticated');

    const response = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name, preferredLanguage }),
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || 'Failed to update profile');
    }

    setUser(res.data.user);
  };

  // Helper fetch method that appends authorization header and automatically attempts refresh on 401
  const apiFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const requestUrl = url.startsWith('/') ? `${API_BASE}${url}` : url;
    let response = await fetch(requestUrl, { ...options, headers });

    if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
      // Access token expired, attempt refresh
      try {
        const refreshResponse = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newToken = refreshData.data.accessToken;
          setAccessToken(newToken);

          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(requestUrl, { ...options, headers });
        } else {
          // Refresh failed, logout
          logout();
          throw new Error('Session expired. Please log in again.');
        }
      } catch (err) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        updateProfile,
        apiFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
