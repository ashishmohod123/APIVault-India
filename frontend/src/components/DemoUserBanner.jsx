import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Crown, Code, Sparkles } from 'lucide-react';

export default function DemoUserBanner({ setActiveTab }) {
  const { user, switchDemoUser } = useAuth();

  return (
    <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            Demo Switcher
          </span>
          <span className="hidden sm:inline text-slate-400">
            Switch test personas instantly:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {/* Admin Ashish */}
          <button
            onClick={async () => {
              await switchDemoUser('ashish@apivault.in');
              if (setActiveTab) setActiveTab('admin');
            }}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
              user?.email === 'ashish@apivault.in'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-950" />
            <span>Admin (ASHISH - Nagpur)</span>
          </button>

          {/* Amit Sharma */}
          <button
            onClick={async () => {
              await switchDemoUser('amit@paybharat.tech');
              if (setActiveTab) setActiveTab('dashboard');
            }}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
              user?.email === 'amit@paybharat.tech'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Amit (Fintech Dev - Pune)</span>
          </button>

          {/* Priya Nair */}
          <button
            onClick={async () => {
              await switchDemoUser('priya@indicai.in');
              if (setActiveTab) setActiveTab('marketplace');
            }}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
              user?.email === 'priya@indicai.in'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Priya (AI Dev - Bengaluru)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
