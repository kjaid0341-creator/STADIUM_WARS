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

// --- Standalone In-Browser Simulation Helpers for Zero-Config Vercel Demo ---

const generateMockWayfindingResponse = (query: string, language: 'en' | 'es' | 'hi'): string => {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('restroom') || lowerQuery.includes('toilet') || lowerQuery.includes('washroom') || lowerQuery.includes('baño') || lowerQuery.includes('शौचालय')) {
    if (language === 'es') return "El baño accesible más cercano se encuentra en el Pasillo A, al lado de la Sección 104. También hay baños adicionales en el Pasillo B.";
    if (language === 'hi') return "निकटतम सुलभ शौचालय कॉनकोर्स ए में सेक्शन 104 के पास स्थित है। कॉनकोर्स बी में भी अतिरिक्त शौचालय हैं।";
    return "The nearest accessible restroom is located in Concourse A, right next to Section 104. Additional restrooms are available in Concourse B near Section 206.";
  }
  if (lowerQuery.includes('gate 12') || lowerQuery.includes('puerta 12') || lowerQuery.includes('गेट 12')) {
    if (language === 'es') return "Para llegar a la Puerta 12, diríjase al Pasillo Este. Está al lado de la zona de recogida de viajes compartidos (rideshare), a unos 5 minutos a pie.";
    if (language === 'hi') return "गेट 12 पर जाने के लिए पूर्वी कॉनकोर्स की ओर बढ़ें। यह राइडशेयर पिक-अप ज़ोन के बगल में है, लगभग 5 मिनट की पैदल दूरी पर।";
    return "To reach Gate 12, walk toward the East Concourse. It is located directly adjacent to the rideshare drop-off zone, roughly a 5-minute walk.";
  }
  if (lowerQuery.includes('gate 3') || lowerQuery.includes('puerta 3') || lowerQuery.includes('गेट 3')) {
    if (language === 'es') return "La Puerta 3 está ubicada en el sector Norte del estadio. Es el punto de acceso más cercano si viene en transporte público.";
    if (language === 'hi') return "गेट 3 स्टेडियम के उत्तरी हिस्से में स्थित है। यदि आप सार्वजनिक परिवहन से आ रहे हैं तो यह सबसे निकटतम प्रवेश बिंदु है।";
    return "Gate 3 is at the North side of the stadium. It is the closest entrance point if you are arriving via public transit.";
  }
  if (lowerQuery.includes('gate 5') || lowerQuery.includes('puerta 5') || lowerQuery.includes('गेट 5')) {
    if (language === 'es') return "La Puerta 5 está en el sector Oeste. Es la mejor entrada si estaciona en el estacionamiento premium.";
    if (language === 'hi') return "गेट 5 पश्चिमी भाग में है। यदि आप प्रीमियम पार्किंग में पार्क करते हैं तो यह सबसे अच्छा प्रवेश द्वार है।";
    return "Gate 5 is on the West side. It is the best entrance if you are parking in the premium parking lots.";
  }
  if (lowerQuery.includes('seat') || lowerQuery.includes('section') || lowerQuery.includes('asiento') || lowerQuery.includes('sección') || lowerQuery.includes('सीट') || lowerQuery.includes('सेक्शन')) {
    if (language === 'es') return "Para los asientos en la Sección 102 y 104, acceda por la Puerta 3. Para la Sección 206, use la Puerta 5 y suba las escaleras mecánicas.";
    if (language === 'hi') return "सेक्शन 102 और 104 की सीटों के लिए, गेट 3 से प्रवेश करें। सेक्शन 206 के लिए, गेट 5 का उपयोग करें और एस्केलेटर लें।";
    return "For seats in Sections 102 and 104, enter through Gate 3. For Section 206, use Gate 5 and take the escalators to the upper tier.";
  }
  if (language === 'es') return "¡Hola! Bienvenido al Estadio Mundialista 2026. Puedo guiarlo a su asiento, baños, salidas o ayudarlo con alertas de tráfico. ¿En qué puedo ayudarle hoy?";
  if (language === 'hi') return "नमस्ते! वर्ल्ड कप 2026 स्टेडियम में आपका स्वागत है। मैं आपकी सीट, शौचालय, निकास द्वार ढूंढने में सहायता कर सकता हूँ। मैं आपकी क्या मदद करूँ?";
  return "Hello! Welcome to FIFA World Cup 2026 Stadium. I can guide you to your seat, restrooms, food courts, gates, or assist with live alerts. How can I help you today?";
};

