import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext.js';

export interface SensorReading {
  id: number;
  sectionId: string;
  crowdCount: number;
  capacity: number;
  timestamp: string;
}

export interface Alert {
  id: number;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  senderName: string;
  createdAt: string;
}

export interface Incident {
  id: number;
  type: string;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  reporterName: string;
  status: 'OPEN' | 'RESOLVING' | 'RESOLVED';
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  telemetry: Record<string, SensorReading>;
  alerts: Alert[];
  incidents: Incident[];
  latestAlert: Alert | null;
  addAlert: (alert: Alert) => void;
  loadInitialData: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

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

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, apiFetch } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [telemetry, setTelemetry] = useState<Record<string, SensorReading>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [latestAlert, setLatestAlert] = useState<Alert | null>(null);

  // Function to load historical/initial data through HTTP APIs
  const loadInitialData = async () => {
    if (!user) return;
    try {
      const alertsData = await apiFetch('/api/alerts');
      setAlerts(alertsData.data.alerts);
      if (alertsData.data.alerts.length > 0) {
        setLatestAlert(alertsData.data.alerts[0]);
      }

      if (user.role === 'STAFF' || user.role === 'VOLUNTEER') {
        const incidentsData = await apiFetch('/api/incidents');
        setIncidents(incidentsData.data.incidents);
      }
    } catch (err) {
      console.error('Failed to load initial socket data:', err);
    }
  };

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to WebSocket backend
    const socketUrl = (import.meta as any).env?.VITE_API_URL || window.location.origin;
    const newSocket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      timeout: 3000 // Quick timeout to switch to fallback simulation mode
    });

    setSocket(newSocket);
    loadInitialData();

    let localInterval: any = null;
    let cleanupFallback: (() => void) | null = null;

    // Browser-based telemetry simulation setup
    const runInBrowserSimulation = () => {
      console.log('[Socket Fallback] Initializing local client-side crowd simulator...');
      
      const initialReadings = getMockSensorReadings();
      const telemetryMap: Record<string, SensorReading> = {};
      initialReadings.forEach(r => {
        telemetryMap[r.sectionId] = {
          id: Date.now(),
          sectionId: r.sectionId,
          crowdCount: r.crowdCount,
          capacity: r.capacity,
          timestamp: new Date().toISOString()
        };
      });
      setTelemetry(telemetryMap);

      // Fluctuate crowd counts every 5 seconds to simulate dynamic heatmap colors
      localInterval = setInterval(() => {
        setTelemetry(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(sectionId => {
            const current = next[sectionId];
            const fluctuation = Math.floor(Math.random() * 200) - 90;
            let nextCount = current.crowdCount + fluctuation;
            if (nextCount > current.capacity) nextCount = Math.floor(current.capacity * 0.95);
            if (nextCount < 0) nextCount = 0;
            next[sectionId] = {
              ...current,
              crowdCount: nextCount,
              timestamp: new Date().toISOString()
            };
          });
          return next;
        });
      }, 5000);

      // Listen to window-level events for logs filed locally
      const handleNewAlertEvent = (e: Event) => {
        const alert = (e as CustomEvent).detail;
        setAlerts(prev => [alert, ...prev].slice(0, 20));
        setLatestAlert(alert);
      };

      const handleNewIncidentEvent = (e: Event) => {
        const incident = (e as CustomEvent).detail;
        setIncidents(prev => {
          const idx = prev.findIndex(i => i.id === incident.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = incident;
            return updated;
          }
          return [incident, ...prev];
        });
      };

      window.addEventListener('stadium_new_alert', handleNewAlertEvent);
      window.addEventListener('stadium_new_incident', handleNewIncidentEvent);

      return () => {
        if (localInterval) clearInterval(localInterval);
        window.removeEventListener('stadium_new_alert', handleNewAlertEvent);
        window.removeEventListener('stadium_new_incident', handleNewIncidentEvent);
      };
    };

    newSocket.on('connect', () => {
      console.log('[Socket] Connected to backend WS');
      if (user.role === 'STAFF') {
        newSocket.emit('join_room', 'staff_operations');
      }
    });

    newSocket.on('connect_error', () => {
      console.log('[Socket] Connection failed. Switching to stand-alone browser simulation mode.');
      newSocket.disconnect();
      setSocket(null);
      if (!cleanupFallback) {
        cleanupFallback = runInBrowserSimulation();
      }
    });

    newSocket.on('crowd_telemetry', (readings: SensorReading[]) => {
      setTelemetry(prev => {
        const next = { ...prev };
        readings.forEach(reading => {
          next[reading.sectionId] = reading;
        });
        return next;
      });
    });

    newSocket.on('new_alert', (alert: Alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 20));
      setLatestAlert(alert);
    });

    newSocket.on('new_incident', (incident: Incident) => {
      setIncidents(prev => {
        const existsIndex = prev.findIndex(inc => inc.id === incident.id);
        if (existsIndex >= 0) {
          const updated = [...prev];
          updated[existsIndex] = incident;
          return updated;
        }
        return [incident, ...prev];
      });
    });

    return () => {
      newSocket.disconnect();
      if (cleanupFallback) {
        cleanupFallback();
      }
      if (localInterval) {
        clearInterval(localInterval);
      }
    };
  }, [user]);

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
    setLatestAlert(alert);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        telemetry,
        alerts,
        incidents,
        latestAlert,
        addAlert,
        loadInitialData,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
