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
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-secondary/5 to-transparent pointer-events-none z-0"></div>
      
      {/* Top glowing neon border bar */}
      <div className="bg-gradient-to-r from-primary via-[#06b6d4] to-secondary h-[4px] w-full shrink-0 relative z-20 shadow-[0_1px_15px_rgba(16,185,129,0.3)]"></div>

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
      <header className="border-b border-slate-800 bg-gradient-to-r from-[#0d1527] to-[#121c33] px-6 py-4 flex items-center justify-between relative z-15 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-gradient-to-br from-primary to-teal-500 border border-primary/40 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-[0_0_12px_rgba(16,185,129,0.25)] animate-pulse-slow">IQ</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">StadiumIQ</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">FIFA 2026 FAN PORTAL</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          {/* Language selection syncs with User profile */}
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
            className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-primary hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all duration-300"
          >
            <User className="h-5 w-5 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden relative z-10">
        
        {/* Navigation Tabs (Mobile optimized layout) */}
        <div className="md:col-span-2 flex flex-col gap-4 h-[550px] md:h-[650px]">
          <div className="flex bg-[#131a2c]/85 p-1 rounded-lg border border-slate-800 shrink-0 shadow-lg">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'map' 
                  ? 'bg-gradient-to-r from-primary to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Stadium Map</span>
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'ticket' 
                  ? 'bg-gradient-to-r from-secondary to-[#06b6d4] text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span>My Ticket</span>
            </button>
          </div>

          {/* Tab Views */}
          <div className="flex-1 glass-panel rounded-lg p-4 overflow-hidden relative flex flex-col">
            
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
                      className="text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                    >
                      Clear Seat Route
                    </button>
                  )}
                </div>

                {/* SVG interactive layout */}
                <div className="flex-1 flex items-center justify-center p-4">
                  <svg viewBox="0 0 500 500" className="w-full max-w-[400px] h-auto">
                    {/* Outer boundaries */}
                    <circle cx="250" cy="250" r="220" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <circle cx="250" cy="250" r="170" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
                    
                    {/* Pitch green area */}
                    <rect x="180" y="200" width="140" height="100" rx="10" fill="#047857" opacity="0.3" stroke="#059669" strokeWidth="2" />
                    <line x1="250" y1="200" x2="250" y2="300" stroke="#059669" strokeWidth="1.5" />
                    <circle cx="250" cy="250" r="25" fill="none" stroke="#059669" strokeWidth="1.5" />

                    {/* Sensor zones / gates (interactive) */}
                    
                    {/* Gate 3 (North) */}
                    <path
                      d="M 210 50 A 205 205 0 0 1 290 50 L 280 80 A 175 175 0 0 0 220 80 Z"
                      fill={selectedMapSection === 'GATE_3' ? '#10b981' : '#1e293b'}
                      opacity={selectedMapSection === 'GATE_3' ? 0.75 : 0.4}
                      stroke={selectedMapSection === 'GATE_3' ? '#10b981' : '#475569'}
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-70 transition-all"
                      onClick={() => setSelectedMapSection('GATE_3')}
                    />
                    <text x="250" y="42" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">GATE 3</text>

                    {/* Gate 5 (West) */}
                    <path
                      d="M 50 210 A 205 205 0 0 0 50 290 L 80 280 A 175 175 0 0 1 80 220 Z"
                      fill={selectedMapSection === 'GATE_5' ? '#ef4444' : '#1e293b'} // Simulated red warning
                      opacity={selectedMapSection === 'GATE_5' ? 0.75 : 0.4}
                      stroke={selectedMapSection === 'GATE_5' ? '#ef4444' : '#475569'}
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-70 transition-all"
                      onClick={() => setSelectedMapSection('GATE_5')}
                    />
                    <text x="35" y="254" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 35 254)">GATE 5</text>

                    {/* Gate 12 (East) */}
                    <path
                      d="M 450 210 A 205 205 0 0 1 450 290 L 420 280 A 175 175 0 0 0 420 220 Z"
                      fill={selectedMapSection === 'GATE_12' ? '#10b981' : '#1e293b'}
                      opacity={selectedMapSection === 'GATE_12' ? 0.75 : 0.4}
                      stroke={selectedMapSection === 'GATE_12' ? '#10b981' : '#475569'}
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-70 transition-all"
                      onClick={() => setSelectedMapSection('GATE_12')}
                    />
                    <text x="465" y="254" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(90 465 254)">GATE 12</text>

                    {/* Section 104 (Bottom North) */}
                    <path
                      d="M 120 150 A 180 180 0 0 1 200 90 L 210 120 A 150 150 0 0 0 140 170 Z"
                      fill={selectedMapSection === 'SECTION_104' ? '#f59e0b' : '#1e293b'}
                      opacity={selectedMapSection === 'SECTION_104' ? 0.75 : 0.4}
                      stroke={selectedMapSection === 'SECTION_104' ? '#f59e0b' : '#475569'}
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-70 transition-all"
                      onClick={() => setSelectedMapSection('SECTION_104')}
                    />
                    <text x="160" y="128" fill="#94a3b8" fontSize="8" textAnchor="middle">SEC 104</text>

                    {/* Section 102 */}
                    <path
                      d="M 300 90 A 180 180 0 0 1 380 150 L 360 170 A 150 150 0 0 0 290 120 Z"
                      fill={selectedMapSection === 'SECTION_102' ? '#10b981' : '#1e293b'}
                      opacity={selectedMapSection === 'SECTION_102' ? 0.75 : 0.4}
                      stroke={selectedMapSection === 'SECTION_102' ? '#10b981' : '#475569'}
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-70 transition-all"
                      onClick={() => setSelectedMapSection('SECTION_102')}
                    />
                    <text x="340" y="128" fill="#94a3b8" fontSize="8" textAnchor="middle">SEC 102</text>

                    {/* Section 206 (South) */}
                    <path
                      d="M 210 420 A 180 180 0 0 1 290 420 L 280 390 A 150 150 0 0 0 220 390 Z"
                      fill={selectedMapSection === 'SECTION_206' ? '#10b981' : '#1e293b'}
                      opacity={selectedMapSection === 'SECTION_206' ? 0.75 : 0.4}
                      stroke={selectedMapSection === 'SECTION_206' ? '#10b981' : '#475569'}
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-70 transition-all"
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

                    {/* SVG arrow marker */}
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                      </marker>
                    </defs>
                  </svg>
                </div>

                {/* Section Stats Panel */}
                <div className="bg-slate-900/60 border border-slate-800 rounded p-3 text-xs flex justify-between items-center mt-2 shrink-0">
                  {selectedMapSection ? (
                    <>
                      <div>
                        <span className="font-semibold text-slate-400 uppercase">Selected Zone: </span>
                        <span className="font-bold text-white ml-1">{selectedMapSection.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-slate-400">Live Volume:</span>
                          <span className="font-bold text-white ml-1">
                            {telemetry[selectedMapSection]?.crowdCount || 'Calculating...'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Density:</span>
                          <span className={`font-bold ml-1 ${
                            (() => {
                              const item = telemetry[selectedMapSection];
                              if (!item) return 'text-white';
                              const ratio = item.crowdCount / item.capacity;
                              if (ratio >= 0.8) return 'text-destructive';
                              if (ratio >= 0.6) return 'text-accent';
                              return 'text-primary';
                            })()
                          }`}>
                            {(() => {
                              const item = telemetry[selectedMapSection];
                              if (!item) return 'Pending';
                              return `${Math.round((item.crowdCount / item.capacity) * 100)}%`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-slate-400 text-center w-full">💡 Select a gate or section on the map to query live counts.</span>
                  )}
                </div>
              </div>
            )}

            {/* Mock ticket details & route planner */}
            {activeTab === 'ticket' && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-slate-800/80 pb-2">Your FIFA World Cup 2026 Ticket</h2>
                  
                  <div className="bg-gradient-to-br from-[#1e293b] via-[#111e38] to-[#16274d] rounded-lg p-5 border border-primary/25 flex justify-between items-center relative overflow-hidden mt-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-primary/50 transition-all duration-300">
                    {/* Decorative FIFA details */}
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-primary/10 flex items-center justify-center opacity-30">
                      <Ticket className="h-16 w-16 text-primary rotate-12" />
                    </div>

                    <div className="space-y-3 z-10">
                      <div className="mb-1">
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded border border-primary/20">FIFA Match 18</span>
                        <h3 className="font-bold text-lg leading-tight mt-2">USA vs Colombia</h3>
                        <p className="text-xs text-slate-400">CenturyLink Arena • July 9, 2026</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Section</div>
                          <div className="font-bold text-white">104</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Row</div>
                          <div className="font-bold text-white">G</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Seat</div>
                          <div className="font-bold text-white">18</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-300">Smart Transit & Arrival</h4>
                    <ul className="text-xs text-slate-400 space-y-2">
                      <li className="flex items-start gap-2">
                        <Accessibility className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>**Accessible Route**: Escalators are located at West concourse. Lift access is near Section 102.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
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
                  className="w-full bg-gradient-to-r from-primary to-teal-500 hover:from-primary-hover hover:to-teal-600 text-white font-bold py-3 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 mt-4"
                >
                  <Navigation2 className="h-5 w-5 fill-white" />
                  <span>Route from entrance to Seat (104-G-18)</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* AI Assistant Chat Widget */}
        <div className="glass-panel rounded-lg flex flex-col h-[550px] md:h-[650px] overflow-hidden border border-slate-800">
          <div className="bg-[#0d1527] px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-bold text-sm text-white">StadiumIQ Assistant</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  AI Live & Translate
                </span>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-secondary text-white ml-auto rounded-tr-none'
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

          {/* Suggested Queries */}
          <div className="p-3 bg-slate-950/40 border-t border-slate-850 shrink-0 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wide flex items-center gap-1">
              <HelpCircle className="h-3 w-3 text-primary" />
              Suggested Multilingual Qs
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQueries[chatLanguage]?.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sq.text)}
                  disabled={chatLoading}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-semibold px-2 py-1 rounded transition-colors border border-slate-700/50"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Send Input */}
          <div className="p-3 bg-[#0d1527] border-t border-slate-850 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                disabled={chatLoading}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                className="bg-primary hover:bg-primary-hover text-white p-2 rounded transition-colors shrink-0 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
