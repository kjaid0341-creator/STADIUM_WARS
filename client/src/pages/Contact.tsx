import React from 'react';
import { ArrowLeft, Mail, Phone, Clock, ShieldAlert, Facebook, Twitter, Linkedin } from 'lucide-react';

interface ContactProps {
  onBack: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onBack }) => {
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
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 relative z-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex gap-3 text-xs font-semibold text-slate-500">
          <button onClick={handleHomeClick} className="hover:text-primary">Home</button>
          <span>/</span>
          <span className="text-slate-300">Contact</span>
        </nav>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Contact Us</h1>
          
          <p className="text-slate-300 text-sm leading-relaxed">
            Have a question or need help? We're here for you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Contact details */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center">
              <Mail className="h-6 w-6 text-primary mb-2" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Support Email</span>
              <a href="mailto:support@stadiumiq.app" className="text-xs text-white mt-1.5 hover:text-primary transition-colors font-bold underline">
                support@stadiumiq.app
              </a>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center">
              <Phone className="h-6 w-6 text-[#3b82f6] mb-2" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
              <a href="tel:+18005552026" className="text-xs text-white mt-1.5 hover:text-primary transition-colors font-bold underline">
                (800) 555-2026
              </a>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center">
              <Clock className="h-6 w-6 text-amber-500 mb-2" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Operations Hours</span>
              <span className="text-xs text-slate-300 mt-1.5 font-bold">
                Match Days & Events
              </span>
            </div>

          </div>

          <div className="p-5 bg-destructive/10 border border-destructive/25 rounded-xl flex gap-3 items-start text-xs text-red-300">
            <ShieldAlert className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Urgent Concerns:</strong> For urgent safety concerns during a match, please speak to the nearest stadium staff member or security volunteer.
            </p>
          </div>
        </div>

        {/* Directory Navigator */}
        <nav aria-label="Directory Navigation" className="mt-8 flex flex-wrap gap-4 justify-center text-xs font-bold">
          <button onClick={() => handleNavClick('about')} className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">About StadiumIQ</button>
          <button onClick={() => handleNavClick('features')} className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">Helper Features</button>
          <button onClick={() => handleNavClick('faq')} className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">Operations FAQ</button>
          <button onClick={() => handleNavClick('contact')} className="px-4 py-2 rounded-full border border-primary text-primary bg-primary/5">Contact Support</button>
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
