"use client";

import { useState } from 'react';
import { Copy, Check, Code2, Terminal } from 'lucide-react';

export default function EmbedCode({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `<script 
  src="https://testimonialwall.com/widget.js" 
  data-wall="${slug}" 
  defer
></script>
<div id="testimonial-wall"></div>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-app-bg border border-app-border rounded-2xl overflow-hidden shadow-inner">
        {/* Header / Tab Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-app-border bg-app-fg/[0.03]">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-app-muted" />
            <span className="text-[10px] font-black uppercase tracking-widest text-app-muted">
              HTML Snippet
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
        <div className="p-5 overflow-x-auto font-mono text-xs leading-relaxed">
          <pre className="text-app-fg/80">
            <code className="language-html">
              <span className="text-blue-500">&lt;script</span> <br />
              &nbsp;&nbsp;src=<span className="text-green-600 dark:text-green-400">"https://testimonialwall.com/widget.js"</span> <br />
              &nbsp;&nbsp;data-wall=<span className="text-green-600 dark:text-green-400">"{slug}"</span> <br />
              &nbsp;&nbsp;defer <br />
              <span className="text-blue-500">&gt;&lt;/script&gt;</span> <br />
              <span className="text-blue-500">&lt;div</span> id=<span className="text-green-600 dark:text-green-400">"testimonial-wall"</span><span className="text-blue-500">&gt;&lt;/div&gt;</span>
            </code>
          </pre>
        </div>
      </div>

      <div className="flex items-start gap-3 px-2">
        <div className="mt-1 p-1 bg-blue-600/10 rounded-md">
          <Code2 size={12} className="text-blue-600" />
        </div>
        <p className="text-[10px] text-app-muted font-medium leading-normal">
          Paste this snippet into the <code className="bg-app-fg/5 px-1 rounded">{"<body>"}</code> of your website where you want the wall to appear.
        </p>
      </div>
    </div>
  );
}