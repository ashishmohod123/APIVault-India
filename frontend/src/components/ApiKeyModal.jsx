import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, Check, ShieldAlert, X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ApiKeyModal({ isOpen, onClose }) {
  const { setActiveApiKey } = useAuth();
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState('live');
  const [createdRawKey, setCreatedRawKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadKeys();
      setCreatedRawKey(null);
    }
  }, [isOpen]);

  const loadKeys = async () => {
    try {
      const data = await api.listApiKeys();
      setKeys(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await api.createApiKey(newKeyName || 'Production Key', newKeyEnv);
      setCreatedRawKey(created.raw_api_key);
      setActiveApiKey(created.raw_api_key);
      setNewKeyName('');
      loadKeys();
    } catch (err) {
      alert(err.message || 'Failed to create key');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!confirm('Are you sure you want to revoke this API key? This cannot be undone.')) return;
    try {
      await api.revokeApiKey(id);
      loadKeys();
    } catch (err) {
      console.error(err);
    }
  };

  const copyCreatedKey = () => {
    if (createdRawKey) {
      navigator.clipboard.writeText(createdRawKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">API Keys Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage secret keys for authenticating with the APIVault Gateway</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Newly created raw key warning banner */}
        {createdRawKey && (
          <div className="my-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 mb-2 font-bold text-xs text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Copy your Secret API Key Now</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2">
              For security, you won't be able to view this full key again. Stored safely using SHA-256 hashing.
            </p>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-950 border border-amber-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400">
              <span className="truncate">{createdRawKey}</span>
              <button
                onClick={copyCreatedKey}
                className="ml-2 px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Generate new key form */}
        <form onSubmit={handleCreate} className="my-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Key Name (e.g. Nagpur Production Key)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <select
            value={newKeyEnv}
            onChange={(e) => setNewKeyEnv(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="live">live</option>
            <option value="test">test</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Generate
          </button>
        </form>

        {/* Keys List */}
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {keys.map((k) => (
            <div key={k.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{k.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    k.environment === 'live' 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                  }`}>
                    {k.environment}
                  </span>
                </div>
                <div className="font-mono text-slate-400 text-[11px] mt-0.5">
                  {k.key_prefix}...••••••••••••
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveApiKey(k.raw_api_key || `${k.key_prefix}example_key_active`);
                    alert(`Activated ${k.name} for the Playground!`);
                  }}
                  className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  Use Key
                </button>
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Revoke Key"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
