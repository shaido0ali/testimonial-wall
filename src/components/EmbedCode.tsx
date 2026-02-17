"use client";

import { useState, useEffect } from 'react';
import { Copy, Check, Code2, Sparkles } from 'lucide-react';

export default function EmbedCode({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('https://testimonialwall.com');

  // Set the base URL only on the client to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const widgetUrl = `${baseUrl}/widget/${slug}`;

  // FIX: We split the script tags into pieces so the Next.js parser doesn't crash
  const sOpen = '<' + 'script' + '>';
  const sClose = '<' + '/' + 'script' + '>';

  // This is the Smart Snippet string that will be displayed and copied
  const smartSnippet = `<div id="tw-root-${slug}"></div>
${sOpen}
  (function() {
    const container = document.getElementById('tw-root-${slug}');
    const iframe = document.createElement('iframe');
    iframe.src = "${widgetUrl}";
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.style.background = "transparent";
    iframe.scrolling = "no";
    
    // Listen for the height from the widget layout for auto-resizing
    window.addEventListener('message', function(e) {
      if (e.data.type === 'resize' && e.origin === '${baseUrl}') {
        iframe.style.height = e.data.height + 'px';
      }
    }, false);

    container.appendChild(iframe);
  })();
${sClose}`;

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(smartSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-app-bg border border-app-border rounded-2xl overflow-hidden shadow-sm">
        {/* Header / Tab Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-app-border bg-app-fg/[0.03]">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-app-muted">
              Smart Auto-Resizing Snippet
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-app-fg hover:text-app-bg transition-all duration-200"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-500" />
                <span className="text-[10px] font-bold text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span className="text-[10px] font-bold">Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block Container */}
        <div className="p-5 overflow-x-auto font-mono text-[11px] leading-relaxed bg-app-card/30">
          <pre className="text-app-fg/80 whitespace-pre-wrap break-all">
            {smartSnippet}
          </pre>
        </div>
      </div>

      {/* Feature Badge */}
      <div className="flex items-start gap-3 px-2">
        <div className="mt-1 p-1 bg-blue-600/10 rounded-md">
          <Code2 size={12} className="text-blue-600" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-app-muted font-medium leading-normal">
            <strong>Pro Feature:</strong> This script uses the <code>postMessage</code> API to sync height between your site and the wall.
          </p>
          <p className="text-[10px] text-blue-500/70 font-bold uppercase tracking-tight">
            No Scrollbars • No Layout Shift • Fast Load
          </p>
        </div>
      </div>
    </div>
  );
}