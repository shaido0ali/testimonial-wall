"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import EmbedCode from '@/components/EmbedCode';
import CreateWall from '@/components/CreateWall';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  LayoutDashboard, ExternalLink, Loader2, LogOut, 
  Trash2, MapPin, Star, Settings 
} from 'lucide-react';

export default function Dashboard() {
  const [walls, setWalls] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) window.location.href = '/login';
    };
    checkSession();
  }, []);

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setLoading(true);
    const { data: wallsData } = await supabase.from('walls').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (wallsData) {
      setWalls(wallsData);
      const wallIds = wallsData.map(w => w.id);
      if (wallIds.length > 0) {
        const { data: testData } = await supabase.from('testimonials').select('*').in('wall_id', wallIds).order('created_at', { ascending: false });
        if (testData) setTestimonials(testData);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, [fetchData]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-app-bg">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-app-bg text-app-fg transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-app-bg/80 backdrop-blur-md border-b border-app-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" size={24} />
            <span className="font-black text-xl tracking-tighter">TestimonialWall</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => supabase.auth.signOut().then(() => window.location.href='/login')} className="p-2 text-app-muted hover:text-red-500 transition">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">Dashboard</h1>
            <p className="text-app-muted text-sm font-medium">Manage your social proof walls</p>
          </div>
          <CreateWall onCreated={fetchData} />
        </div>

        {walls.length === 0 ? (
          <div className="bg-app-card border-2 border-dashed border-app-border rounded-[2.5rem] p-10 md:p-20 text-center">
            <p className="text-app-muted font-medium mb-6">No walls yet. Start by creating one!</p>
            <CreateWall onCreated={fetchData} />
          </div>
        ) : (
          walls.map(wall => (
            <div key={wall.id} className="bg-app-card rounded-[2rem] border border-app-border mb-10 overflow-hidden shadow-sm">
              
              {/* Card Header */}
              <div className="p-6 border-b border-app-border flex justify-between items-center bg-app-fg/[0.02]">
                <div>
                  <h2 className="text-xl font-black">{wall.name}</h2>
                  <a href={`/submit/${wall.slug}`} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold mt-1">
                    Submission Link <ExternalLink size={12}/>
                  </a>
                </div>
                <button className="text-app-muted hover:text-red-500 transition"><Trash2 size={20}/></button>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Controls */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Settings size={14} /> Widget
                    </h3>
                    <EmbedCode slug={wall.slug} />
                  </div>
                </div>

                {/* Submissions List */}
                <div className="lg:col-span-2">
                  <h3 className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-4">Latest Reviews</h3>
                  <div className="space-y-4">
                    {testimonials.filter(t => t.wall_id === wall.id).map(t => (
                      <div key={t.id} className="p-5 bg-app-bg rounded-2xl border border-app-border flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold">{t.author_name}</p>
                          <p className="text-xs text-app-muted italic">"{t.content}"</p>
                        </div>
                        <div className="flex gap-2">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${t.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {t.is_approved ? 'Live' : 'Pending'}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}