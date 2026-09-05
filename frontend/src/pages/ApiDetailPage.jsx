import React, { useState } from 'react';
import { 
  ArrowLeft, Terminal, FileCode2, CreditCard, Zap, CheckCircle2, 
  Clock, Shield, Check, Copy 
} from 'lucide-react';
import ApiPlayground from '../components/ApiPlayground';
import { api } from '../services/api';

export default function ApiDetailPage({ selectedApi, onBack, onOpenKeyModal }) {
  const [activeTab, setActiveTab] = useState('playground'); // playground, docs, pricing
  const [subscribingTier, setSubscribingTier] = useState(null);
  const [subscribedMessage, setSubscribedMessage] = useState(null);

  const handleSubscribe = async (tier) => {
    setSubscribingTier(tier.id);
    try {
      await api.subscribe(selectedApi.id, tier.id);
      setSubscribedMessage(`Successfully subscribed to ${tier.name} (Limit: ${tier.request_limit_monthly.toLocaleString()} calls/mo)!`);
      setTimeout(() => setSubscribedMessage(null), 4000);
    } catch (err) {
      alert(err.message || 'Subscription failed');
    } finally {
      setSubscribingTier(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to API Marketplace
      </button>

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {selectedApi.category}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {selectedApi.version}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {selectedApi.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {selectedApi.description}
            </p>
          </div>

          {/* Metric Stats */}
          <div className="flex items-center gap-3 font-mono text-center shrink-0">
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400">LATENCY</div>
              <div className="text-sm font-bold text-emerald-500 flex items-center justify-center gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
                {selectedApi.base_latency_ms}ms
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400">UPTIME</div>
              <div className="text-sm font-bold text-cyan-500 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {selectedApi.uptime_pct}%
              </div>
            </div>
          </div>

        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-6">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'playground'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Interactive Playground
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'docs'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Endpoint Specifications
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'pricing'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Pricing & Quotas (INR ₹)
          </button>
        </div>
      </div>

      {subscribedMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{subscribedMessage}</span>
        </div>
      )}

      {/* Tab 1: Live Interactive Playground */}
      {activeTab === 'playground' && (
        <ApiPlayground selectedApi={selectedApi} />
      )}

      {/* Tab 2: Endpoint Specifications */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          {selectedApi.endpoints.map((ep) => (
            <div key={ep.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                  ep.http_method === 'GET' ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {ep.http_method}
                </span>
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                  /api/gateway/{selectedApi.slug}{ep.path}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {ep.description || ep.summary}
              </p>

              {/* Sample Response Preview */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Sample JSON Response (200 OK)
                </div>
                <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                  <pre>{ep.sample_response_json}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Pricing Tiers */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedApi.pricing_tiers.map((tier) => {
            let features = [];
            try {
              features = JSON.parse(tier.features_json || '[]');
            } catch {
              features = ["Instant API Key", "Community Support"];
            }

            return (
              <div key={tier.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                    {tier.tier_type}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {tier.name}
                  </h3>
                  
                  <div className="my-4">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                      ₹{tier.price_inr.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono"> / month</span>
                  </div>

                  <div className="space-y-2 py-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      ⚡ {tier.request_limit_monthly.toLocaleString()} API calls/mo
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      ⏱️ {tier.rate_limit_per_min} req / min rate limit
                    </div>
                    {features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={subscribingTier === tier.id}
                  className="w-full mt-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {subscribingTier === tier.id ? 'Activating...' : tier.price_inr === 0 ? 'Activate Free Sandbox' : `Subscribe for ₹${tier.price_inr}`}
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
