import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext.js';

export interface SensorReading {
  id: number;
  sectionId: string;
  crowdCount: number;
  capacity: number;
  timestamp: string;
}

export interface Incident {
  id: number;
  type: string;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'RESOLVING' | 'RESOLVED';
  description: string;
  reporterName: string;
  createdAt: string;
}

export interface Alert {
  id: number;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  senderName: string;
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
      // Fetch latest alerts
      const alertsData = await apiFetch('/api/alerts');
      setAlerts(alertsData.data.alerts);
      if (alertsData.data.alerts.length > 0) {
        setLatestAlert(alertsData.data.alerts[0]);
      }

      // Fetch incidents if user is staff or volunteer
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
      // Disconnect socket if user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Initialize socket client
    const socketUrl = (import.meta as any).env?.VITE_API_URL || window.location.origin;
    const newSocket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
    });

    setSocket(newSocket);

    // Load initial database records via HTTP
    loadInitialData();

    // Listeners
    newSocket.on('connect', () => {
      console.log('[Socket] Connected to backend WS');
      // If staff/admin, join specialized rooms (can be extended)
      if (user.role === 'STAFF') {
        newSocket.emit('join_room', 'staff_operations');
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
      setAlerts(prev => [alert, ...prev].slice(0, 20)); // Limit to last 20
      setLatestAlert(alert);
    });

    newSocket.on('new_incident', (incident: Incident) => {
      setIncidents(prev => {
        // If incident already exists in list (updated status), replace it, otherwise prepend
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
