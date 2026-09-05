import React, { useState, useEffect } from 'react';
import { 
  Crown, Users, Key, Activity, IndianRupee, Download, 
  RefreshCw, CheckCircle2, Zap, Server, ShieldCheck, FileSpreadsheet 
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    setDownloading(true);
    try {
      await api.downloadAdminCsv();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Super Admin Ashish Header */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-transparent p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-amber-500 text-slate-950 font-bold">
              <Crown className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
              Super Admin Authority
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Admin Central Hub:</span>
            <span className="text-amber-500">ASHISH MOHOD</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            📍 Nagpur Headquarters, Maharashtra • Platform-Wide Telemetry & Indian API Gateway Oversight
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCsv}
            disabled={downloading}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{downloading ? 'Generating...' : 'Export Platform CSV'}</span>
          </button>
          <button
            onClick={loadMetrics}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Indian Rupee GMV */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider font-mono">Platform Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xs text-emerald-500 font-bold">₹</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {(metrics?.total_revenue_inr || 48940).toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>All Indian Rupee (INR) subscriptions</span>
          </div>
        </div>

        {/* Total API Calls Processed */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider font-mono">Total API Traffic</span>
            <Activity className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {(metrics?.total_api_calls_processed || 35140).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-500" />
            <span>Across Nagpur, Pune, Bengaluru hubs</span>
          </div>
        </div>

        {/* Developers Registered */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider font-mono">Indian Developers</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {metrics?.total_developers || 48}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Fintech startups & enterprise clients
          </div>
        </div>

        {/* Active Secret Keys */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider font-mono">Hashed Keys in DB</span>
            <Key className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {metrics?.total_active_keys || 112}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>SHA-256 encrypted storage</span>
          </div>
        </div>

      </div>

      {/* Middle Grid: Top Indian APIs & Gateway Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Consumed Indian APIs (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-500" />
              <span>Top Consumed Indian APIs by Volume</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Telemetry</span>
          </div>

          <div className="space-y-3">
            {metrics?.top_apis?.map((apiItem, idx) => (
              <div key={apiItem.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{apiItem.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{apiItem.category}</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {apiItem.total_calls.toLocaleString()} calls
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ~{apiItem.base_latency_ms} ms avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Server & Gateway Node Specs (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Admin Gateway Configuration</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 flex justify-between">
                <span className="text-slate-400">Gateway Engine</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">FastAPI Async (ASGI)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 flex justify-between">
                <span className="text-slate-400">Rate Limiter Window</span>
                <span className="font-bold text-emerald-500">60s Sliding Window</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 flex justify-between">
                <span className="text-slate-400">Primary Database</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">SQLAlchemy 2.0 / SQLite</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 flex justify-between">
                <span className="text-slate-400">Admin Region</span>
                <span className="font-bold text-amber-500">Nagpur (Central India)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs mt-4">
            👑 Ashish Mohod has full administrative authority to whitelist IPs, reset developer quotas, and issue high-volume enterprise credentials.
          </div>
        </div>

      </div>

    </div>
  );
}
