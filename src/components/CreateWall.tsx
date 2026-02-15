"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, X, Loader2, Sparkles, Globe } from 'lucide-react';

export default function CreateWall({ onCreated }: { onCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

    const { error } = await supabase.from('walls').insert([
      { name, slug, user_id: user?.id }
    ]);

    if (!error) {
      setName('');
      setIsOpen(false);
      onCreated();
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
      >
        <Plus size={18} /> Create New Wall
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-app-card border border-app-border rounded-[2.5rem] shadow-2xl p-8 md:p-10 overflow-hidden">
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles size={80} className="text-blue-600" />
            </div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tight mb-2">Create a Wall</h2>
                <p className="text-app-muted text-sm font-medium">This is where your reviews will live.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-app-bg rounded-full text-app-muted transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-app-muted ml-1">
                  Wall Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Awesome SaaS"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-app-fg"
                  required
                  autoFocus
                />
              </div>

              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl flex items-start gap-3">
                <Globe className="text-blue-600 mt-0.5" size={16} />
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Public URL Preview</p>
                  <p className="text-xs font-mono text-app-muted truncate mt-1">
                    testimonialwall.com/submit/{name.toLowerCase().replace(/ /g, '-') || 'your-slug'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-sm text-app-muted hover:bg-app-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-app-fg text-app-bg hover:opacity-90 px-6 py-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Launch Wall"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}