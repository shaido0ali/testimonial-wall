"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, X, Loader2 } from 'lucide-react';

export default function CreateWall({ onCreated }: { onCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to create a wall.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('walls')
      .insert([
        { 
          name, 
          slug: slug.toLowerCase().replace(/\s+/g, '-'), 
          user_id: user.id // The "Passport Stamp"
        }
      ]);

    if (error) {
      alert(error.message);
    } else {
      setName('');
      setSlug('');
      setIsOpen(false);
      onCreated();
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
      >
        <Plus size={18} /> Create Wall
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative border border-gray-100">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black mb-6 text-gray-900">New Wall</h2>
            
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Wall Name</label>
                <input 
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  placeholder="e.g. My SaaS Product"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">URL Slug</label>
                <input 
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  placeholder="e.g. my-product"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Create Now"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}