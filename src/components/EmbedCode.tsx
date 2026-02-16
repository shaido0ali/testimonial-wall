"use client";

import { useState, useEffect } from 'react';
import { Copy, Check, Code2, Terminal, Sparkles } from 'lucide-react';

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

  // This is the Smart Snippet that includes the resizing logic
  const smartSnippet = `<div id="tw-root-${slug}"></div>
<script>
  (function() {
    const container = document.getElementById('tw-root-${slug}');
    const iframe = document.createElement('iframe');
    iframe.src = "${widgetUrl}";
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.style.background = "transparent";
    iframe.scrolling = "no";
    
    // Listen for the height from the widget layout
    window.addEventListener('message', function(e) {
      if (e.data.type === 'resize' && e.origin === '${baseUrl}') {
        iframe.style.height = e.data.height + 'px';
      }
    }, false);

    container.appendChild(iframe);
  })();
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(smartSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-app-fg hover:text-app-bg transition-all duration-200"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-500" />
                <span className="text-[10px] font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span className="text-[10px] font-bold">Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block */}
        <div className="p-5 overflow-x-auto font-mono text-[11px] leading-relaxed bg-app-card/30">
          <pre className="text-app-fg/80">
            <code>
              <span className="text-gray-400">&lt;!-- Social Proof Widget --&gt;</span><br/>
              <span className="text-blue-500">&lt;div</span> id="tw-root-{slug}"<span className="text-blue-500">&gt;&lt;/div&gt;</span><br/>
              <span className="text-blue-500">&lt;script&gt;</span><br/>
              &nbsp;&nbsp;(function() {'{'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;const container = document.getElementById('tw-root-{slug}');<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;const iframe = document.createElement('iframe');<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;iframe.src = <span className="text-green-600">"{widgetUrl}"</span>;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;... (auto-resize logic) ...<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;container.appendChild(iframe);<br/>
              &nbsp;&nbsp;{'}'})();<br/>
              <span className="text-blue-500">&lt;/script&gt;</span>
            </code>
          </pre>
        </div>
      </div>

      <div className="flex items-start gap-3 px-2">
        <div className="mt-1 p-1 bg-blue-600/10 rounded-md">
          <Code2 size={12} className="text-blue-600" />
        </div>
        <p className="text-[10px] text-app-muted font-medium leading-normal">
          This script injects a transparent wall that <strong>automatically adjusts its height</strong>. No double scrollbars, no fixed heights.
        </p>
      </div>
    </div>
  );
}