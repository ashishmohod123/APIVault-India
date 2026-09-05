import React from 'react';
import { 
  Receipt, Landmark, MapPin, ShieldCheck, QrCode, MessageSquare, 
  Terminal, Zap, CheckCircle2, ArrowRight 
} from 'lucide-react';

const ICON_MAP = {
  Receipt,
  Landmark,
  MapPin,
  ShieldCheck,
  QrCode,
  MessageSquare,
  Terminal
};

export default function ApiCard({ api, onSelect, onOpenPlayground }) {
  const IconComponent = ICON_MAP[api.icon_name] || Terminal;
  const lowestPrice = api.pricing_tiers?.[0]?.price_inr === 0 
    ? 'Free Tier Available' 
    : `Starts ₹${api.pricing_tiers?.[0]?.price_inr || 499}/mo`;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
      <div>
        {/* Top bar: Category & Version */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {api.category}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {api.version}
          </span>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-snug">
              {api.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
              {api.tagline}
            </p>
          </div>
        </div>

        {/* Technical Badges: Latency, Uptime, Total Calls */}
        <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-100 dark:border-slate-800/80 text-center font-mono">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2">
            <div className="text-[10px] text-slate-400">LATENCY</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
              <Zap className="w-3 h-3" />
              {api.base_latency_ms}ms
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2">
            <div className="text-[10px] text-slate-400">UPTIME</div>
            <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-0.5 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              {api.uptime_pct}%
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2">
            <div className="text-[10px] text-slate-400">CALLS</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              {api.total_calls.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-2 flex items-center justify-between gap-2">
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{lowestPrice}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPlayground(api)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm shadow-emerald-600/20 flex items-center gap-1"
          >
            <Terminal className="w-3.5 h-3.5" />
            Playground
          </button>
          <button
            onClick={() => onSelect(api)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View API Docs"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
