import React, { useState, useEffect } from 'react';
import { Key, Plus, Activity, Terminal, Shield, RefreshCw, Copy, Check } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UsageMeter from '../components/UsageMeter';

export default function DeveloperDashboard({ onOpenKeyModal }) {
  const { user, activeApiKey } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [keys, setKeys] = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [analyticsData, subsData, keysData] = await Promise.all([
        api.getDeveloperAnalytics(),
        api.getMySubscriptions(),
        api.listApiKeys()
      ]);
      setAnalytics(analyticsData);
      setSubscriptions(subsData);
      setKeys(keysData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Developer Console</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {user?.organization || 'Independent Developer'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <strong className="text-slate-800 dark:text-slate-200">{user?.full_name}</strong> ({user?.location_city}, India)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenKeyModal}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Manage API Keys</span>
          </button>
          <button
            onClick={loadDashboard}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* High-level Usage & Metering Cards */}
      <UsageMeter analytics={analytics} />

      {/* Middle Section: Active Keys & Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Secret Keys (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Secret Keys</h3>
              </div>
              <button
                onClick={onOpenKeyModal}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                New Key
              </button>
            </div>

            <div className="space-y-3">
              {keys.slice(0, 3).map((k) => (
                <div key={k.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{k.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-mono font-bold">
                        {k.environment}
                      </span>
                    </div>
                    <div className="font-mono text-slate-400 text-[11px] mt-0.5">
                      {k.key_prefix}...••••••••
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(k.raw_api_key || `${k.key_prefix}example_key`, k.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                    title="Copy Key"
                  >
                    {copiedKey === k.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Passed via <code className="text-emerald-400">X-APIVault-Key</code> header</span>
          </div>
        </div>

        {/* Subscribed Microservices (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Subscribed Microservices & Quotas</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {subscriptions.length} Subscribed
            </span>
          </div>

          <div className="space-y-3">
            {subscriptions.slice(0, 4).map((s) => {
              const maxCalls = s.pricing_tier?.request_limit_monthly || 10000;
              const used = s.calls_used_this_month || 42;
              const pct = Math.min(100, Math.round((used / maxCalls) * 100));

              return (
                <div key={s.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {s.service?.name || 'Indian Microservice'}
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {used} / {maxCalls.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Request Audit Logs Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Gateway Request Logs</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Audit & Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Endpoint Path</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {analytics?.recent_logs?.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      l.status_code === 200
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}>
                      {l.status_code}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">
                    {l.http_method}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {l.endpoint_path}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                    {l.latency_ms} ms
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
