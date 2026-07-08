import React from 'react';
import { ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ onBack }) => {
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
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 relative z-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex gap-3 text-xs font-semibold text-slate-500">
          <button onClick={handleHomeClick} className="hover:text-primary">Home</button>
          <span>/</span>
          <span className="text-slate-300">About</span>
        </nav>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">About StadiumIQ</h1>
          
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <p>
              StadiumIQ is a smart assistant built for fans and staff at the FIFA World Cup 2026. 
              It helps people find their way around the stadium, get quick answers in their own 
              language, and stay safe during the event.
            </p>
            <p>
              We built StadiumIQ because big stadiums can be confusing. Long lines, crowded gates, 
              and language barriers make it hard for fans to enjoy the game. Our platform solves 
              this with live maps, an AI assistant, and real-time safety alerts.
            </p>
            <p>
              StadiumIQ is used by two types of people. Fans can look up gates, restrooms, and 
              food courts, and get directions straight to their seat. Stadium staff can watch 
              crowd levels in real time, report incidents, and send emergency alerts to every 
              fan's phone in seconds.
            </p>
            <p>
              Our goal is simple: make match day easier, safer, and more enjoyable for everyone 
              in the stadium.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
              <h2 className="font-bold text-slate-200 text-sm">Security & Trust</h2>
              <p className="text-slate-400 text-xs mt-1">Every communication is protected with encryption, protecting tournament integrity data.</p>
            </div>
            <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
              <h2 className="font-bold text-slate-200 text-sm">Smart Telemetry</h2>
              <p className="text-slate-400 text-xs mt-1">Sensor fluctuations sync every 5 seconds to provide accurate crowd density readings.</p>
            </div>
          </div>
        </div>

        {/* Directory Navigator */}
        <nav aria-label="Directory Navigation" className="mt-8 flex flex-wrap gap-4 justify-center text-xs font-bold">
          <button onClick={() => handleNavClick('about')} className="px-4 py-2 rounded-full border border-primary text-primary bg-primary/5">About StadiumIQ</button>
          <button onClick={() => handleNavClick('features')} className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">Helper Features</button>
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
