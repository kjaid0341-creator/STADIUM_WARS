import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { SocketProvider } from './context/SocketContext.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { Profile } from './pages/Profile.js';
import { FanDashboard } from './pages/FanDashboard.js';
import { StaffDashboard } from './pages/StaffDashboard.js';
import { Loader2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<string>('login');

  // Sync route page state with auth session changes
  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'STAFF' || user.role === 'VOLUNTEER') {
          setPage('staff');
        } else {
          setPage('fan');
        }
      } else {
        setPage('login');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400">Loading StadiumIQ...</h2>
      </div>
    );
  }

  // Auth Guards & Guest Routing
  if (!user) {
    if (page === 'register') {
      return <Register onNavigate={setPage} />;
    }
    return <Login onNavigate={setPage} />;
  }

  // Authenticated Routing
  switch (page) {
    case 'profile':
      return <Profile onBack={() => setPage(user.role === 'STAFF' || user.role === 'VOLUNTEER' ? 'staff' : 'fan')} />;
    case 'staff':
      if (user.role === 'STAFF' || user.role === 'VOLUNTEER') {
        return <StaffDashboard onNavigate={setPage} />;
      }
      return <FanDashboard onNavigate={setPage} />; // Guard
    case 'fan':
    default:
      return <FanDashboard onNavigate={setPage} />;
  }
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainAppContent />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
