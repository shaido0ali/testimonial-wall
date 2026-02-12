// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-5xl text-gray-900 font-extrabold mb-6">Testimonial Wall</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        The easiest way to collect and display social proof on your website.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}