import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useSocket, SensorReading, Incident } from '../context/SocketContext.js';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { 
  Users, AlertTriangle, Radio, Send, Cpu, Loader, LogOut, ShieldCheck, 
  CheckCircle, Clock, PlusCircle, LayoutDashboard, AlertOctagon, User 
} from 'lucide-react';

interface StaffDashboardProps {
  onNavigate: (page: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onNavigate }) => {
  const { user, apiFetch, logout } = useAuth();
  const { telemetry, incidents, loadInitialData } = useSocket();

  const [activeView, setActiveView] = useState<'ops' | 'analytics' | 'incidents'>('ops');
  
  // Incident Form state
  const [incidentType, setIncidentType] = useState('CROWD_CONGESTION');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('MEDIUM');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [submittingIncident, setSubmittingIncident] = useState(false);
  const [incidentSuccess, setIncidentSuccess] = useState(false);
  const [incidentError, setIncidentError] = useState<string | null>(null);

  // Broadcast Alert form state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'INFO' | 'WARNING' | 'CRITICAL'>('WARNING');
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);

  // AI recommendations state
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Fetch AI operational recommendations
  const fetchAiRecommendations = async () => {
    setLoadingAi(true);
    try {
      const response = await apiFetch('/api/ai/recommendations');
      setAiRecommendations(response.data.recommendations);
    } catch (err) {
      console.error('Failed to fetch AI operational recommendations:', err);
      setAiRecommendations('❌ Unable to generate AI recommendations. Please check API connection.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Fetch Analytics stats
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const response = await apiFetch('/api/analytics');
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Failed to fetch analytics stats:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Auto-fetch recommendations on boot
  useEffect(() => {
    if (user && user.role === 'STAFF') {
      fetchAiRecommendations();
    }
  }, [user]);

  // Fetch analytics if view switches
  useEffect(() => {
    if (activeView === 'analytics' && user && user.role === 'STAFF') {
      fetchAnalytics();
    }
  }, [activeView]);

  // Submit Incident Logger
  const handleLogIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentLocation || !incidentDescription) {
      setIncidentError('Please fill in all incident details.');
      return;
    }

    setSubmittingIncident(true);
    setIncidentError(null);
    setIncidentSuccess(false);

    try {
      await apiFetch('/api/incidents', {
        method: 'POST',
        body: JSON.stringify({
          type: incidentType,
          location: incidentLocation,
          severity: incidentSeverity,
          description: incidentDescription
        })
      });
      setIncidentSuccess(true);
      setIncidentLocation('');
      setIncidentDescription('');
      setTimeout(() => setIncidentSuccess(false), 3000);
      loadInitialData(); // Reload incident list
    } catch (err: any) {
      setIncidentError(err.message || 'Failed to register incident.');
    } finally {
      setSubmittingIncident(false);
    }
  };

  // Broadcast Live Alert
  const handleBroadcastAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      setBroadcastError('Alert message cannot be blank.');
      return;
    }

    setBroadcasting(true);
    setBroadcastError(null);
    setBroadcastSuccess(false);

    try {
      await apiFetch('/api/alerts', {
        method: 'POST',
        body: JSON.stringify({
          message: broadcastMessage,
          severity: broadcastSeverity
        })
      });

      // Update local context alert state if needed (WS handles this mostly)
      setBroadcastSuccess(true);
      setBroadcastMessage('');
      setTimeout(() => setBroadcastSuccess(false), 3000);
    } catch (err: any) {
      setBroadcastError(err.message || 'Broadcast failed.');
    } finally {
      setBroadcasting(false);
    }
  };

  // Toggle incident status (Staff resolving controls)
  const handleUpdateIncidentStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'OPEN' ? 'RESOLVING' : 'RESOLVED';
    try {
      await apiFetch(`/api/incidents/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      loadInitialData(); // Refresh list
    } catch (err) {
      console.error('Failed to update incident status:', err);
    }
  };

  // Calculate global stadium statistics from live WebSocket state
  const sensorArray = Object.values(telemetry);
  const totalOccupancy = sensorArray.reduce((acc, curr) => acc + curr.crowdCount, 0);
  const totalCapacity = sensorArray.reduce((acc, curr) => acc + curr.capacity, 0);
  const averageDensityRatio = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;
  
  const congestedZonesCount = sensorArray.filter(s => (s.crowdCount / s.capacity) >= 0.80).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#101435] to-[#1a1440] text-white flex flex-col relative overflow-hidden font-sans">
      {/* 2-3 Ambient background color glows (Vercel/Stripe style blobs) */}
      <div className="absolute top-[-100px] left-[-50px] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] right-[-50px] w-[350px] h-[350px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Top glowing branded neon border bar */}
      <div className="bg-gradient-to-r from-emerald-400 via-violet-500 to-amber-500 h-[4px] w-full shrink-0 relative z-20 shadow-[0_1px_15px_rgba(139,92,246,0.3)]"></div>

      {/* Upper Navigation Navbar */}
      <header className="border-b border-slate-850 bg-gradient-to-r from-[#0d1527] to-[#121c33] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-gradient-to-br from-emerald-400 to-violet-500 border border-emerald-400/20 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-[0_0_12px_rgba(139,92,246,0.4)] animate-pulse-slow">IQ</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">StadiumIQ Ops</h1>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">FIFA 2026 STAFF OPERATIONS PORTAL</p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center bg-[#131a2c] p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('ops')}
            className={`py-1.5 px-3 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'ops' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Operations Centre</span>
          </button>
          <button
            onClick={() => setActiveView('incidents')}
            className={`py-1.5 px-3 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'incidents' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Incident Registry ({incidents.length})</span>
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`py-1.5 px-3 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'analytics' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Telemetry Charts</span>
          </button>
        </div>

        {/* User profile / Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold">{user?.name}</div>
            <div className="text-[10px] text-primary font-bold">STAFF COORDINATOR</div>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="p-2 bg-slate-800 border border-slate-700 hover:border-primary text-slate-300 rounded-md transition-colors"
            title="Profile Settings"
          >
            <User className="h-4 w-4" />
          </button>
          <button
            onClick={logout}
            className="p-2 bg-destructive/15 border border-destructive/20 hover:bg-destructive/25 text-destructive rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 overflow-hidden flex flex-col gap-6 relative z-10">
        
        {/* KPI Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
          <div className="bg-[#131a2c]/40 border border-emerald-500/25 p-4 rounded-lg flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-350">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Occupancy</p>
              <h3 className="text-2xl font-black mt-1 text-emerald-400">{totalOccupancy.toLocaleString()}</h3>
            </div>
            <Users className="h-8 w-8 text-emerald-400 opacity-60" />
          </div>

          <div className="bg-[#131a2c]/40 border border-[#3b82f6]/25 p-4 rounded-lg flex items-center justify-between shadow-[0_0_15px_rgba(59,130,246,0.05)] hover:border-[#3b82f6]/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-350">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mean Density</p>
              <h3 className="text-2xl font-black mt-1 text-blue-400">{Math.round(averageDensityRatio)}%</h3>
            </div>
            <Clock className="h-8 w-8 text-blue-400 opacity-60" />
          </div>

          <div className="bg-[#131a2c]/40 border border-amber-500/25 p-4 rounded-lg flex items-center justify-between shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-350">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Congested Gates</p>
              <h3 className="text-2xl font-black mt-1 text-amber-400">{congestedZonesCount} Zones</h3>
            </div>
            <AlertOctagon className="h-8 w-8 text-amber-400 opacity-60" />
          </div>

          <div className="bg-[#131a2c]/40 border border-destructive/25 p-4 rounded-lg flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:border-destructive/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all duration-350">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Incidents</p>
              <h3 className="text-2xl font-black mt-1 text-destructive">
                {incidents.filter(i => i.status !== 'RESOLVED').length} Cases
              </h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive opacity-60" />
          </div>
        </div>

        {/* Section View Routing */}
        {activeView === 'ops' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            
            {/* Telemetry Sensor Dashboard Heatmap (Left Column) */}
            <div className="glass-panel rounded-lg p-5 flex flex-col lg:col-span-2 overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="h-4 w-4 text-primary animate-pulse" />
                    Live Crowd Sensors Feed
                  </h2>
                  <p className="text-xs text-slate-400">WebSocket connection active. Data updates live every 5s.</p>
                </div>
              </div>

              {/* Heatmap Grid Panel */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {sensorArray.length > 0 ? (
                    sensorArray.map((reading: SensorReading) => {
                      const ratio = reading.crowdCount / reading.capacity;
                      let bgTheme = 'bg-slate-900 border-slate-800';
                      let barTheme = 'bg-primary';
                      let textTheme = 'text-primary';

                      if (ratio >= 0.8) {
                        bgTheme = 'bg-destructive/10 border-destructive/25';
                        barTheme = 'bg-destructive';
                        textTheme = 'text-destructive';
                      } else if (ratio >= 0.6) {
                        bgTheme = 'bg-accent/10 border-accent/25';
                        barTheme = 'bg-accent';
                        textTheme = 'text-accent';
                      }

                      return (
                        <div key={reading.id} className={`p-3.5 border rounded-lg flex flex-col justify-between h-28 transition-colors ${bgTheme}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                              {reading.sectionId.replace('_', ' ')}
                            </span>
                            <span className={`text-[10px] font-extrabold ${textTheme}`}>
                              {Math.round(ratio * 100)}%
                            </span>
                          </div>
                          
                          <div>
                            <div className="text-lg font-black text-white leading-none">
                              {reading.crowdCount.toLocaleString()}
                            </div>
                            <div className="text-[9px] text-slate-500 mt-1">
                              Max Capacity: {reading.capacity.toLocaleString()}
                            </div>
                          </div>

                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                            <div 
                              className={`h-full transition-all duration-1000 ${barTheme}`} 
                              style={{ width: `${Math.min(100, ratio * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-4 p-8 text-center text-slate-400 text-xs">
                      Connecting to crowd telemetry network...
                    </div>
                  )}
                </div>

                {/* Live Alert Broadcaster Console */}
                <div className="bg-[#0e1627] border border-slate-800 rounded-lg p-5 mt-6 shrink-0">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                    <Send className="h-4 w-4 text-primary" />
                    Broadcasting Center
                  </h3>
                  
                  {broadcastSuccess && (
                    <div className="mb-4 p-3 bg-primary/10 border border-primary/20 text-primary text-xs rounded">
                      ✓ Broadcast alert successfully dispatched via WebSockets!
                    </div>
                  )}
                  {broadcastError && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded">
                      🚨 {broadcastError}
                    </div>
                  )}

                  <form onSubmit={handleBroadcastAlert} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-3">
                      <input
                        type="text"
                        required
                        value={broadcastMessage}
                        onChange={e => setBroadcastMessage(e.target.value)}
                        placeholder="Write alert message (e.g. 'Gate 5 congested, redirect to Gate 12')..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      
                      <div className="flex gap-2 shrink-0">
                        <select
                          value={broadcastSeverity}
                          onChange={e => setBroadcastSeverity(e.target.value as any)}
                          className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white cursor-pointer focus:outline-none"
                        >
                          <option value="INFO">Info</option>
                          <option value="WARNING">Warning</option>
                          <option value="CRITICAL">Emergency</option>
                        </select>

                        <button
                          type="submit"
                          disabled={broadcasting || !broadcastMessage.trim()}
                          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {broadcasting ? <Loader className="h-3 w-3 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                          <span>Publish</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* AI Operational Intelligence Recommendations (Right Column) */}
            <div className="glass-panel rounded-lg p-5 flex flex-col overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold uppercase tracking-wider">StadiumIQ GenAI Ops</h2>
                </div>
                <button
                  onClick={fetchAiRecommendations}
                  disabled={loadingAi}
                  className="p-1 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded text-[10px] font-bold transition-colors disabled:opacity-50"
                >
                  {loadingAi ? 'Analyzing...' : 'Re-Analyze'}
                </button>
              </div>

              {/* Recommendation Response panel */}
              <div className="flex-1 overflow-y-auto bg-slate-900/40 border border-slate-850/80 rounded p-4 text-xs leading-relaxed text-slate-300">
                {loadingAi ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                    <Loader className="h-6 w-6 animate-spin text-primary" />
                    <span>Evaluating current crowd densities & running operations heuristics models...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none space-y-4">
                    {/* Render recommendation parsed markdown blocks */}
                    {aiRecommendations.split('\n\n').map((block, index) => {
                      if (block.startsWith('###')) {
                        return <h3 key={index} className="text-sm font-bold text-white border-b border-slate-800 pb-1.5">{block.replace('###', '')}</h3>;
                      }
                      if (block.startsWith('•') || block.startsWith('*')) {
                        return (
                          <ul key={index} className="space-y-1.5 pl-4 list-disc">
                            {block.split('\n').map((item, idx) => (
                              <li key={idx}>{item.replace(/^[•*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={index}>{block.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* View Router: Incident board & Logging form */}
        {activeView === 'incidents' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            
            {/* Incidents Board list */}
            <div className="glass-panel rounded-lg p-5 flex flex-col lg:col-span-2 overflow-hidden border border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-3 shrink-0">
                Logged Incidents Registry
              </h2>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {incidents.length > 0 ? (
                  incidents.map((inc: Incident) => (
                    <div key={inc.id} className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-lg flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                            inc.severity === 'CRITICAL' 
                              ? 'bg-destructive/10 border-destructive/20 text-destructive' 
                              : inc.severity === 'HIGH' 
                                ? 'bg-accent/10 border-accent/20 text-accent' 
                                : 'bg-secondary/10 border-secondary/20 text-secondary'
                          }`}>
                            {inc.severity}
                          </span>
                          <span className="text-xs font-bold text-white uppercase">{inc.type.replace('_', ' ')}</span>
                          <span className="text-slate-500 text-[10px]">• at {inc.location}</span>
                        </div>
                        <p className="text-xs text-slate-300">{inc.description}</p>
                        <div className="text-[10px] text-slate-500 flex gap-2">
                          <span>Reported by: {inc.reporterName}</span>
                          <span>•</span>
                          <span>{new Date(inc.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center">
                        <button
                          onClick={() => handleUpdateIncidentStatus(inc.id, inc.status)}
                          disabled={inc.status === 'RESOLVED'}
                          className={`text-xs font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 border ${
                            inc.status === 'RESOLVED'
                              ? 'bg-primary/10 border-primary/20 text-primary cursor-not-allowed'
                              : inc.status === 'RESOLVING'
                                ? 'bg-accent/15 border-accent/25 text-accent hover:bg-accent/25'
                                : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-white'
                          }`}
                        >
                          {inc.status === 'RESOLVED' ? (
                            <>
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Resolved</span>
                            </>
                          ) : inc.status === 'RESOLVING' ? (
                            <>
                              <Clock className="h-3.5 w-3.5 animate-spin" />
                              <span>Mark Resolved</span>
                            </>
                          ) : (
                            <span>Acknowledge</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-slate-400 text-xs">
                    No incidents logged currently. Stadium grounds secure.
                  </div>
                )}
              </div>
            </div>

            {/* Log Incident Form */}
            <div className="glass-panel rounded-lg p-5 flex flex-col overflow-hidden border border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-3 shrink-0 flex items-center gap-1.5">
                <PlusCircle className="h-5 w-5 text-primary" />
                Log Security/Ops Incident
              </h2>

              {incidentSuccess && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 text-primary text-xs rounded shrink-0">
                  ✓ Incident logged and broadcasted to dispatch teams!
                </div>
              )}
              {incidentError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded shrink-0">
                  🚨 {incidentError}
                </div>
              )}

              <form onSubmit={handleLogIncident} className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Incident Category
                  </label>
                  <select
                    value={incidentType}
                    onChange={e => setIncidentType(e.target.value)}
                    className="w-full bg-[#131a2c] border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="CROWD_CONGESTION">Crowd Congestion</option>
                    <option value="MEDICAL">Medical Emergency</option>
                    <option value="SECURITY">Security Alert</option>
                    <option value="FACILITY_ISSUE">Facility/Hardware Issue</option>
                    <option value="OTHER">Other Issues</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Severity Scale
                    </label>
                    <select
                      value={incidentSeverity}
                      onChange={e => setIncidentSeverity(e.target.value)}
                      className="w-full bg-[#131a2c] border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Zone/Location
                    </label>
                    <input
                      type="text"
                      required
                      value={incidentLocation}
                      onChange={e => setIncidentLocation(e.target.value)}
                      placeholder="e.g. Gate 3 concourse"
                      className="w-full bg-[#131a2c] border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={incidentDescription}
                    onChange={e => setIncidentDescription(e.target.value)}
                    placeholder="Provide incident details (e.g. crowd queue at Gate 3 food stand blocking evacuation corridor)..."
                    className="w-full bg-[#131a2c] border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none placeholder-slate-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingIncident}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded transition-colors text-xs flex items-center justify-center gap-2"
                >
                  {submittingIncident ? <Loader className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  <span>File Official Report</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* View Router: Recharts Analytics charts */}
        {activeView === 'analytics' && (
          <div className="flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto">
            
            {loadingAnalytics ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-16">
                <Loader className="h-6 w-6 animate-spin text-primary" />
                <span>Aggregating sensor signals and database stats...</span>
              </div>
            ) : analyticsData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                
                {/* Wait times Chart */}
                <div className="glass-panel p-5 rounded-lg border border-slate-800 flex flex-col h-96">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                    Average Transit Gate Wait Times (Minutes)
                  </h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData.waitTimesTimeSeries}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorGate5" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorGate3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d1527', border: '1px solid #1e293b', fontSize: 10 }} />
                        <Area type="monotone" dataKey="gate5" name="Gate 5 (Peak)" stroke="#ef4444" fillOpacity={1} fill="url(#colorGate5)" />
                        <Area type="monotone" dataKey="gate3" name="Gate 3 (Avg)" stroke="#10b981" fillOpacity={1} fill="url(#colorGate3)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Incident distribution Chart */}
                <div className="glass-panel p-5 rounded-lg border border-slate-800 flex flex-col h-96">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                    Hourly Incident Reports by Category
                  </h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.incidentsTimeSeries}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d1527', border: '1px solid #1e293b', fontSize: 10 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="crowd" name="Crowd Congestion" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="medical" name="Medical Case" fill="#ef4444" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="security" name="Security Issue" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center p-8 text-slate-400 text-xs">
                Failed to resolve analytics dashboard. Please check database tables.
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};
