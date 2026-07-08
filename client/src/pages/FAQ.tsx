import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Facebook, Twitter, Linkedin } from 'lucide-react';

interface FAQProps {
  onBack: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleNavClick = (route: string) => {
    window.history.pushState({}, '', `/${route}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleHomeClick = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    onBack();
  };

  const faqs = [
    {
      q: "What is StadiumIQ?",
      a: "StadiumIQ is a digital assistant for fans and staff at the FIFA World Cup 2026. It helps you find your way, answer questions, and stay updated during the match."
    },
    {
      q: "Do I need to download an app?",
      a: "No. StadiumIQ works right in your phone's web browser. There is nothing to download or install."
    },
    {
      q: "What languages does StadiumIQ support?",
      a: "StadiumIQ currently supports English, Spanish, and Hindi, with more languages planned for future events."
    },
    {
      q: "How do I find my seat?",
      a: "Open the Stadium Map, tap \"My Ticket,\" and select \"Route from entrance to seat.\" StadiumIQ will show you the fastest path from your gate to your seat."
    },
    {
      q: "Is StadiumIQ accessible for fans with disabilities?",
      a: "Yes. StadiumIQ highlights accessible restrooms, ramps, and lifts, and can give you accessible directions to your seat."
    },
    {
      q: "How do I report a safety concern?",
      a: "If you see something that needs attention, tell the nearest staff member or volunteer. Stadium staff use StadiumIQ to log and respond to incidents quickly."
    },
    {
      q: "Will I be notified about emergencies?",
      a: "Yes. If stadium staff send an emergency alert, it will appear automatically on your screen, wherever you are in the stadium."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#0e172a] to-[#032327] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Top glowing neon border bar */}
      <div className="bg-gradient-to-r from-primary via-[#06b6d4] to-secondary h-[4px] w-full shrink-0 relative z-20 shadow-[0_1px_15px_rgba(16,185,129,0.3)]"></div>

      {/* Header Landmark */}
      <header className="border-b border-slate-855 bg-[#0d1527]/90 px-6 py-4 flex items-center justify-between relative z-10 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-gradient-to-br from-primary to-teal-500 border border-primary/40 rounded-lg flex items-center justify-center text-white font-black text-sm">IQ</div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">StadiumIQ</span>
            <p className="text-[10px] text-slate-505 font-bold tracking-widest uppercase mt-0.5">FIFA 2026 HELP GUIDE</p>
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
        <nav aria-label="Breadcrumb" className="mb-6 flex gap-3 text-xs font-semibold text-slate-505">
          <button onClick={handleHomeClick} className="hover:text-primary">Home</button>
          <span>/</span>
          <span className="text-slate-300">FAQ</span>
        </nav>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Frequently Asked Questions</h1>
          
          <div className="space-y-3 pt-2">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded-t-xl"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    {faq.q}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 pt-2 text-xs text-slate-300 leading-relaxed border-t border-white/5 bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Directory Navigator */}
        <nav aria-label="Directory Navigation" className="mt-8 flex flex-wrap gap-4 justify-center text-xs font-bold">
          <button onClick={() => handleNavClick('about')} className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">About StadiumIQ</button>
          <button onClick={() => handleNavClick('features')} className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">Helper Features</button>
          <button onClick={() => handleNavClick('faq')} className="px-4 py-2 rounded-full border border-primary text-primary bg-primary/5">Operations FAQ</button>
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
