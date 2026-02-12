import React from 'react';

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* The 'jsx' attribute on the style tag works if you have styled-jsx installed (standard in Next.js).
        If not, we use a standard 'dangerouslySetInnerHTML' to inject the reset.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: transparent !important;
          background-image: none !important;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        /* Ensure the Next.js root div is also transparent */
        #__next {
          background-color: transparent !important;
        }
      `}} />
      
      <main className="bg-transparent">
        {children}
      </main>
    </section>
  );
}