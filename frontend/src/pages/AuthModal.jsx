import React, { useState } from 'react';
import { X, Lock, Mail, User, Crown, Code, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, switchDemoUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Nagpur');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        await register({
          email,
          password,
          full_name: fullName || 'Indian Developer',
          location_city: city,
          country: 'India'
        });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {isRegister ? 'Create Developer Account' : 'Sign In to APIVault'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Quick Demo Login */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
            1-Click Demo Login
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={async () => {
                await switchDemoUser('ashish@apivault.in');
                onClose();
              }}
              className="px-2 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold flex flex-col items-center gap-1 transition-colors"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Ashish (Admin)</span>
            </button>
            <button
              onClick={async () => {
                await switchDemoUser('amit@paybharat.tech');
                onClose();
              }}
              className="px-2 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex flex-col items-center gap-1 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Amit (Fintech)</span>
            </button>
            <button
              onClick={async () => {
                await switchDemoUser('priya@indicai.in');
                onClose();
              }}
              className="px-2 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-[11px] font-bold flex flex-col items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Priya (AI)</span>
            </button>
          </div>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ashish Mohod"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">City (India)</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Nagpur"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@startup.in"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-500 font-medium">{errorMsg}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-500">
          {isRegister ? (
            <span>Already have an account? <button onClick={() => setIsRegister(false)} className="text-emerald-600 font-bold hover:underline">Sign In</button></span>
          ) : (
            <span>New developer? <button onClick={() => setIsRegister(true)} className="text-emerald-600 font-bold hover:underline">Create Account</button></span>
          )}
        </div>

      </div>
    </div>
  );
}
