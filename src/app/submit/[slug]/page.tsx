"use client";

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Send, CheckCircle2, Loader2, MessageSquareQuote } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  if (!wall) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black p-4 text-center">
      <div>
        <h1 className="text-xl font-bold">Wall not found</h1>
        <p className="text-gray-500">The link you followed might be broken.</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 text-black text-center">
      <div className="max-w-sm w-full animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600" size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Success!</h1>
        <p className="text-gray-600 font-medium px-4">
          Your review for <span className="text-black font-bold">{wall.name}</span> has been sent for moderation.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-8 bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition"
        >
          Send Another
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 md:px-6 text-black">
      <div className="max-w-xl mx-auto">
        
        {/* Header - Scaled for mobile */}
        <div className="text-center mb-8 md:mb-10">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <MessageSquareQuote className="text-white" size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Leave a Review</h1>
          <p className="text-gray-500 font-bold italic text-sm">for {wall.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 space-y-6 md:space-y-8">
          
          {/* Large Touch-Friendly Rating Selector */}
          <div className="text-center md:text-left">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">How would you rate us?</label>
            <div className="flex justify-center md:justify-start gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 transition-transform active:scale-125 focus:outline-none"
                >
                  <Star 
                    size={36} 
                    className={star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields - Mobile First Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="Jane Doe"
                className="w-full p-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition text-base"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role / Company</label>
              <input
                type="text"
                placeholder="CEO at Acme"
                className="w-full p-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition text-base"
                value={formData.author_role}
                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
            <textarea
              required
              rows={4}
              placeholder="Tell the world why you love us..."
              className="w-full p-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition resize-none text-base"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <><Send size={20} /> Submit Review</>
            )}
          </button>
        </form>
        
        <p className="text-center text-gray-300 text-[10px] mt-8 font-black uppercase tracking-widest">
          Powered by TestimonialWall
        </p>
      </div>
    </div>
  );
}