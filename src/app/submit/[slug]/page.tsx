"use client";

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Send, CheckCircle2, Loader2, MessageSquareQuote, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Wall {
  id: string;
  name: string;
  settings: {
    theme: 'light' | 'dark';
    accent_color: string;
    border_radius: string;
  };
}

export default function SubmitTestimonial({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [wall, setWall] = useState<Wall | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    author_name: '',
    author_role: '',
    content: '',
    rating: 5
  });

  useEffect(() => {
    async function fetchWall() {
      const { data } = await supabase
        .from('walls')
        .select('id, name, settings')
        .eq('slug', slug)
        .single();

      if (data) setWall(data);
      setLoading(false);
    }
    fetchWall();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wall) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('testimonials')
      .insert([
        {
          wall_id: wall.id,
          author_name: formData.author_name,
          author_role: formData.author_role || null,
          content: formData.content,
          rating: formData.rating,
          is_approved: false 
        }
      ]);

    if (!error) {
      setSubmitted(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  // Helper for dynamic styles
  const isDark = wall?.settings?.theme === 'dark';
  const accentColor = wall?.settings?.accent_color || '#2563eb';
  const borderRadius = wall?.settings?.border_radius || '1.5rem';

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Form...</p>
    </div>
  );

  if (!wall) return (
    <div className={`min-h-screen flex items-center justify-center p-4 text-center ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
      <div className="max-w-md">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-red-950/30 text-red-400' : 'bg-red-50 text-red-500'}`}>
          <MessageSquareQuote size={32} />
        </div>
        <h1 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Wall Not Found</h1>
        <p className="text-gray-500 font-medium mb-8">This link might have expired or the wall was deleted.</p>
        <Link href="/" className="text-sm font-bold hover:underline flex items-center justify-center gap-2" style={{ color: accentColor }}>
           <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );

  if (submitted) return (
    <div className={`min-h-screen flex items-center justify-center p-4 text-center ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
      <div className="max-w-sm w-full space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="w-24 h-24 flex items-center justify-center mx-auto relative z-10" 
               style={{ backgroundColor: `${accentColor}20`, borderRadius: borderRadius }}>
            <CheckCircle2 style={{ color: accentColor }} size={48} />
          </div>
          <div className="absolute inset-0 blur-2xl opacity-30 animate-pulse" 
               style={{ backgroundColor: accentColor, borderRadius: borderRadius }} />
        </div>
        <div>
          <h1 className={`text-4xl font-black mb-3 tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>Review Sent!</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Thanks for sharing your story with <span className={isDark ? 'text-gray-200' : 'text-black'}>{wall.name}</span>. 
            Once approved, it will be live on our Wall of Love.
          </p>
        </div>
        <button 
          onClick={() => setSubmitted(false)}
          className="w-full text-white py-4 font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl"
          style={{ backgroundColor: accentColor, borderRadius: borderRadius }}
        >
          Write Another Review
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-12 md:py-20 px-4 md:px-6 transition-colors duration-300 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FDFDFF]'}`}>
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
            <Star size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Customer Feedback</span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {wall.name}
          </h1>
          <p className="text-gray-500 font-medium text-lg italic">
            "Your feedback helps us grow and serve you better."
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className={`shadow-2xl border transition-all p-8 md:p-12 space-y-10 ${isDark ? 'bg-[#171717] border-[#262626] shadow-black/50' : 'bg-white border-gray-100 shadow-blue-900/5'}`}
          style={{ borderRadius: `calc(${borderRadius} * 1.5)` }}
        >
          
          {/* Rating */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Rating</label>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="group transition-transform active:scale-150"
                >
                  <Star 
                    size={40} 
                    className="transition-all duration-300"
                    style={{ 
                      fill: star <= formData.rating ? accentColor : 'transparent',
                      color: star <= formData.rating ? accentColor : (isDark ? '#333' : '#F3F4F6'),
                      filter: star <= formData.rating ? `drop-shadow(0 0 8px ${accentColor}60)` : 'none'
                    }} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Author Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  className={`w-full p-5 border-2 border-transparent focus:bg-transparent outline-none transition-all font-bold ${isDark ? 'bg-[#222] text-white focus:border-blue-500' : 'bg-gray-50 text-gray-900 focus:border-blue-600'}`}
                  style={{ borderRadius, borderColor: isDark ? '#333' : 'transparent' }}
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Title / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Founder at Acme"
                  className={`w-full p-5 border-2 border-transparent focus:bg-transparent outline-none transition-all font-bold ${isDark ? 'bg-[#222] text-white focus:border-blue-500' : 'bg-gray-50 text-gray-900 focus:border-blue-600'}`}
                  style={{ borderRadius, borderColor: isDark ? '#333' : 'transparent' }}
                  value={formData.author_role}
                  onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Your Story</label>
              <textarea
                required
                rows={5}
                placeholder="What was your experience like?"
                className={`w-full p-5 border-2 border-transparent focus:bg-transparent outline-none transition-all font-medium resize-none ${isDark ? 'bg-[#222] text-white focus:border-blue-500' : 'bg-gray-50 text-gray-900 focus:border-blue-600'}`}
                style={{ borderRadius, borderColor: isDark ? '#333' : 'transparent' }}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-white py-6 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50"
            style={{ backgroundColor: accentColor, borderRadius: `calc(${borderRadius} * 1.5)`, boxShadow: `0 20px 40px ${accentColor}30` }}
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <><Send size={18} /> Submit My Review</>
            )}
          </button>
        </form>
        
        <div className="mt-12 text-center opacity-30 flex items-center justify-center gap-4">
          <div className={`h-[1px] w-12 ${isDark ? 'bg-gray-700' : 'bg-gray-400'}`} />
          <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-gray-400' : 'text-gray-900'}`}>
            Verified by TestimonialWall
          </p>
          <div className={`h-[1px] w-12 ${isDark ? 'bg-gray-700' : 'bg-gray-400'}`} />
        </div>
      </div>
    </div>
  );
}