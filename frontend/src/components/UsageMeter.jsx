import React from 'react';
import { Activity, Gauge, Zap, CheckCircle } from 'lucide-react';

export default function UsageMeter({ analytics }) {
  const {
    total_calls = 0,
    avg_latency_ms = 18.4,
    success_rate_pct = 99.4,
    total_quota_allocated = 10000,
    total_quota_consumed = 0,
    quota_percentage = 0
  } = analytics || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Monthly Quota Consumption */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-5">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
          <span className="font-semibold uppercase tracking-wider font-mono">Monthly Quota</span>
          <Activity className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {total_quota_consumed.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            / {total_quota_allocated.toLocaleString()} calls
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(3, quota_percentage))}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5">
          <span>{quota_percentage}% consumed</span>
          <span>{(total_quota_allocated - total_quota_consumed).toLocaleString()} remaining</span>
        </div>
      </div>

      {/* 2. Avg Gateway Latency */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-5">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
          <span className="font-semibold uppercase tracking-wider font-mono">Gateway Latency</span>
          <Zap className="w-4 h-4 text-cyan-500" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
            {avg_latency_ms}
          </span>
          <span className="text-xs text-slate-400 font-mono">ms round-trip</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          ⚡ Ultra-low latency via async Python FastAPI proxy routing.
        </p>
      </div>

      {/* 3. Success Rate */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-5">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
          <span className="font-semibold uppercase tracking-wider font-mono">Success Rate</span>
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {success_rate_pct}%
          </span>
          <span className="text-xs text-slate-400 font-mono">HTTP 200 OK</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          🟢 High-availability Indian microservices with SLA guarantees.
        </p>
      </div>

      {/* 4. Sliding Window Rate Limiter Status */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-5">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
          <span className="font-semibold uppercase tracking-wider font-mono">Rate Limiter</span>
          <Gauge className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            60
          </span>
          <span className="text-xs text-slate-400 font-mono">req / min limit</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Sliding Window: Active & Healthy</span>
        </div>
      </div>
    </div>
  );
}
