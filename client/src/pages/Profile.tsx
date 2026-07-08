import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { User, Languages, LogOut, ArrowLeft, Save, ShieldAlert, Check } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [language, setLanguage] = useState<'en' | 'es' | 'hi'>(user?.preferredLanguage || 'en');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(false);
      setSaving(true);
      await updateProfile(name, language);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#101435] to-[#1a1440] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Ambient background color glows */}
      <div className="absolute top-[-100px] left-[-50px] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] right-[-50px] w-[350px] h-[350px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Top glowing branded neon border bar */}
      <div className="bg-gradient-to-r from-emerald-400 via-violet-500 to-amber-500 h-[4px] w-full shrink-0 relative z-20 shadow-[0_1px_15px_rgba(139,92,246,0.3)]"></div>

      {/* Navbar header */}
      <header className="border-b border-slate-850 bg-gradient-to-r from-[#0d1527] to-[#121c33] px-6 py-4 relative z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 text-xs font-bold bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className="text-sm font-black uppercase tracking-widest text-white/80">User Settings</h1>
          
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12 relative z-10">
        
        {/* Glowing card border wrapper */}
        <div className="bg-gradient-to-br from-white/15 to-transparent p-[1px] rounded-2xl shadow-2xl">
          <div className="w-full backdrop-blur-xl bg-[#111827]/85 p-8 rounded-2xl overflow-hidden">
            
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 border border-emerald-400/20 flex items-center justify-center text-white text-2xl font-black shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-violet-500/10 border border-violet-500/20 text-violet-300 mt-1.5">
                  Role: {user.role}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start text-rose-350 text-xs gap-2">
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center text-emerald-350 text-xs gap-2">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>Preferences updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#131a2c]/60 border border-slate-700/60 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-455 mb-2">
                  Preferred Language
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Languages className="h-5 w-5" />
                  </span>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value as any)}
                    className="w-full bg-[#131a2c]/60 border border-slate-700/60 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-xs appearance-none cursor-pointer font-semibold"
                  >
                    <option value="en">English (English)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-455 mb-2">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-[#131a2c]/30 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-500 text-xs cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Saving changes...' : 'Save Settings'}</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
