import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { SocketProvider } from './context/SocketContext.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { Profile } from './pages/Profile.js';
import { FanDashboard } from './pages/FanDashboard.js';
import { StaffDashboard } from './pages/StaffDashboard.js';
import { About } from './pages/About.js';
import { Features } from './pages/Features.js';
import { FAQ } from './pages/FAQ.js';
import { Contact } from './pages/Contact.js';
import { Loader2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<string>('login');

  // Sync route page state with auth session changes and popstate browser history
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path === '/about') {
        setPage('about');
      } else if (path === '/features') {
        setPage('features');
      } else if (path === '/faq') {
        setPage('faq');
      } else if (path === '/contact') {
        setPage('contact');
      } else if (path === '/register') {
        setPage('register');
      } else if (!loading) {
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
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400">Loading StadiumIQ...</h2>
      </div>
    );
  }

  // Public/Static pages routing (accessible to everyone)
  const handleBackToDashboard = () => {
    if (user) {
      setPage(user.role === 'STAFF' || user.role === 'VOLUNTEER' ? 'staff' : 'fan');
    } else {
      setPage('login');
    }
  };

  if (page === 'about') {
    return <About onBack={handleBackToDashboard} />;
  }
  if (page === 'features') {
    return <Features onBack={handleBackToDashboard} />;
  }
  if (page === 'faq') {
    return <FAQ onBack={handleBackToDashboard} />;
  }
  if (page === 'contact') {
    return <Contact onBack={handleBackToDashboard} />;
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
