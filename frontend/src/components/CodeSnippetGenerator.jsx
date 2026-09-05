import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeSnippetGenerator({ apiSlug, endpoint, apiKey, bodyPayload }) {
  const [activeLang, setActiveLang] = useState('python');
  const [copied, setCopied] = useState(false);

  const cleanPath = endpoint.path.startsWith('/') ? endpoint.path.slice(1) : endpoint.path;
  const fullUrl = `https://apivault-india.vercel.app/api/gateway/${apiSlug}/${cleanPath}`;
  const key = apiKey || 'vault_live_ashish_998271049102';

  const snippets = {
    python: `# Python (requests)
import requests

url = "${fullUrl}"
headers = {
    "X-APIVault-Key": "${key}",
    "Content-Type": "application/json"
}
payload = ${bodyPayload || "{}"}

response = requests.${endpoint.http_method.toLowerCase()}(url, headers=headers, json=payload)
print("Status:", response.status_code)
print(response.json())`,

    javascript: `// JavaScript (Fetch / Node.js)
const response = await fetch("${fullUrl}", {
  method: "${endpoint.http_method}",
  headers: {
    "X-APIVault-Key": "${key}",
    "Content-Type": "application/json"
  },
  body: ${endpoint.http_method !== 'GET' ? `JSON.stringify(${bodyPayload || "{}"})` : 'undefined'}
});

const data = await response.json();
console.log(data);`,

    curl: `# cURL
curl -X ${endpoint.http_method} "${fullUrl}" \\
  -H "X-APIVault-Key: ${key}" \\
  -H "Content-Type: application/json"${endpoint.http_method !== 'GET' ? ` \\
  -d '${bodyPayload ? bodyPayload.replace(/\n/g, '').replace(/\s+/g, ' ') : '{}'}'` : ''}`
  };

  const copyCode = () => {
    navigator.clipboard.writeText(snippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden font-mono text-xs">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {['python', 'javascript', 'curl'].map(lang => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-2.5 py-1 rounded text-[11px] uppercase font-bold tracking-wider transition-colors ${
                activeLang === lang
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Viewer */}
      <div className="p-4 overflow-x-auto max-h-56">
        <pre className="text-slate-300 whitespace-pre leading-relaxed">
          {snippets[activeLang]}
        </pre>
      </div>
    </div>
  );
}