const getMockSensorReadings = () => {
  return [
    { sectionId: 'GATE_3', capacity: 8000, crowdCount: 4200 },
    { sectionId: 'GATE_5', capacity: 6000, crowdCount: 5800 },
    { sectionId: 'GATE_12', capacity: 10000, crowdCount: 3100 },
    { sectionId: 'CONCOURSE_A', capacity: 4000, crowdCount: 2200 },
    { sectionId: 'CONCOURSE_B', capacity: 5000, crowdCount: 4500 },
    { sectionId: 'SECTION_102', capacity: 2000, crowdCount: 1500 },
    { sectionId: 'SECTION_104', capacity: 2500, crowdCount: 2400 },
    { sectionId: 'SECTION_206', capacity: 3000, crowdCount: 900 }
  ];
};

const generateMockCrowdRecommendation = (sensorData: any[]): string => {
  const alerts: string[] = [];
  const criticalSections = sensorData.filter((s: any) => (s.crowdCount / s.capacity) >= 0.8);
  if (criticalSections.length > 0) {
    criticalSections.forEach((sec: any) => {
      const occupancy = Math.round((sec.crowdCount / sec.capacity) * 100);
      if (sec.sectionId === 'GATE_5') {
        alerts.push(`• **Gate 5 Congestion (${occupancy}%)**: Critical density detected. Direct incoming fans from West parking lots to **Gate 12** (currently operating at 31% capacity). Update digital signage immediately.`);
      } else if (sec.sectionId === 'SECTION_104') {
        alerts.push(`• **Section 104 Bottleneck (${occupancy}%)**: Concourse flow is constricted. Deploy stadium stewards from Section 206 to guide crowd dispersal toward Concourse B.`);
      } else if (sec.sectionId === 'CONCOURSE_B') {
        alerts.push(`• **Concourse B Crowding (${occupancy}%)**: High food/restroom queue volume. Activate auxiliary restrooms in Concourse A and update wayfinding boards.`);
      } else {
        alerts.push(`• **${sec.sectionId} Congestion (${occupancy}%)**: Occupancy exceeds threshold. Deploy secondary crowd guides.`);
      }
    });
    return `### 🚨 StadiumIQ Operational Alerts\n\n${alerts.join('\n')}\n\n**Expected Impact:** Re-routing fans to less loaded gates is projected to reduce bottlenecks by 15-20% within 10 minutes.`;
  }
  return `### ✅ Stadium Operations Normal\n\n• **All checkpoints stable**: Average crowd density is within normal parameters (~45% capacity).\n• **Action Plan**: Continue standard monitoring. No routing changes required.`;
};

