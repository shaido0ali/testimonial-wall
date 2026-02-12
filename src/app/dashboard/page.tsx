"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import EmbedCode from '@/components/EmbedCode';
import CreateWall from '@/components/CreateWall';
import { 
  LayoutDashboard, 
  ExternalLink, 
  Loader2, 
  LogOut, 
  Trash2, 
  RefreshCw, 
  MapPin,
  Star
} from 'lucide-react';

interface Testimonial { id: string; wall_id: string; author_name: string; content: string; rating: number; is_approved: boolean; }
interface Wall { id: string; name: string; slug: string; }

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
    
    // Fetch only MY walls
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
    if (!confirm("Delete this wall? All data will be lost.")) return;
    const { error } = await supabase.from('walls').delete().eq('id', id);
    if (!error) {
      setWalls(prev => prev.filter(w => w.id !== id));
      setTestimonials(prev => prev.filter(t => t.wall_id !== id));
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('testimonials').update({ is_approved: !currentStatus }).eq('id', id);
    if (!error) {
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_approved: !currentStatus } : t));
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Responsive Header: Stacks on mobile, side-by-side on tablet+ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              <LayoutDashboard className="text-blue-600" /> Dashboard
            </h1>
            <p className="text-gray-500 text-sm hidden sm:block font-medium">Manage your social proof walls</p>
          </div>
          <div className="flex w-full sm:w-auto gap-2 md:gap-3">
            <CreateWall onCreated={fetchData} />
            <button 
              onClick={handleSignOut} 
              className="flex-1 sm:flex-none bg-white border px-4 py-2.5 rounded-2xl hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center gap-2 font-bold shadow-sm text-sm"
            >
              <LogOut size={18} /> <span className="sm:hidden lg:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {walls.length === 0 ? (
          <div className="bg-white border-2 border-dashed rounded-[2rem] md:rounded-[2.5rem] p-10 md:p-20 text-center">
            <p className="text-gray-400 font-medium mb-4">No walls found. Start by creating one!</p>
            <CreateWall onCreated={fetchData} />
          </div>
        ) : (
          walls.map(wall => (
            <div key={wall.id} className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 mb-6 md:mb-10 overflow-hidden relative group">
              
              {/* Wall Card Header */}
              <div className="p-5 md:p-8 border-b border-gray-50 flex justify-between items-center">
                <div className="min-w-0 pr-2">
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 truncate">{wall.name}</h2>
                  <a href={`/submit/${wall.slug}`} target="_blank" className="text-[10px] md:text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold mt-1">
                    Public Link <ExternalLink size={12}/>
                  </a>
                </div>
                <button 
                  onClick={() => deleteWall(wall.id)} 
                  className="p-2 text-gray-200 hover:text-red-600 transition shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Grid: 1 column on mobile, 3 columns on desktop */}
              <div className="p-5 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                
                {/* Left Section: Controls */}
                <div className="lg:col-span-1 space-y-6 md:space-y-8">
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Display Widget</h3>
                    <div className="max-w-full overflow-hidden">
                        <EmbedCode slug={wall.slug} />
                    </div>
                  </div>

                  {/* Google Sync Placeholder */}
                  <div className="p-5 md:p-6 bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                      <span className="bg-black text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Coming Soon</span>
                    </div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MapPin size={14} /> Google Sync
                    </h3>
                    <div className="space-y-3 opacity-30 grayscale">
                      <div className="w-full h-10 bg-gray-200 rounded-xl" />
                      <div className="w-full h-10 bg-blue-100 rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Right Section: Submissions */}
                <div className="lg:col-span-2">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Latest Submissions</h3>
                  <div className="space-y-3 md:space-y-4">
                    {testimonials.filter(t => t.wall_id === wall.id).length === 0 ? (
                      <p className="text-sm text-gray-300 italic py-4">Waiting for reviews...</p>
                    ) : (
                      testimonials.filter(t => t.wall_id === wall.id).map(t => (
                        <div key={t.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-5 bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:border-blue-100 transition-all gap-4">
                          <div className="flex-1 pr-0 sm:pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold text-gray-900">{t.author_name}</p>
                              <div className="flex text-yellow-400">
                                <Star size={10} className="fill-current"/> 
                                <span className="text-[10px] font-bold ml-1">{t.rating}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 italic">"{t.content}"</p>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                            <button 
                              onClick={() => toggleApproval(t.id, t.is_approved)}
                              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase transition shadow-sm ${
                                t.is_approved ? 'bg-gray-100 text-gray-400 hover:text-red-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {t.is_approved ? 'Hide' : 'Approve'}
                            </button>
                            <button 
                              onClick={() => deleteTestimonial(t.id)} 
                              className="p-2 text-gray-300 hover:text-red-600 transition"
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