import React from 'react';
import { ArrowLeft, Map, MessageSquare, Accessibility, Activity, AlertTriangle, Radio, Facebook, Twitter, Linkedin } from 'lucide-react';

interface FeaturesProps {
  onBack: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ onBack }) => {
  const handleNavClick = (route: string) => {
    window.history.pushState({}, '', `/${route}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleHomeClick = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#0e172a] to-[#032327] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Top glowing neon border bar */}
      <div className="bg-gradient-to-r from-primary via-[#06b6d4] to-secondary h-[4px] w-full shrink-0 relative z-20 shadow-[0_1px_15px_rgba(16,185,129,0.3)]"></div>

      {/* Header Landmark */}
      <header className="border-b border-slate-850 bg-[#0d1527]/90 px-6 py-4 flex items-center justify-between relative z-10 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-gradient-to-br from-primary to-teal-500 border border-primary/40 rounded-lg flex items-center justify-center text-white font-black text-sm">IQ</div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">StadiumIQ</span>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">FIFA 2026 HELP GUIDE</p>
          </div>
        </div>

        <nav aria-label="Support Navigation">
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-1.5 text-xs bg-slate-800 border border-slate-700 hover:border-primary px-3 py-1.5 rounded transition-all duration-200 font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portal</span>
          </button>
        </nav>
      </header>

      {/* Main Landmark */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 relative z-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex gap-3 text-xs font-semibold text-slate-500">
          <button onClick={handleHomeClick} className="hover:text-primary">Home</button>
          <span>/</span>
          <span className="text-slate-300">Features</span>
        </nav>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Features</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            
            {/* Feature 1 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary">
                <Map className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-slate-200">Live Stadium Map</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                See a real-time map of the stadium. Tap any gate or section to check how busy it is right now. Avoid crowded areas and get to your seat faster.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-slate-200">Multilingual AI Assistant</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ask a question in English, Spanish, or Hindi and get an instant answer. Need to find a restroom, a food stand, or the nearest exit? Just type or tap a quick question and StadiumIQ will guide you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary">
                <Accessibility className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-slate-200">Accessible Routing</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                StadiumIQ shows accessible paths, including ramps, lifts, and accessible restrooms, so every fan can move through the stadium with ease.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-slate-200">Crowd Safety Monitoring</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Stadium staff can watch live crowd numbers at every gate and section. If a gate gets too busy, staff can quickly redirect fans to a safer, quieter route.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-slate-200">Incident Reporting</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Staff can log safety incidents in seconds and alert the right team members right away, helping keep every fan safe throughout the event.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary">
                <Radio className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-slate-200">Emergency Alerts</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                If something important happens, staff can send an alert to every fan's screen instantly, so everyone stays informed no matter where they are in the stadium.
              </p>
            </div>

          </div>
        </div>

        {/* Directory Navigator */}
        <nav aria-label="Directory Navigation" className="mt-8 flex flex-wrap gap-4 justify-center text-xs font-bold">
          <button onClick={() => handleNavClick('about')} className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">About StadiumIQ</button>
          <button onClick={() => handleNavClick('features')} className="px-4 py-2 rounded-full border border-primary text-primary bg-primary/5">Helper Features</button>
          <button onClick={() => handleNavClick('faq')} className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">Operations FAQ</button>
          <button onClick={() => handleNavClick('contact')} className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">Contact Support</button>
        </nav>
      </main>

      {/* Footer Landmark */}
      <footer className="border-t border-slate-850 bg-[#0d1527]/50 py-6 px-6 relative z-10 mt-auto">
        <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="font-semibold text-slate-350">© 2026 StadiumIQ. All rights reserved.</p>
            <p className="text-[10px] text-slate-500 font-bold">Support Email: support@stadiumiq.app • Phone: (800) 555-2026</p>
          </div>
          <div className="flex gap-4">
            <a href="https://facebook.com/FIFAWorldCup" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1 font-bold">
              <Facebook className="h-3.5 w-3.5" />
              <span>Facebook</span>
            </a>
            <a href="https://twitter.com/FIFAWorldCup" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1 font-bold">
              <Twitter className="h-3.5 w-3.5" />
              <span>Twitter</span>
            </a>
            <a href="https://linkedin.com/company/fifa" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1 font-bold">
              <Linkedin className="h-3.5 w-3.5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
