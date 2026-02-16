import React from 'react';

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* We target the tags directly since they exist in the root layout */
        html, body {
          background-color: transparent !important;
          background-image: none !important;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        /* Hide scrollbars */
        ::-webkit-scrollbar {
          display: none;
        }
        
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      
      <main id="widget-root" className="bg-transparent">
        {children}
      </main>

      <script dangerouslySetInnerHTML={{ __html: `
        function sendHeight() {
          const root = document.getElementById('widget-root');
          if (!root) return;
          const height = root.scrollHeight;
          window.parent.postMessage({ type: 'resize', height: height }, '*');
        }
        window.addEventListener('load', sendHeight);
        window.addEventListener('resize', sendHeight);
        const observer = new MutationObserver(sendHeight);
        observer.observe(document.body, { childList: true, subtree: true });
      `}} />
    </>
  );
}