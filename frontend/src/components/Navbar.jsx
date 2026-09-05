import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Terminal, Key, Sun, Moon, ShieldCheck, User, LogOut, LayoutDashboard, Crown } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, onOpenKeyModal }) {
  const { user, logout, activeApiKey, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-devDark-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  APIVault
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono -mt-0.5">
                Developer API Gateway
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Developer Console
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/30'
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500" />
                Admin (ASHISH - Nagpur)
              </button>
            )}
          </nav>
        </div>

        {/* Right Section: API Key Chip, Theme, User */}
        <div className="flex items-center gap-3">
          
          {/* Active API Key Chip */}
          <div 
            onClick={onOpenKeyModal}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-xs font-mono cursor-pointer hover:border-emerald-500/50 transition-colors"
            title="Click to view or generate API Keys"
          >
            <Key className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">
              {activeApiKey ? `${activeApiKey.substring(0, 14)}...` : 'No API Key'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end gap-1">
                  {user.role === 'SUPER_ADMIN' && <Crown className="w-3 h-3 text-amber-500" />}
                  {user.full_name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {user.location_city}, India
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
