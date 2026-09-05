import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Clock, Key, AlertCircle, CheckCircle2, ChevronDown, Layers } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CodeSnippetGenerator from './CodeSnippetGenerator';

export default function ApiPlayground({ selectedApi, onClose }) {
  const { activeApiKey } = useAuth();
  const [selectedEndpoint, setSelectedEndpoint] = useState(selectedApi.endpoints[0] || {});
  const [requestBody, setRequestBody] = useState('');
  const [customKey, setCustomKey] = useState(activeApiKey || 'vault_live_ashish_998271049102');
  const [loading, setLoading] = useState(false);
  const [responseResult, setResponseResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('response'); // response, snippets, headers

  useEffect(() => {
    if (selectedEndpoint?.request_body_json) {
      try {
        const parsed = JSON.parse(selectedEndpoint.request_body_json);
        setRequestBody(JSON.stringify(parsed, null, 2));
      } catch {
        setRequestBody(selectedEndpoint.request_body_json);
      }
    } else {
      setRequestBody('{}');
    }
    setResponseResult(null);
    setErrorMsg(null);
  }, [selectedEndpoint]);

  const handleExecute = async () => {
    setLoading(true);
    setErrorMsg(null);
    setResponseResult(null);

    let parsedBody = {};
    if (selectedEndpoint.http_method !== 'GET') {
      try {
        parsedBody = JSON.parse(requestBody);
      } catch (err) {
        setErrorMsg('Invalid JSON format in Request Body.');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await api.executeGatewayCall(
        selectedApi.slug,
        selectedEndpoint.path,
        selectedEndpoint.http_method,
        parsedBody,
        customKey
      );
      setResponseResult(res);
      setActiveTab('response');
    } catch (err) {
      setErrorMsg(err.message || 'Gateway execution failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetBody = () => {
    if (selectedEndpoint?.request_body_json) {
      try {
        setRequestBody(JSON.stringify(JSON.parse(selectedEndpoint.request_body_json), null, 2));
      } catch {
        setRequestBody(selectedEndpoint.request_body_json);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 shadow-2xl overflow-hidden">
      {/* Playground Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-devDark-950/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">
              {selectedApi.name}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Interactive Playground
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Send live requests through the APIVault Gateway to test parameters, headers, and schemas.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close Playground
          </button>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Request Configuration (7 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Endpoint Bar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-mono">
              Endpoint Route
            </label>
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 overflow-hidden font-mono text-xs">
              <span className={`px-3 py-2.5 font-bold flex items-center ${
                selectedEndpoint.http_method === 'GET' 
                  ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' 
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              }`}>
                {selectedEndpoint.http_method}
              </span>
              <select
                value={selectedEndpoint.path}
                onChange={(e) => {
                  const ep = selectedApi.endpoints.find(x => x.path === e.target.value);
                  if (ep) setSelectedEndpoint(ep);
                }}
                className="w-full px-3 py-2.5 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {selectedApi.endpoints.map(ep => (
                  <option key={ep.id} value={ep.path} className="dark:bg-devDark-900">
                    {ep.path} — {ep.summary}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-500" />
                Authentication Header (X-APIVault-Key)
              </label>
            </div>
            <input
              type="text"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="vault_live_..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Request Body JSON Editor */}
          {selectedEndpoint.http_method !== 'GET' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  JSON Request Body
                </label>
                <button
                  onClick={handleResetBody}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Payload
                </button>
              </div>
              <textarea
                rows={9}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
                placeholder="{ ... }"
              />
            </div>
          )}

          {/* Execute Action */}
          <button
            onClick={handleExecute}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Routing through Gateway...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Execute Request ⚡</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* Right Col: Live Response & Snippets (6 cols) */}
        <div className="lg:col-span-6 flex flex-col">
          
          {/* Subtabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
            <button
              onClick={() => setActiveTab('response')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'response'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Response Payload
            </button>
            <button
              onClick={() => setActiveTab('snippets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'snippets'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Code Snippets
            </button>
          </div>

          {activeTab === 'response' ? (
            <div className="flex-1 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden font-mono text-xs">
              
              {/* Response Status Bar */}
              <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 uppercase font-bold">STATUS:</span>
                  {responseResult ? (
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      responseResult.status === 200
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {responseResult.status} {responseResult.statusText}
                    </span>
                  ) : (
                    <span className="text-slate-500">Awaiting execution...</span>
                  )}
                </div>

                {responseResult && (
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{responseResult.latencyMs} ms</span>
                  </div>
                )}
              </div>

              {/* JSON Viewer */}
              <div className="p-4 flex-1 overflow-auto max-h-[380px]">
                {responseResult ? (
                  <pre className="text-emerald-300 text-xs leading-relaxed whitespace-pre">
                    {JSON.stringify(responseResult.data, null, 2)}
                  </pre>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-center p-4">
                    <Layers className="w-8 h-8 text-slate-600 mb-2" />
                    <p>Click "Execute Request ⚡" to send a live query through the APIVault Gateway.</p>
                  </div>
                )}
              </div>

              {/* Gateway Meta Footer */}
              {responseResult?.data?._gateway_meta && (
                <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500">Monthly Quota: </span>
                    <span className="text-slate-200 font-bold">
                      {responseResult.data._gateway_meta.monthly_quota_used} / {responseResult.data._gateway_meta.monthly_quota_total}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Rate Limit: </span>
                    <span className="text-emerald-400 font-bold">
                      {responseResult.data._gateway_meta.rate_limit_per_min} req/min
                    </span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex-1">
              <CodeSnippetGenerator
                apiSlug={selectedApi.slug}
                endpoint={selectedEndpoint}
                apiKey={customKey}
                bodyPayload={requestBody}
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
