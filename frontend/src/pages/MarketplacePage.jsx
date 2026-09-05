import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Terminal, Shield, Zap, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import ApiCard from '../components/ApiCard';
import ApiPlayground from '../components/ApiPlayground';

export default function MarketplacePage({ onSelectApi }) {
  const [apis, setApis] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [playgroundApi, setPlaygroundApi] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery, sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.listApis(searchQuery, selectedCategory, sortBy);
      setApis(data);

      // Extract unique categories
      const cats = ['All', ...new Set(data.map(a => a.category))];
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50 to-emerald-500/5 dark:from-devDark-900 dark:via-devDark-950 dark:to-emerald-950/20 p-8 sm:p-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India's Developer API Marketplace & Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
          High-Performance Indian APIs with <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Metered Gateway</span>
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Discover, test, and integrate authentic Indian GST, Banking IFSC, Postal PIN, PAN KYC, and UPI APIs. Powered by asynchronous FastAPI routing, sliding-window rate limiting, and instant in-browser playgrounds.
        </p>

        {/* Search & Filter Bar */}
        <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Indian APIs (e.g. GST, IFSC, PIN Code, UPI, PAN)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-devDark-850 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-devDark-850 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none shadow-sm"
          >
            <option value="popular">Most Popular</option>
            <option value="latency">Lowest Latency</option>
            <option value="newest">Newest Added</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-105'
                  : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Floating or Embedded In-Browser Playground (if open) */}
      {playgroundApi && (
        <div className="my-8 scroll-mt-20" id="playground-view">
          <ApiPlayground
            selectedApi={playgroundApi}
            onClose={() => setPlaygroundApi(null)}
          />
        </div>
      )}

      {/* APIs Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Available Microservices
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono font-bold">
              {apis.length} Services
            </span>
          </div>

          <button
            onClick={loadData}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400 font-mono text-sm">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading Indian API catalog...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((a) => (
              <ApiCard
                key={a.id}
                api={a}
                onSelect={(item) => onSelectApi(item)}
                onOpenPlayground={(item) => {
                  setPlaygroundApi(item);
                  setTimeout(() => {
                    document.getElementById('playground-view')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Architectural Pillars Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white p-8">
        <h3 className="text-lg font-bold text-emerald-400 mb-2 font-mono">
          // Platform Architecture & Gateway Design
        </h3>
        <p className="text-xs text-slate-400 max-w-3xl mb-6">
          Engineered by Ashish Mohod (Nagpur) with enterprise-ready patterns designed for scalable microservice ecosystems:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm">Sliding-Window Limiter</div>
              <p className="text-slate-400 mt-1">Protects upstreams from DDoS and noisy neighbors by enforcing per-minute request caps with 429 Retry-After headers.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm">SHA-256 API Key Vault</div>
              <p className="text-slate-400 mt-1">Zero plaintext secret storage. Keys are salted and cryptographically hashed, verifying callers with sub-millisecond lookups.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm">Metered Subscriptions</div>
              <p className="text-slate-400 mt-1">Autonomous monthly call tracking in SQLite/PostgreSQL with automated quota exhaustion enforcement and INR (₹) tiers.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
