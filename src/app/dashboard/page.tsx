"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import EmbedCode from '@/components/EmbedCode';
import CreateWall from '@/components/CreateWall';
import StyleEditor from '@/components/StyleEditor';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ExternalLink, 
  Loader2, 
  LogOut, 
  Trash2, 
  Star,
  Settings,
  ShieldCheck,
  Plus,
  Eye,
  PenLine
} from 'lucide-react';

interface Testimonial { 
  id: string; 
  wall_id: string; 
  author_name: string; 
  content: string; 
  rating: number; 
  is_approved: boolean; 
}

interface Wall { 
  id: string; 
  name: string; 
  slug: string; 
}

export default function Dashboard() {
  const [walls, setWalls] = useState<Wall[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
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
    const { data: wallsData } = await supabase
      .from('walls')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (wallsData) {
      setWalls(wallsData);
      const wallIds = wallsData.map(w => w.id);
      if (wallIds.length > 0) {
        const { data: testData } = await supabase
          .from('testimonials')
          .select('*')
          .in('wall_id', wallIds)
          .order('created_at', { ascending: false });
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const deleteWall = async (id: string) => {
    if (!confirm("Delete this wall? All reviews within it will be permanently removed.")) return;
    const { error } = await supabase.from('walls').delete().eq('id', id);
    if (!error) {
      setWalls(prev => prev.filter(w => w.id !== id));
      setTestimonials(prev => prev.filter(t => t.wall_id !== id));
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_approved: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      setTestimonials(prev => prev.map(t => 
        t.id === id ? { ...t, is_approved: !currentStatus } : t
      ));
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-app-bg transition-colors">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-app-muted font-black text-xs uppercase tracking-widest">Syncing Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-app-bg text-app-fg transition-colors duration-300">
      <nav className="sticky top-0 z-40 w-full bg-app-bg/80 backdrop-blur-md border-b border-app-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" size={24} />
            <span className="font-black text-xl tracking-tighter">TestimonialWall</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={handleSignOut} className="p-2 text-app-muted hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Dashboard</h1>
            <p className="text-app-muted font-medium">You have {walls.length} active social proof walls.</p>
          </div>
          <CreateWall onCreated={fetchData} />
        </div>

        {walls.length === 0 ? (
          <div className="bg-app-card border-2 border-dashed border-app-border rounded-[3rem] p-12 md:p-24 text-center">
            <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="text-blue-600" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">No walls created yet</h2>
            <p className="text-app-muted font-medium mb-8 max-w-xs mx-auto">Create your first wall to start collecting customer testimonials.</p>
            <CreateWall onCreated={fetchData} />
          </div>
        ) : (
          walls.map(wall => (
            <div key={wall.id} className="bg-app-card rounded-[2.5rem] border border-app-border mb-12 overflow-hidden shadow-sm group/wall transition-all hover:shadow-xl hover:shadow-blue-600/5">
              
              {/* Wall Header */}
              <div className="p-6 md:px-10 md:py-8 border-b border-app-border flex justify-between items-center bg-app-fg/[0.02]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight">{wall.name}</h2>
                    <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Live</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/wall/${wall.slug}`} target="_blank" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity">
                      <Eye size={12} /> View Wall
                    </Link>
                    <span className="text-app-border">|</span>
                    <Link href={`/submit/${wall.slug}`} target="_blank" className="text-[10px] font-black text-app-muted uppercase tracking-widest flex items-center gap-1 hover:text-app-fg transition-colors">
                      <PenLine size={12} /> Submission Link
                    </Link>
                  </div>
                </div>
                <button 
                  onClick={() => deleteWall(wall.id)} 
                  className="p-3 text-app-muted hover:text-red-600 hover:bg-red-500/10 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Column: Config & Live Preview */}
                <div className="space-y-8">
                  {/* LIVE PREVIEW SECTION */}
                  <section className="bg-app-bg rounded-3xl p-5 border border-app-border">
                    <h3 className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <LayoutDashboard size={14} /> Live Wall Preview
                    </h3>
                    <div className="aspect-video bg-app-card rounded-2xl border border-app-border overflow-hidden relative group/preview shadow-inner">
                      <iframe 
                        src={`/wall/${wall.slug}`} 
                        className="w-[300%] h-[300%] origin-top-left scale-[0.333] pointer-events-none opacity-80"
                        title="Wall Preview"
                      />
                      <div className="absolute inset-0 bg-transparent flex items-center justify-center group-hover/preview:bg-black/5 transition-colors">
                        <Link href={`/wall/${wall.slug}`} target="_blank" className="opacity-0 group-hover/preview:opacity-100 bg-white text-black text-[9px] font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 transition-all">
                          Open Full Wall <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Settings size={14} /> Embed Widget
                    </h3>
                    <EmbedCode slug={wall.slug} />
                  </section>
                </div>

                {/* Right Column: Moderation */}
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">Customer Submissions</h3>
                    <span className="text-[10px] font-bold text-app-muted">
                      {testimonials.filter(t => t.wall_id === wall.id).length} Reviews
                    </span>
                  </div>

                  <div className="space-y-4">
                    {testimonials.filter(t => t.wall_id === wall.id).length === 0 ? (
                      <div className="py-16 text-center border-2 border-dashed border-app-border rounded-3xl bg-app-bg/50">
                         <p className="text-sm text-app-muted font-medium italic">Waiting for your first review...</p>
                      </div>
                    ) : (
                      testimonials.filter(t => t.wall_id === wall.id).map(t => (
                        <div key={t.id} className="group/item flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-app-bg rounded-3xl border border-app-border hover:border-blue-500/30 transition-all gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-bold text-app-fg">{t.author_name}</p>
                              <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-lg">
                                <Star size={10} className="fill-current"/> 
                                <span className="text-[10px] font-black ml-1">{t.rating}</span>
                              </div>
                              {t.is_approved && (
                                <span className="bg-green-500/10 text-green-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter">Approved</span>
                              )}
                            </div>
                            <p className="text-sm text-app-muted leading-relaxed italic line-clamp-3">"{t.content}"</p>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-app-border">
                            <button 
                              onClick={() => toggleApproval(t.id, t.is_approved)}
                              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                t.is_approved 
                                ? 'bg-app-card text-app-muted hover:text-red-500 border border-app-border shadow-sm' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                              }`}
                            >
                              {t.is_approved ? 'Hide' : 'Approve'}
                            </button>
                            <button 
                              onClick={() => deleteTestimonial(t.id)} 
                              className="p-2 text-app-muted hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"
                            >
                              <Trash2 size={18}/>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
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