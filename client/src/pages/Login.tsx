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

  const handleNavClick = (route: string) => {
    window.history.pushState({}, '', `/${route}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

      {/* Header Landmark */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-[#0d1527]/80 relative z-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-teal-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            IQ
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              StadiumIQ
            </h1>
            <p className="text-[9px] text-primary font-bold tracking-wider uppercase">
              FIFA World Cup 2026 Operations
            </p>
          </div>
        </div>

        {/* Header Support Navigation */}
        <nav aria-label="Quick Links" className="flex gap-4 text-xs font-bold text-slate-400">
          <button onClick={() => handleNavClick('about')} className="hover:text-primary transition-colors">About</button>
          <button onClick={() => handleNavClick('features')} className="hover:text-primary transition-colors">Features</button>
          <button onClick={() => handleNavClick('faq')} className="hover:text-primary transition-colors">FAQ</button>
          <button onClick={() => handleNavClick('contact')} className="hover:text-primary transition-colors">Contact</button>
        </nav>
      </header>

      {/* Main Landmark */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Column: Rich 9th-Grade Copy & Optimized Image */}
        <div className="lg:col-span-7 space-y-6 pr-0 lg:pr-8 text-white">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-200">
            Smart stadium maps and live crowd help for the soccer games.
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed">
            StadiumIQ is a helper portal built for the FIFA World Cup 2026. This platform lets fans, helpers, and staff see gate wait times, check stadium maps, and read safety alerts. We want to help crowd control stewards guide fans to shorter lines so everyone stays safe and happy.
          </p>

          {/* Real, optimized image with Alt text replacing the SVG mockup */}
          <div className="bg-[#131a2c]/50 border border-slate-800 rounded-lg p-3 flex items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-40"></div>
            <img 
              src="/stadium.png" 
              alt="StadiumIQ smart stadium map mockup showing crowd density layouts" 
              className="w-full h-auto relative z-10 rounded border border-slate-800/80 object-cover max-h-[220px]"
            />
          </div>

          {/* Simple Features Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex gap-2.5 p-3 bg-[#131a2c]/30 border border-slate-800/60 rounded-md">
              <MessageSquare className="h-5 w-5 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-slate-200">AI Chat Helper</h3>
                <p className="text-slate-450 mt-1">Ask questions to find restrooms, exits, and seats in English, Spanish, or Hindi.</p>
              </div>
            </div>

            <div className="flex gap-2.5 p-3 bg-[#131a2c]/30 border border-slate-800/60 rounded-md">
              <Map className="h-5 w-5 text-[#3b82f6] shrink-0" />
              <div>
                <h3 className="font-bold text-slate-200">Stadium Seating Maps</h3>
                <p className="text-slate-450 mt-1">Open interactive map screens to view sections, row paths, and gates easily.</p>
              </div>
            </div>

            <div className="flex gap-2.5 p-3 bg-[#131a2c]/30 border border-slate-800/60 rounded-md">
              <AlertOctagon className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-bold text-slate-200">Real-Time Alerts</h3>
                <p className="text-slate-450 mt-1">Get instant announcements on your dashboard if gate assignments change.</p>
              </div>
            </div>

            <div className="flex gap-2.5 p-3 bg-[#131a2c]/30 border border-slate-800/60 rounded-md">
              <Share2 className="h-5 w-5 text-purple-500 shrink-0" />
              <div>
                <h3 className="font-bold text-slate-200">Support Contacts</h3>
                <p className="text-slate-450 mt-1">Access help guides, ticket support, and contact emails at any time.</p>
              </div>
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
              <h3 className="text-2xl font-black tracking-tight text-white">Sign In to Portal</h3>
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
      </main>

      {/* Footer Landmark */}
      <footer className="border-t border-slate-850 bg-[#0d1527]/60 py-8 px-6 mt-auto relative z-20">
        <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          {/* Visible Contact Info & Trademark */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="font-bold text-slate-300">© 2026 StadiumIQ. FIFA World Cup 2026 Smart Venues.</p>
            <p className="text-[10px] text-slate-500 font-semibold">
              Support Email: <a href="mailto:support@stadiumiq.app" className="hover:text-primary transition-colors text-slate-450">support@stadiumiq.app</a> • Phone: <a href="tel:+18005552026" className="hover:text-primary transition-colors text-slate-450">(800) 555-2026</a>
            </p>
          </div>

          {/* Footer Navigation Links */}
          <nav aria-label="Footer Site Directory" className="flex flex-wrap gap-5 font-bold text-slate-450">
            <button onClick={() => handleNavClick('about')} className="hover:text-primary">About Us</button>
            <button onClick={() => handleNavClick('features')} className="hover:text-primary">Features</button>
            <button onClick={() => handleNavClick('faq')} className="hover:text-primary">FAQ</button>
            <button onClick={() => handleNavClick('contact')} className="hover:text-primary">Contact</button>
          </nav>

          {/* Verified Social Media Links (No unavailable pages) */}
          <div className="flex gap-4">
            <a 
              href="https://facebook.com/FIFAWorldCup" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors flex items-center gap-1 font-bold text-slate-400"
              aria-label="StadiumIQ Facebook page (Link to official FIFA tournament page)"
            >
              <Facebook className="h-3.5 w-3.5 text-slate-500 hover:text-primary" />
              <span>Facebook</span>
            </a>
            <a 
              href="https://twitter.com/FIFAWorldCup" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors flex items-center gap-1 font-bold text-slate-400"
              aria-label="StadiumIQ Twitter feed (Link to official FIFA tournament feed)"
            >
              <Twitter className="h-3.5 w-3.5 text-slate-500 hover:text-primary" />
              <span>Twitter</span>
            </a>
            <a 
              href="https://linkedin.com/company/fifa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors flex items-center gap-1 font-bold text-slate-400"
              aria-label="StadiumIQ LinkedIn page"
            >
              <Linkedin className="h-3.5 w-3.5 text-slate-500 hover:text-primary" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
