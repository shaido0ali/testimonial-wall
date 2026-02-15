"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LayoutDashboard, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-fg flex flex-col transition-colors duration-300">
      
      {/* Simple Header */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" size={28} />
          <span className="font-black text-2xl tracking-tighter">TestimonialWall</span>
        </div>
        <ThemeToggle />
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-app-card border border-app-border rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
          
          {/* Background Decorative Glow (Dark Mode Only) */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full hidden dark:block" />

          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome back</h2>
            <p className="text-app-muted text-sm mb-8 font-medium">Log in to manage your social proof</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-app-muted ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-app-muted ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {message && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group mt-6"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-app-muted text-xs font-medium">
              Don't have an account? <a href="/signup" className="text-blue-600 hover:underline font-bold">Create one for free</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <footer className="p-8 text-center text-app-muted text-[10px] font-black uppercase tracking-[0.2em]">
        © 2026 TestimonialWall Inc.
      </footer>
    </div>
  );
}