import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, Map, AlertOctagon, Facebook, Twitter, Linkedin } from 'lucide-react';

interface StaticPageProps {
  onBack: () => void;
  pageType: 'about' | 'features' | 'faq' | 'contact';
}

export const StaticPage: React.FC<StaticPageProps> = ({ onBack, pageType }) => {
  const handleNavClick = (route: string) => {
    window.history.pushState({}, '', `/${route}`);
    // Trigger custom popstate to force re-render
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleHomeClick = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    onBack();
  };

  const renderContent = () => {
    switch (pageType) {
      case 'about':
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-[#06b6d4] bg-clip-text text-transparent">About StadiumIQ</h2>
            <p className="text-slate-350 text-sm leading-relaxed">
              StadiumIQ is the official smart helper system built for the FIFA World Cup 2026. Our team works hard to make sure every match runs smoothly. We want to help fans find their seats safely and easily, without getting lost or waiting in long lines.
            </p>
            <p className="text-slate-350 text-sm leading-relaxed">
              We connect stadium gate sensors with quick AI guides. This lets us see which gates are too busy in real-time. We can then send alerts to help crowd control stewards guide fans to shorter lines. By working with stadium management, our tool keeps crowds moving and ensures everyone is safe.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-[#131a2c]/50 border border-slate-800 rounded-lg">
                <h3 className="font-bold text-slate-200 text-sm">Our Main Goal</h3>
                <p className="text-slate-400 text-xs mt-1">To make stadiums safer and easier to navigate for millions of soccer fans during the World Cup games.</p>
              </div>
              <div className="p-4 bg-[#131a2c]/50 border border-slate-800 rounded-lg">
                <h3 className="font-bold text-slate-200 text-sm">Modern Engineering</h3>
                <p className="text-slate-400 text-xs mt-1">We build tools using simple web screens and fast data connections that work on any smartphone or tablet.</p>
              </div>
            </div>
          </section>
        );

      case 'features':
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-[#06b6d4] bg-clip-text text-transparent">Key Helper Features</h2>
            <p className="text-slate-350 text-sm leading-relaxed">
              StadiumIQ brings helpful tools right to your phone or computer. Here are the main ways this platform makes your match day experience better:
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-[#131a2c]/40 border border-slate-800/80 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">AI Wayfinding Assistant</h3>
                  <p className="text-slate-400 text-xs mt-1">Ask questions in English, Spanish, or Hindi to find the closest restrooms, exit gates, food stalls, or medical tents near you.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-[#131a2c]/40 border border-slate-800/80 rounded-lg">
                <Map className="h-6 w-6 text-[#3b82f6] shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Live Crowd Heatmaps</h3>
                  <p className="text-slate-400 text-xs mt-1">View the stadium maps on your dashboard to check if your entrance gate has long wait times before you arrive.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-[#131a2c]/40 border border-slate-800/80 rounded-lg">
                <AlertOctagon className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Real-Time Safety Alerts</h3>
                  <p className="text-slate-400 text-xs mt-1">Get immediate announcements from stadium operators if there is a gate change, parking update, or weather delay.</p>
                </div>
              </div>
            </div>
          </section>
        );

      case 'faq':
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-[#06b6d4] bg-clip-text text-transparent">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-bold text-slate-200 text-sm">How does the live crowd map work?</h3>
                <p className="text-slate-400 text-xs mt-1.5">Stadium gates have counting sensors. Our system checks these counts and updates the map colors. Red zones have longer lines, and green zones are clear.</p>
              </div>
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-bold text-slate-200 text-sm">Can I use the AI helper in other languages?</h3>
                <p className="text-slate-400 text-xs mt-1.5">Yes! Our chat assistant answers questions in English, Spanish (Español), and Hindi. You can change your preferred language under your profile settings.</p>
              </div>
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-bold text-slate-200 text-sm">What should I do if there is an emergency?</h3>
                <p className="text-slate-400 text-xs mt-1.5">If there is an emergency, check the top of your dashboard. Stadium managers will push out safety banners with clear instructions on which exits to use.</p>
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-[#06b6d4] bg-clip-text text-transparent">Contact Us</h2>
            <p className="text-slate-350 text-sm leading-relaxed">
              Do you have questions about tickets, arena maps, or helper accounts? Our support team is here to assist you 24 hours a day during the tournament.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#131a2c]/50 border border-slate-800 rounded-lg flex flex-col items-center text-center">
                <Mail className="h-6 w-6 text-primary mb-2" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                <a href="mailto:support@stadium.iq" className="text-xs text-white mt-1 hover:text-primary transition-colors font-bold">support@stadium.iq</a>
              </div>
              <div className="p-4 bg-[#131a2c]/50 border border-slate-800 rounded-lg flex flex-col items-center text-center">
                <Phone className="h-6 w-6 text-[#3b82f6] mb-2" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Support Phone</span>
                <a href="tel:+18005552026" className="text-xs text-white mt-1 hover:text-primary transition-colors font-bold">+1 (800) 555-2026</a>
              </div>
              <div className="p-4 bg-[#131a2c]/50 border border-slate-800 rounded-lg flex flex-col items-center text-center">
                <MapPin className="h-6 w-6 text-amber-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Headquarters</span>
                <span className="text-xs text-slate-300 mt-1">301 Mercer St, Seattle, WA 98109</span>
              </div>
            </div>

            <div className="bg-[#131a2c]/30 border border-slate-800/80 p-6 rounded-lg mt-6">
              <h3 className="font-bold text-slate-200 text-sm mb-4">Send a Direct Message</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" required placeholder="Name" className="w-full bg-[#0b0f19]/80 border border-slate-700/60 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary" />
                  <input type="email" required placeholder="Email" className="w-full bg-[#0b0f19]/80 border border-slate-700/60 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary" />
                </div>
                <textarea required placeholder="Write your message here..." rows={4} className="w-full bg-[#0b0f19]/80 border border-slate-700/60 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-primary" />
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2 rounded text-xs transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col relative overflow-hidden">
      {/* Top glowing neon border bar */}
      <div className="bg-gradient-to-r from-primary via-[#06b6d4] to-secondary h-[4px] w-full shrink-0 relative z-20 shadow-[0_1px_15px_rgba(16,185,129,0.3)]"></div>

      {/* Accessibility Header */}
      <header className="border-b border-slate-800 bg-[#0d1527] px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-gradient-to-br from-primary to-teal-500 border border-primary/40 rounded-lg flex items-center justify-center text-white font-black text-sm">IQ</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">StadiumIQ</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">FIFA 2026 HELP GUIDE</p>
          </div>
        </div>

        {/* Accessibility Navigation Landmark */}
        <nav aria-label="Support Navigation">
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-1.5 text-xs bg-slate-800 border border-slate-700 hover:border-primary px-3 py-1.5 rounded transition-all font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portal</span>
          </button>
        </nav>
      </header>

      {/* Accessibility Main Content Landmark */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 relative z-10">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex gap-3 text-xs font-semibold text-slate-500">
          <button onClick={handleHomeClick} className="hover:text-primary">Home</button>
          <span>/</span>
          <span className="text-slate-350 capitalize">{pageType}</span>
        </nav>

        <div className="bg-[#131a2c]/40 backdrop-blur-xl border border-slate-800 p-8 rounded-lg shadow-2xl">
          {renderContent()}
        </div>

        {/* Inner static links block to quickly navigate between static pages */}
        <nav aria-label="Guide Sections" className="mt-8 flex flex-wrap gap-4 justify-center text-xs font-bold">
          <button onClick={() => handleNavClick('about')} className={`px-4 py-2 rounded border ${pageType === 'about' ? 'border-primary text-primary bg-primary/5' : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'}`}>About StadiumIQ</button>
          <button onClick={() => handleNavClick('features')} className={`px-4 py-2 rounded border ${pageType === 'features' ? 'border-primary text-primary bg-primary/5' : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'}`}>Helper Features</button>
          <button onClick={() => handleNavClick('faq')} className={`px-4 py-2 rounded border ${pageType === 'faq' ? 'border-primary text-primary bg-primary/5' : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'}`}>Operations FAQ</button>
          <button onClick={() => handleNavClick('contact')} className={`px-4 py-2 rounded border ${pageType === 'contact' ? 'border-primary text-primary bg-primary/5' : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'}`}>Contact Support</button>
        </nav>
      </main>

      {/* Accessibility Footer Landmark */}
      <footer className="border-t border-slate-850 bg-[#0d1527]/50 py-6 px-6 relative z-10">
        <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="font-semibold text-slate-300">© 2026 StadiumIQ. All rights reserved.</p>
            <p className="text-[10px] text-slate-500">Contact: support@stadium.iq • +1 (800) 555-2026</p>
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