const simulateApiCall = async (url: string, options: RequestInit = {}): Promise<any> => {
  const body = options.body ? JSON.parse(options.body as string) : {};
  const method = options.method || 'GET';

  // Introduce brief latency to feel like a real database write
  await new Promise(resolve => setTimeout(resolve, 300));

  if (url.includes('/api/auth/register')) {
    const users = JSON.parse(localStorage.getItem('stadium_users') || '[]');
    if (users.find((u: any) => u.email === body.email)) {
      throw new Error('User with this email already exists');
    }
    const newUser = {
      id: Date.now(),
      email: body.email,
      name: body.name,
      role: body.role,
      preferredLanguage: body.preferredLanguage || 'en'
    };
    users.push(newUser);
    localStorage.setItem('stadium_users', JSON.stringify(users));
    return { status: 'success', data: { user: newUser } };
  }

  if (url.includes('/api/auth/login')) {
    const users = JSON.parse(localStorage.getItem('stadium_users') || '[]');
    // Seed default users if empty so first-load logins can use mock values
    if (users.length === 0) {
      users.push({ id: 1, email: 'fan@fifa.com', name: 'Diego', role: 'FAN', preferredLanguage: 'es' });
      users.push({ id: 2, email: 'staff@stadium.iq', name: 'Director', role: 'STAFF', preferredLanguage: 'en' });
      localStorage.setItem('stadium_users', JSON.stringify(users));
    }

    const user = users.find((u: any) => u.email === body.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    localStorage.setItem('stadium_current_user', JSON.stringify(user));
    localStorage.setItem('stadium_token', 'mock_jwt_access_token_123');
    return { status: 'success', data: { accessToken: 'mock_jwt_access_token_123', user } };
  }

  if (url.includes('/api/auth/refresh')) {
    const user = JSON.parse(localStorage.getItem('stadium_current_user') || 'null');
    if (!user) throw new Error('Unauthenticated');
    return { status: 'success', data: { accessToken: 'mock_jwt_access_token_123' } };
  }

  if (url.includes('/api/auth/profile')) {
    if (method === 'PUT') {
      const currentUser = JSON.parse(localStorage.getItem('stadium_current_user') || 'null');
      if (!currentUser) throw new Error('Unauthenticated');
      const updated = { ...currentUser, ...body };
      localStorage.setItem('stadium_current_user', JSON.stringify(updated));
      const users = JSON.parse(localStorage.getItem('stadium_users') || '[]');
      const idx = users.findIndex((u: any) => u.id === currentUser.id);
      if (idx >= 0) {
        users[idx] = updated;
        localStorage.setItem('stadium_users', JSON.stringify(users));
      }
      return { status: 'success', data: { user: updated } };
    } else {
      const user = JSON.parse(localStorage.getItem('stadium_current_user') || 'null');
      if (!user) throw new Error('User not found');
      return { status: 'success', data: { user } };
    }
  }

  if (url.includes('/api/auth/logout')) {
    localStorage.removeItem('stadium_current_user');
    localStorage.removeItem('stadium_token');
    return { status: 'success', message: 'Logged out successfully' };
  }

  if (url.includes('/api/ai/chat')) {
    const responseText = generateMockWayfindingResponse(body.query, body.language || 'en');
    return { status: 'success', data: { response: responseText } };
  }

  if (url.includes('/api/ai/recommendations')) {
    const sensorReadings = getMockSensorReadings();
    const recommendations = generateMockCrowdRecommendation(sensorReadings);
    return { status: 'success', data: { recommendations, timestamp: new Date() } };
  }

  if (url.includes('/api/incidents')) {
    const incidents = JSON.parse(localStorage.getItem('stadium_incidents') || '[]');
    if (method === 'POST') {
      const currentUser = JSON.parse(localStorage.getItem('stadium_current_user') || 'null');
      const newInc = {
        id: Date.now(),
        type: body.type,
        location: body.location,
        severity: body.severity,
        description: body.description,
        reporterName: currentUser ? currentUser.name : 'Steward',
        status: 'OPEN',
        createdAt: new Date().toISOString()
      };
      incidents.unshift(newInc);
      localStorage.setItem('stadium_incidents', JSON.stringify(incidents));
      window.dispatchEvent(new CustomEvent('stadium_new_incident', { detail: newInc }));
      return { status: 'success', data: { incident: newInc } };
    } else if (method === 'PATCH') {
      const parts = url.split('/');
      const idStr = parts[parts.length - 2];
      const incId = parseInt(idStr, 10);
      const idx = incidents.findIndex((i: any) => i.id === incId);
      if (idx >= 0) {
        incidents[idx].status = body.status;
        localStorage.setItem('stadium_incidents', JSON.stringify(incidents));
        window.dispatchEvent(new CustomEvent('stadium_new_incident', { detail: incidents[idx] }));
        return { status: 'success', data: { incident: incidents[idx] } };
      }
      throw new Error('Incident not found');
    } else {
      return { status: 'success', data: { incidents } };
    }
  }

  if (url.includes('/api/alerts')) {
    const alerts = JSON.parse(localStorage.getItem('stadium_alerts') || '[]');
    if (method === 'POST') {
      const currentUser = JSON.parse(localStorage.getItem('stadium_current_user') || 'null');
      const newAlert = {
        id: Date.now(),
        message: body.message,
        severity: body.severity,
        senderName: currentUser ? currentUser.name : 'System',
        createdAt: new Date().toISOString()
      };
      alerts.unshift(newAlert);
      localStorage.setItem('stadium_alerts', JSON.stringify(alerts));
      window.dispatchEvent(new CustomEvent('stadium_new_alert', { detail: newAlert }));
      return { status: 'success', data: { alert: newAlert } };
    } else {
      return { status: 'success', data: { alerts } };
    }
  }

  if (url.includes('/api/analytics')) {
    const incidents = JSON.parse(localStorage.getItem('stadium_incidents') || '[]');
    const totalIncidents = incidents.length;
    const openIncidents = incidents.filter((i: any) => i.status === 'OPEN').length;
    const users = JSON.parse(localStorage.getItem('stadium_users') || '[]');
    const activeUsers = users.length;
    
    const groups: Record<string, number> = {};
    incidents.forEach((i: any) => {
      groups[i.type] = (groups[i.type] || 0) + 1;
    });
    const incidentTypes = Object.entries(groups).map(([type, count]) => ({ type, count }));

    const avgWaitTimes = [
      { hour: '09:00', gate3: 12, gate5: 25, gate12: 8 },
      { hour: '10:00', gate3: 15, gate5: 35, gate12: 10 },
      { hour: '11:00', gate3: 18, gate5: 48, gate12: 12 },
      { hour: '12:00', gate3: 28, gate5: 58, gate12: 15 },
      { hour: '13:00', gate3: 20, gate5: 42, gate12: 18 },
      { hour: '14:00', gate3: 14, gate5: 22, gate12: 11 },
    ];

    const hourlyIncidents = [
      { hour: '09:00', medical: 1, security: 0, crowd: 2 },
      { hour: '10:00', medical: 2, security: 1, crowd: 4 },
      { hour: '11:00', medical: 0, security: 0, crowd: 7 },
      { hour: '12:00', medical: 3, security: 2, crowd: 12 },
      { hour: '13:00', medical: 1, security: 1, crowd: 5 },
      { hour: '14:00', medical: 0, security: 0, crowd: 2 },
    ];

    return {
      status: 'success',
      data: {
        metrics: {
          totalIncidents,
          openIncidents,
          activeUsers: activeUsers || 10,
          avgWaitTimeMinutes: 24,
          safetyRating: 98.4
        },
        incidentTypes,
        waitTimesTimeSeries: avgWaitTimes,
        incidentsTimeSeries: hourlyIncidents,
      }
    };
  }

  throw new Error('Endpoint mockup not implemented');
};

// --- End of Simulation Helpers ---

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

        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          const res = await response.json();
          const token = res.data.accessToken;
          setAccessToken(token);

          // Get profile
          const profileResponse = await fetch(`${API_BASE}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const profileContentType = profileResponse.headers.get('content-type');
          if (profileResponse.ok && profileContentType && profileContentType.includes('application/json')) {
            const profileRes = await profileResponse.json();
            setUser(profileRes.data.user);
          }
        } else {
          // If response is not JSON (like Vercel 404 html), trigger simulation check
          throw new Error('Not JSON response');
        }
      } catch (err) {
        // Fallback: Check if local storage session exists
        const localUser = localStorage.getItem('stadium_current_user');
        const localToken = localStorage.getItem('stadium_token');
        if (localUser && localToken) {
          setUser(JSON.parse(localUser));
          setAccessToken(localToken);
          console.log('[Auth] Restored simulated session from LocalStorage');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const res = await response.json();
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } else {
        throw new Error('Failed to connect to backend api');
      }
    } catch (err) {
      // Standalone simulation fallback
      const res = await simulateApiCall(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'FAN' | 'VOLUNTEER' | 'STAFF',
    preferredLanguage: 'en' | 'es' | 'hi' = 'en'
  ) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, preferredLanguage }),
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        await response.json();
      } else {
        throw new Error('Failed to connect to backend api');
      }
    } catch (err) {
      // Standalone simulation fallback
      await simulateApiCall(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, preferredLanguage })
      });
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
    } catch (err) {
      // Standalone simulation fallback
      await simulateApiCall(`${API_BASE}/api/auth/logout`);
    }
    setAccessToken(null);
    setUser(null);
  };

  const updateProfile = async (name?: string, preferredLanguage?: 'en' | 'es' | 'hi') => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, preferredLanguage }),
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const res = await response.json();
        setUser(res.data.user);
      } else {
        throw new Error('Failed to connect to backend api');
      }
    } catch (err) {
      // Standalone simulation fallback
      const res = await simulateApiCall(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify({ name, preferredLanguage })
      });
      setUser(res.data.user);
    }
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

    try {
      const response = await fetch(requestUrl, { ...options, headers });
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
          const refreshResponse = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          const refreshContentType = refreshResponse.headers.get('content-type');
          if (refreshResponse.ok && refreshContentType && refreshContentType.includes('application/json')) {
            const refreshData = await refreshResponse.json();
            const newToken = refreshData.data.accessToken;
            setAccessToken(newToken);
            headers['Authorization'] = `Bearer ${newToken}`;
            
            const retriedResponse = await fetch(requestUrl, { ...options, headers });
            return await retriedResponse.json();
          } else {
            logout();
            throw new Error('Session expired. Please log in again.');
          }
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'API request failed');
        }
        return data;
      } else {
        throw new Error('Not JSON response from API server');
      }
    } catch (err) {
      // Standalone simulation fallback for data endpoints
      return await simulateApiCall(url, options);
    }
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
