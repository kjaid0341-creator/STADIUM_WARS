import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useSocket } from '../context/SocketContext.js';
import { MapPin, MessageSquare, Send, Languages, Ticket, User, AlertTriangle, Info, Navigation2, Accessibility, HelpCircle } from 'lucide-react';

interface FanDashboardProps {
  onNavigate: (page: string) => void;
}

export const FanDashboard: React.FC<FanDashboardProps> = ({ onNavigate }) => {
  const { user, apiFetch, updateProfile } = useAuth();
  const { telemetry, latestAlert } = useSocket();

  const [activeTab, setActiveTab] = useState<'map' | 'chat' | 'ticket'>('map');
  const [chatLanguage, setChatLanguage] = useState<'en' | 'es' | 'hi'>(user?.preferredLanguage || 'en');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedMapSection, setSelectedMapSection] = useState<string | null>(null);
  
  // Custom interactive ticket routing path
  const [highlightedPath, setHighlightedPath] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync preferred language from profile
  useEffect(() => {
    if (user?.preferredLanguage) {
      setChatLanguage(user.preferredLanguage);
    }
  }, [user?.preferredLanguage]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message translation map
  const welcomeMessages = {
    en: "Welcome to FIFA World Cup 2026! I'm StadiumIQ, your AI Assistant. Ask me about gates, restrooms, food courts, or wayfinding.",
    es: "¡Bienvenido al Mundial FIFA 2026! Soy StadiumIQ, su asistente de IA. Pregúnteme sobre puertas, baños, comida o cómo llegar a su asiento.",
    hi: "फीफा विश्व कप 2026 में आपका स्वागत है! मैं StadiumIQ हूँ, आपका एआई सहायक। मुझसे गेट, शौचालय, फूड कोर्ट या मार्ग दर्शन के बारे में पूछें।"
  };

  // Set initial welcome message
  useEffect(() => {
    setMessages([
      { sender: 'ai', text: welcomeMessages[chatLanguage] }
    ]);
  }, [chatLanguage]);

  const handleLanguageChange = async (lang: 'en' | 'es' | 'hi') => {
    setChatLanguage(lang);
    try {
      await updateProfile(user?.name, lang);
    } catch (err) {
      console.error('Failed to sync language preference to server:', err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInputMessage('');
    
    setChatLoading(true);
    try {
      const response = await apiFetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ query, language: chatLanguage })
      });
      
      setMessages(prev => [...prev, { sender: 'ai', text: response.data.response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { sender: 'ai', text: `Sorry, there was an error processing your query: ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Pre-configured helper query buttons
  const suggestedQueries = {
    en: [
      { text: "Where is the nearest wheelchair restroom?", label: "Restroom" },
      { text: "How do I get to Gate 12 from public transit?", label: "Gate 12 Route" },
      { text: "Where are the food courts located?", label: "Food Courts" }
    ],
    es: [
      { text: "¿Dónde está el baño accesible más cercano?", label: "Baño Accesible" },
      { text: "¿Cómo llego a la Puerta 12?", label: "Ruta Puerta 12" },
      { text: "¿Dónde están los puestos de comida?", label: "Comida" }
    ],
    hi: [
      { text: "निकटतम व्हीलचेयर शौचालय कहाँ है?", label: "सुलभ शौचालय" },
      { text: "गेट 12 पर कैसे जाएँ?", label: "गेट 12 मार्ग" },
      { text: "फूड कोर्ट कहाँ हैं?", label: "भोजन क्षेत्र" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#101435] to-[#1a1440] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* 2-3 Ambient background color glows (Vercel/Stripe style blobs) */}
      <div className="absolute top-[-100px] left-[-50px] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] right-[-50px] w-[350px] h-[350px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-secondary/5 to-transparent pointer-events-none z-0"></div>
      
      {/* Top glowing branded neon border bar (emerald to violet to amber) */}
      <div className="bg-gradient-to-r from-emerald-400 via-violet-500 to-amber-500 h-[4px] w-full shrink-0 relative z-20 shadow-[0_1px_15px_rgba(139,92,246,0.3)]"></div>

      {/* Real-time Alert Banner via WebSocket */}
      {latestAlert && (
        <div className={`py-2 px-4 flex items-center justify-between text-xs font-semibold tracking-wide transition-all duration-300 relative z-20 ${
          latestAlert.severity === 'CRITICAL' 
            ? 'bg-destructive text-white animate-pulse' 
            : latestAlert.severity === 'WARNING' 
              ? 'bg-accent text-black' 
              : 'bg-secondary text-white'
        }`}>
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
            {latestAlert.severity === 'CRITICAL' ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <Info className="h-4 w-4 shrink-0" />}
            <span className="uppercase text-[10px] bg-black/20 px-1.5 py-0.5 rounded mr-1">Alert</span>
            <span className="scroll-marquee">{latestAlert.message}</span>
          </div>
          <span className="text-[10px] opacity-75 shrink-0 ml-2">Pushed Live</span>
        </div>
      )}

      {/* Main Header */}
      <header className="border-b border-slate-850 bg-gradient-to-r from-[#0d1527] to-[#121c33] px-6 py-4 flex items-center justify-between relative z-15 shadow-md">
        <div className="flex items-center gap-2">
          {/* Logo badge with emerald-to-violet gradient and soft glow */}
          <div className="h-9 w-9 bg-gradient-to-br from-emerald-400 to-violet-500 border border-emerald-400/20 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-[0_0_12px_rgba(139,92,246,0.4)] animate-pulse-slow">
            IQ
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">StadiumIQ</h1>
            <p className="text-xs uppercase tracking-widest text-white/50 font-bold">FIFA 2026 FAN PORTAL</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-[#131a2c]/80 px-3 py-1.5 rounded-md border border-slate-800 text-xs text-slate-300 shadow-inner">
            <Languages className="h-3.5 w-3.5 text-primary" />
            <select
              value={chatLanguage}
              onChange={e => handleLanguageChange(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer font-bold text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate('profile')}
            className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-primary hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 ease-out"
          >
            <User className="h-5 w-5 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden relative z-10">
        
        {/* Navigation Tabs Container */}
        <div className="md:col-span-2 flex flex-col gap-4 h-[550px] md:h-[650px]">
          <nav className="flex bg-white/5 p-1 rounded-full border border-white/10 shrink-0 shadow-lg relative z-10">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all duration-300 ease-out flex items-center justify-center gap-2 ${
                activeTab === 'map' 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/35 hover:scale-[1.02]' 
                  : 'text-slate-450 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Stadium Map</span>
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all duration-300 ease-out flex items-center justify-center gap-2 ${
                activeTab === 'ticket' 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/35 hover:scale-[1.02]' 
                  : 'text-slate-450 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span>My Ticket</span>
            </button>
          </nav>

          {/* Tab Views Card with glowing border effect */}
          <div className="flex-1 bg-gradient-to-br from-white/15 to-transparent p-[1px] rounded-2xl shadow-2xl relative">
            <div className="w-full h-full backdrop-blur-xl bg-[#111827]/85 p-6 md:p-8 rounded-2xl overflow-hidden relative flex flex-col transition-all duration-300">
              
              {/* Interactive Stadium Map */}
              {activeTab === 'map' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-2">
                    <div>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Stadium Level 1 Wayfinding</h2>
                      <p className="text-xs text-slate-400">Click highlighted zones to view real-time density statistics.</p>
                    </div>
                    {highlightedPath && (
                      <button 
                        onClick={() => setHighlightedPath(false)}
                        className="text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded hover:bg-primary/20 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                      >
                        Clear Seat Route
                      </button>
                    )}
                  </div>

                  {/* SVG interactive layout with custom gradients */}
                  <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <svg viewBox="0 0 500 500" className="w-full max-w-[340px] h-auto relative z-10">
                      
                      {/* Outer boundaries */}
                      <circle cx="250" cy="250" r="220" fill="none" stroke="#334155" strokeWidth="4" />
                      <circle cx="250" cy="250" r="170" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
                      
                      {/* Pitch green area */}
                      <rect x="180" y="200" width="140" height="100" rx="10" fill="#047857" opacity="0.3" stroke="#059669" strokeWidth="2" />
                      <line x1="250" y1="200" x2="250" y2="300" stroke="#059669" strokeWidth="1.5" />
                      <circle cx="250" cy="250" r="25" fill="none" stroke="#059669" strokeWidth="1.5" />

                      {/* Sensor zones / gates (interactive) */}
                      
                      {/* Gate 3 (North) - Low Density */}
                      <path
                        d="M 210 50 A 205 205 0 0 1 290 50 L 280 80 A 175 175 0 0 0 220 80 Z"
                        fill={selectedMapSection === 'GATE_3' ? 'url(#grad-green)' : 'url(#grad-dark)'}
                        opacity={selectedMapSection === 'GATE_3' ? 0.95 : 0.55}
                        stroke={selectedMapSection === 'GATE_3' ? '#10b981' : '#475569'}
                        strokeWidth="2"
                        className={`cursor-pointer hover:opacity-85 transition-all duration-300 ease-out ${
                          selectedMapSection === 'GATE_3' ? 'animate-pulse stroke-emerald-400 stroke-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]' : ''
                        }`}
                        onClick={() => setSelectedMapSection('GATE_3')}
                      />
                      <text x="250" y="42" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">GATE 3</text>

                      {/* Gate 5 (West) - Simulated High Density (Rose) */}
                      <path
                        d="M 50 210 A 205 205 0 0 0 50 290 L 80 280 A 175 175 0 0 1 80 220 Z"
                        fill={selectedMapSection === 'GATE_5' ? 'url(#grad-rose)' : 'url(#grad-dark)'}
                        opacity={selectedMapSection === 'GATE_5' ? 0.95 : 0.55}
                        stroke={selectedMapSection === 'GATE_5' ? '#f43f5e' : '#475569'}
                        strokeWidth="2"
                        className={`cursor-pointer hover:opacity-85 transition-all duration-300 ease-out ${
                          selectedMapSection === 'GATE_5' ? 'animate-pulse stroke-rose-500 stroke-2 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]' : ''
                        }`}
                        onClick={() => setSelectedMapSection('GATE_5')}
                      />
                      <text x="35" y="254" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 35 254)">GATE 5</text>

                      {/* Gate 12 (East) - Low Density */}
                      <path
                        d="M 450 210 A 205 205 0 0 1 450 290 L 420 280 A 175 175 0 0 0 420 220 Z"
                        fill={selectedMapSection === 'GATE_12' ? 'url(#grad-green)' : 'url(#grad-dark)'}
                        opacity={selectedMapSection === 'GATE_12' ? 0.95 : 0.55}
                        stroke={selectedMapSection === 'GATE_12' ? '#10b981' : '#475569'}
                        strokeWidth="2"
                        className={`cursor-pointer hover:opacity-85 transition-all duration-300 ease-out ${
                          selectedMapSection === 'GATE_12' ? 'animate-pulse stroke-emerald-400 stroke-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]' : ''
                        }`}
                        onClick={() => setSelectedMapSection('GATE_12')}
                      />
                      <text x="465" y="254" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(90 465 254)">GATE 12</text>

                      {/* Section 104 (Bottom North) - Medium Density (Amber) */}
                      <path
                        d="M 120 150 A 180 180 0 0 1 200 90 L 210 120 A 150 150 0 0 0 140 170 Z"
                        fill={selectedMapSection === 'SECTION_104' ? 'url(#grad-amber)' : 'url(#grad-dark)'}
                        opacity={selectedMapSection === 'SECTION_104' ? 0.95 : 0.55}
                        stroke={selectedMapSection === 'SECTION_104' ? '#f59e0b' : '#475569'}
                        strokeWidth="2"
                        className={`cursor-pointer hover:opacity-85 transition-all duration-300 ease-out ${
                          selectedMapSection === 'SECTION_104' ? 'animate-pulse stroke-amber-400 stroke-2 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]' : ''
                        }`}
                        onClick={() => setSelectedMapSection('SECTION_104')}
                      />
                      <text x="160" y="128" fill="#94a3b8" fontSize="8" textAnchor="middle">SEC 104</text>

                      {/* Section 102 - Low Density */}
                      <path
                        d="M 300 90 A 180 180 0 0 1 380 150 L 360 170 A 150 150 0 0 0 290 120 Z"
                        fill={selectedMapSection === 'SECTION_102' ? 'url(#grad-green)' : 'url(#grad-dark)'}
                        opacity={selectedMapSection === 'SECTION_102' ? 0.95 : 0.55}
                        stroke={selectedMapSection === 'SECTION_102' ? '#10b981' : '#475569'}
                        strokeWidth="2"
                        className={`cursor-pointer hover:opacity-85 transition-all duration-300 ease-out ${
                          selectedMapSection === 'SECTION_102' ? 'animate-pulse stroke-emerald-400 stroke-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]' : ''
                        }`}
                        onClick={() => setSelectedMapSection('SECTION_102')}
                      />
                      <text x="340" y="128" fill="#94a3b8" fontSize="8" textAnchor="middle">SEC 102</text>

                      {/* Section 206 (South) - Low Density */}
                      <path
                        d="M 210 420 A 180 180 0 0 1 290 420 L 280 390 A 150 150 0 0 0 220 390 Z"
                        fill={selectedMapSection === 'SECTION_206' ? 'url(#grad-green)' : 'url(#grad-dark)'}
                        opacity={selectedMapSection === 'SECTION_206' ? 0.95 : 0.55}
                        stroke={selectedMapSection === 'SECTION_206' ? '#10b981' : '#475569'}
                        strokeWidth="2"
                        className={`cursor-pointer hover:opacity-85 transition-all duration-300 ease-out ${
                          selectedMapSection === 'SECTION_206' ? 'animate-pulse stroke-emerald-400 stroke-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]' : ''
                        }`}
                        onClick={() => setSelectedMapSection('SECTION_206')}
                      />
                      <text x="250" y="410" fill="#94a3b8" fontSize="8" textAnchor="middle">SEC 206</text>

                      {/* Ticket Route Highlight Path */}
                      {highlightedPath && (
                        <path
                          d="M 70 250 Q 150 250 185 160" // Path from Gate 5 to Sec 104
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="5"
                          strokeDasharray="6,4"
                          markerEnd="url(#arrow)"
                          className="animate-pulse"
                        />
                      )}

                      {/* Defs block hosting SVG markers and rich gradient fills */}
                      <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                        </marker>

                        <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fb7185" />
                          <stop offset="100%" stopColor="#e11d48" />
                        </linearGradient>
                        <linearGradient id="grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Density Color Legend using Pill Badges */}
                    <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] font-bold shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        <span>Low Density (&lt;60%)</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.08)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                        <span>Medium (60%-80%)</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-450 shadow-[0_0_10px_rgba(244,63,94,0.08)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                        <span>High Density (&gt;80%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Section Stats Panel (Status Bar Upgrade with Progress indicators) */}
                  <div className="bg-slate-950/60 border border-slate-800/85 rounded-xl p-4 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 shrink-0 transition-all duration-300">
                    {selectedMapSection ? (
                      <>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider">Selected Zone</span>
                          <span className="font-bold text-white text-sm flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary animate-pulse" />
                            {selectedMapSection.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold">Live Volume</span>
                            <span className="font-bold text-white text-sm">
                              {telemetry[selectedMapSection]?.crowdCount?.toLocaleString() || 'Calculating...'}
                            </span>
                          </div>

                          <div className="flex-1 sm:flex-initial flex flex-col gap-1.5 min-w-[140px]">
                            <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-semibold">
                              <span className="text-slate-400">Capacity Density</span>
                              <span className={`font-bold ${
                                (() => {
                                  const item = telemetry[selectedMapSection];
                                  if (!item) return 'text-slate-400';
                                  const ratio = item.crowdCount / item.capacity;
                                  if (ratio >= 0.8) return 'text-rose-400';
                                  if (ratio >= 0.6) return 'text-amber-400';
                                  return 'text-emerald-400';
                                })()
                              }`}>
                                {(() => {
                                  const item = telemetry[selectedMapSection];
                                  if (!item) return '0%';
                                  return `${Math.round((item.crowdCount / item.capacity) * 100)}%`;
                                })()}
                              </span>
                            </div>
                            {/* Custom Horizontal Progress Bar */}
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                              <div 
                                className={`h-full rounded-full transition-all duration-550 ease-out ${
                                  (() => {
                                    const item = telemetry[selectedMapSection];
                                    if (!item) return 'bg-slate-700';
                                    const ratio = item.crowdCount / item.capacity;
                                    if (ratio >= 0.8) return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
                                    if (ratio >= 0.6) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
                                    return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
                                  })()
                                }`}
                                style={{
                                  width: (() => {
                                    const item = telemetry[selectedMapSection];
                                    if (!item) return '0%';
                                    const percent = Math.min(100, Math.round((item.crowdCount / item.capacity) * 100));
                                    return `${percent}%`;
                                  })()
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-400 text-center w-full font-medium py-1">💡 Click any zone on the stadium map above to query live crowd counts.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Mock ticket details & route planner */}
              {activeTab === 'ticket' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-slate-800/80 pb-2">Your FIFA World Cup 2026 Ticket</h2>
                    
                    {/* Premium Ticket layout with low-opacity violet/sky gradients */}
                    <div className="bg-gradient-to-br from-violet-600/15 via-sky-600/15 to-slate-900/40 backdrop-blur-sm border border-violet-500/25 rounded-2xl p-6 flex justify-between items-center relative overflow-hidden mt-4 shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:border-violet-500/40 transition-all duration-300">
                      {/* Decorative FIFA details */}
                      <div className="absolute right-0 top-0 bottom-0 w-24 bg-primary/10 flex items-center justify-center opacity-30">
                        <Ticket className="h-16 w-16 text-violet-400 rotate-12 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
                      </div>

                      <div className="space-y-4 z-10 w-full">
                        <div>
                          <span className="text-[10px] text-violet-300 font-bold uppercase tracking-wider bg-violet-500/20 px-2.5 py-1 rounded-full border border-violet-500/30">FIFA Match 18</span>
                          <h3 className="font-bold text-xl leading-tight mt-3 text-white">USA vs Colombia</h3>
                          <p className="text-xs text-slate-405 mt-0.5">CenturyLink Arena • July 9, 2026</p>
                        </div>
                        
                        {/* Section Row Seat Stat Blocks */}
                        <div className="grid grid-cols-3 gap-3 pt-1">
                          <div className="bg-violet-500/10 border border-violet-500/20 px-3 py-2 rounded-xl text-center shadow-inner">
                            <div className="text-[9px] text-violet-300 font-bold uppercase tracking-wider">Section</div>
                            <div className="font-extrabold text-white text-base mt-0.5">104</div>
                          </div>
                          <div className="bg-sky-500/10 border border-sky-500/20 px-3 py-2 rounded-xl text-center shadow-inner">
                            <div className="text-[9px] text-sky-300 font-bold uppercase tracking-wider">Row</div>
                            <div className="font-extrabold text-white text-base mt-0.5">G</div>
                          </div>
                          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-center shadow-inner">
                            <div className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider">Seat</div>
                            <div className="font-extrabold text-white text-base mt-0.5">18</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Styled Transit sections with left border color markers */}
                    <div className="mt-6 space-y-3">
                      <h4 className="text-xs font-bold uppercase text-slate-300">Smart Transit & Arrival</h4>
                      <ul className="text-xs text-slate-400 space-y-2.5">
                        <li className="flex items-start gap-3 p-3 bg-sky-500/5 border-l-4 border-sky-400 rounded-r-lg">
                          <Accessibility className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                          <span>**Accessible Route**: Escalators are located at West concourse. Lift access is near Section 102.</span>
                        </li>
                        <li className="flex items-start gap-3 p-3 bg-amber-500/5 border-l-4 border-amber-400 rounded-r-lg">
                          <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>**Entrance Guideline**: Enter via **Gate 5** (closest to Premium Lot).</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('map');
                      setHighlightedPath(true);
                      setSelectedMapSection('SECTION_104');
                    }}
                    className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 mt-4"
                  >
                    <Navigation2 className="h-5 w-5 fill-white" />
                    <span>Route from entrance to Seat (104-G-18)</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* AI Assistant Chat Widget wrapper */}
        <div className="bg-gradient-to-br from-white/10 to-transparent p-[1px] rounded-2xl shadow-2xl">
          <div className="w-full h-full backdrop-blur-xl bg-[#111827]/85 rounded-2xl flex flex-col h-[550px] md:h-[650px] overflow-hidden transition-all duration-300">
            <div className="bg-[#0d1527]/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-violet-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">StadiumIQ Assistant</h3>
                  <span className="text-[10px] text-violet-400 flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                    </span>
                    <span>AI Live & Translate</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Stream with responsive padding */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed transition-all duration-200 ${
                    msg.sender === 'user'
                      ? 'bg-secondary text-white ml-auto rounded-tr-none'
                      : index === 0 
                        ? 'bg-gradient-to-r from-emerald-500/5 via-violet-500/5 to-transparent border-l-4 border-emerald-400 rounded-r-lg border-y border-r border-white/5 shadow-md text-slate-200 rounded-tl-none'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="bg-slate-900/80 border border-slate-800 text-slate-200 rounded-lg rounded-tl-none p-3 text-xs max-w-[85%] flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce"></span>
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                  <span className="text-slate-400">AI is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Queries with custom pill buttons */}
            <div className="p-4 bg-slate-950/40 border-t border-slate-850 shrink-0 space-y-2.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wide flex items-center gap-1">
                <HelpCircle className="h-3 w-3 text-primary" />
                Suggested Multilingual Qs
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQueries[chatLanguage]?.map((sq, i) => {
                  const colors = [
                    'bg-sky-500/10 border-sky-500/20 text-sky-300 hover:bg-sky-500/20 shadow-sm shadow-sky-500/5',
                    'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20 shadow-sm shadow-amber-500/5',
                    'bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/20 shadow-sm shadow-violet-500/5'
                  ];
                  const themeClass = colors[i % colors.length];
                  return (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sq.text)}
                      disabled={chatLoading}
                      className={`text-[10px] font-semibold px-4 py-2 rounded-full border transition-all duration-200 ease-out hover:scale-105 cursor-pointer ${themeClass}`}
                    >
                      {sq.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Send Input area */}
            <div className="p-4 bg-[#0d1527]/90 border-t border-slate-850 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  disabled={chatLoading}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                  placeholder={
                    chatLanguage === 'es'
                      ? 'Pregunte sobre el estadio...'
                      : chatLanguage === 'hi'
                        ? 'स्टेडियम के बारे में पूछें...'
                        : 'Ask about the stadium...'
                  }
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={chatLoading || !inputMessage.trim()}
                  className="bg-primary hover:bg-primary-hover text-white p-2 rounded transition-colors shrink-0 disabled:opacity-55 disabled:cursor-not-allowed hover:scale-105 duration-150 ease-out"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
