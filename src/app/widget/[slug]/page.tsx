"use client";

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Quote, Loader2 } from 'lucide-react';

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number;
}

export default function Widget({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovedTestimonials() {
      // 1. Get the wall ID first via the slug
      const { data: wall } = await supabase
        .from('walls')
        .select('id')
        .eq('slug', slug)
        .single();

      if (wall) {
        // 2. Fetch only APPROVED testimonials for this wall
        const { data } = await supabase
          .from('testimonials')
          .select('id, author_name, author_role, content, rating')
          .eq('wall_id', wall.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (data) setTestimonials(data);
      }
      setLoading(false);
    }
    fetchApprovedTestimonials();
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center p-10">
      <Loader2 className="animate-spin text-blue-500" />
    </div>
  );

  if (testimonials.length === 0) return null; // Hide the widget if nothing is approved

  return (
    <div className="bg-transparent p-4 font-sans text-black">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {testimonials.map((t) => (
          <div 
            key={t.id} 
            className="break-inside-avoid bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                />
              ))}
            </div>

            <div className="relative">
              <Quote className="absolute -top-2 -left-2 text-blue-50 opacity-20" size={40} />
              <p className="text-gray-700 leading-relaxed relative z-10 text-sm italic">
                "{t.content}"
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="font-bold text-gray-900 text-sm">{t.author_name}</p>
              {t.author_role && (
                <p className="text-xs text-gray-400 font-medium mt-0.5 uppercase tracking-wide">
                  {t.author_role}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}