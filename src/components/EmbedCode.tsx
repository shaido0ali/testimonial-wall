"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function EmbedCode({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  
  // The actual code they will paste into their site
  const embedCode = `<iframe 
  src="https://your-domain.com/widget/${slug}" 
  width="100%" 
  height="600px" 
  frameborder="0"
></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono text-gray-400 uppercase">Embed Code</span>
        <button 
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white flex items-center gap-1 text-sm transition"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <pre className="text-sm text-blue-300 overflow-x-auto p-2 bg-black/30 rounded">
        {embedCode}
      </pre>
      <p className="text-xs text-gray-500 mt-2">
        * Paste this anywhere in your website's HTML where you want the wall to appear.
      </p>
    </div>
  );
}