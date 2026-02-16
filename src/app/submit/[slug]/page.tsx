"use client";

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Send, CheckCircle2, Loader2, MessageSquareQuote, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Wall {
  id: string;
  name: string;
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
        .select('id, name')
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

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Form...</p>
    </div>
  );

  if (!wall) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 text-center">
      <div className="max-w-md">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageSquareQuote size={32} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Wall Not Found</h1>
        <p className="text-gray-500 font-medium mb-8">This link might have expired or the wall was deleted.</p>
        <Link href="/" className="text-sm font-bold text-blue-600 hover:underline flex items-center justify-center gap-2">
           <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 text-center">
      <div className="max-w-sm w-full space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="bg-green-100 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto relative z-10">
            <CheckCircle2 className="text-green-600" size={48} />
          </div>
          <div className="absolute inset-0 bg-green-200 rounded-[2.5rem] blur-2xl opacity-50 animate-pulse" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Review Sent!</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Thanks for sharing your story with <span className="text-black font-bold">{wall.name}</span>. 
            Once approved, it will be live on our Wall of Love.
          </p>
        </div>
        <button 
          onClick={() => setSubmitted(false)}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
        >
          Write Another Review
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-600/5 text-blue-600 px-4 py-2 rounded-full mb-6">
            <Star size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Customer Feedback</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            {wall.name}
          </h1>
          <p className="text-gray-500 font-medium text-lg italic">
            "Your feedback helps us grow and serve you better."
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-8 md:p-12 space-y-10">
          
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
                    className={`transition-all duration-300 ${
                      star <= formData.rating 
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]" 
                      : "text-gray-100 group-hover:text-gray-200"
                    }`} 
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
                  className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none transition-all font-bold"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Title / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Founder at Acme"
                  className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none transition-all font-bold"
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
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none transition-all font-medium resize-none"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-[0.97] transition-all shadow-2xl shadow-blue-600/30 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <><Send size={18} /> Submit My Review</>
            )}
          </button>
        </form>
        
        <div className="mt-12 text-center opacity-30 flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-gray-400" />
          <p className="text-[9px] font-black text-gray-900 uppercase tracking-[0.4em]">
            Verified by TestimonialWall
          </p>
          <div className="h-[1px] w-12 bg-gray-400" />
        </div>
      </div>
    </div>
  );
}