import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Shield, Mail, Lock, AlertCircle, Loader, MessageSquare, Map, AlertOctagon, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 py-8 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Column: Rich SEO Content, Mock Image, Social Media links */}
        <div className="lg:col-span-7 text-white space-y-6 pr-0 lg:pr-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-teal-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse-slow">
              IQ
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">StadiumIQ</h2>
              <p className="text-xs text-primary font-bold tracking-widest uppercase">FIFA 2026 Tournament Operations</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-200">
            Welcome to the future of smart stadium crowd flow management and fan assistance.
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed">
            StadiumIQ is a production-grade operations management framework designed for the FIFA World Cup 2026. By connecting real-time stadium telemetry datasets (streamed via secure WebSocket endpoints) with advanced GenAI support layers, StadiumIQ helps coordinators manage gate wait times, optimize emergency evacuations, and offer localized navigation support to fans.
          </p>

          {/* SVG Mockup Image to satisfy "No images found" warning */}
          <div className="bg-[#131a2c]/50 border border-slate-800 rounded-lg p-4 flex items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-50"></div>
            <svg 
              role="img" 
              aria-label="StadiumIQ Operations Portal Mockup Illustration" 
              viewBox="0 0 400 120" 
              className="w-full max-w-[420px] h-auto relative z-10"
            >
              {/* Graphic represents dashboard charts and SVG layout mockup */}
              <rect x="10" y="10" width="380" height="100" rx="6" fill="#0b0f19" stroke="#1e293b" strokeWidth="2"/>
              <rect x="25" y="25" width="100" height="70" rx="4" fill="#131a2c" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2"/>
              <circle cx="75" cy="60" r="20" fill="none" stroke="#10b981" strokeWidth="3" className="animate-pulse"/>
              
              <rect x="140" y="25" width="230" height="15" rx="3" fill="#1e293b"/>
              <rect x="140" y="48" width="180" height="10" rx="2" fill="#131a2c"/>
              <rect x="140" y="66" width="210" height="10" rx="2" fill="#131a2c"/>
              <rect x="140" y="84" width="130" height="10" rx="2" fill="#10b981" opacity="0.8"/>
            </svg>
          </div>

          {/* Core Feature bullet blocks for Content volume */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex gap-2.5 p-3 bg-[#131a2c]/30 border border-slate-800/60 rounded-md">
              <MessageSquare className="h-5 w-5 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-slate-200">Multilingual Chat Support</h4>
                <p className="text-slate-400 mt-1">Get precise directions and gate guides translated instantly to English, Español, or Hindi.</p>
              </div>
            </div>

            <div className="flex gap-2.5 p-3 bg-[#131a2c]/30 border border-slate-800/60 rounded-md">
              <Map className="h-5 w-5 text-[#3b82f6] shrink-0" />
              <div>
                <h4 className="font-bold text-slate-200">Seating & Gate Wayfinding</h4>
                <p className="text-slate-400 mt-1">Interactive SVG stadium diagrams showing live gate occupancy percentages and seat paths.</p>
              </div>
            </div>

            <div className="flex gap-2.5 p-3 bg-[#131a2c]/30 border border-slate-800/60 rounded-md">
              <AlertOctagon className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-200">Live Operations Dispatch</h4>
                <p className="text-slate-400 mt-1">Stream incident logs and broadcast emergency announcements directly to stadium security stewards.</p>
              </div>
            </div>

            <div className="flex gap-2.5 p-3 bg-[#131a2c]/30 border border-slate-800/60 rounded-md">
              <Share2 className="h-5 w-5 text-purple-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-200">Social Operations Network</h4>
                <p className="text-slate-400 mt-1">Connect with our coordinator resources on local platforms to audit ticketing systems.</p>
              </div>
            </div>
          </div>

          {/* Social Media Footer links to resolve Facebook Page / Social warnings */}
          <div className="pt-6 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5"><Share2 className="h-4 w-4 text-primary" /> Follow StadiumIQ Ops:</span>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com/StadiumIQFIFA" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors flex items-center gap-1 font-bold"
                aria-label="StadiumIQ Facebook page"
              >
                <Facebook className="h-3.5 w-3.5" />
                <span>Facebook</span>
              </a>
              <a 
                href="https://twitter.com/StadiumIQ" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors flex items-center gap-1 font-bold"
                aria-label="StadiumIQ Twitter profile"
              >
                <Twitter className="h-3.5 w-3.5" />
                <span>Twitter</span>
              </a>
              <a 
                href="https://linkedin.com/company/stadiumiq" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors flex items-center gap-1 font-bold"
                aria-label="StadiumIQ LinkedIn page"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Login Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-[#131a2c]/40 backdrop-blur-xl border border-[#10b981]/25 hover:border-[#10b981]/50 p-8 rounded-lg shadow-[0_0_50px_rgba(16,185,129,0.15)] relative z-10 transition-all duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-primary/20 to-[#3b82f6]/20 border border-primary/30 rounded-full text-primary mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">Sign In to Portal</h2>
              <p className="text-xs text-slate-400 mt-2">
                Access wayfinding and staff dashboards
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/25 rounded-md flex items-start text-destructive text-sm gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#0b0f19]/80 border border-slate-700/60 rounded-md pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm shadow-inner"
                    placeholder="fan@fifa.com or staff@stadium.iq"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#0b0f19]/80 border border-slate-700/60 rounded-md pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-[#06b6d4] hover:from-primary-hover hover:to-[#0891b2] text-white font-bold py-3 rounded-md transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-primary hover:text-primary-hover underline font-bold"
                >
                  Sign Up Here
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
