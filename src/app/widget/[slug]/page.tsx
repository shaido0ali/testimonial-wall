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
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWidgetData() {
      // 1. Get the wall settings AND id via the slug
      const { data: wall } = await supabase
        .from('walls')
        .select('id, settings')
        .eq('slug', slug)
        .single();

      if (wall) {
        setSettings(wall.settings);

        // 2. Fetch only APPROVED testimonials
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
    fetchWidgetData();
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="animate-spin text-blue-500" />
    </div>
  );

  if (testimonials.length === 0) return null;

  // Use settings from DB or fallback to defaults
  const theme = settings?.theme || 'light';
  const accentColor = settings?.accent_color || '#2563eb';
  const borderRadius = settings?.border_radius || '1rem';
  const isDark = theme === 'dark';

  return (
    <div className={`bg-transparent p-4 font-sans ${isDark ? 'dark' : ''}`}>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {testimonials.map((t) => (
          <div 
            key={t.id} 
            className={`break-inside-avoid p-6 shadow-sm border transition-all duration-300 group hover:shadow-md ${
              isDark 
                ? 'bg-[#171717] border-[#262626] text-white' 
                : 'bg-white border-gray-100 text-gray-900'
            }`}
            style={{ borderRadius: borderRadius }}
          >
            {/* Dynamic Star Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  style={{ 
                    color: i < t.rating ? accentColor : (isDark ? '#262626' : '#E5E7EB'),
                    fill: i < t.rating ? accentColor : 'transparent'
                  }} 
                />
              ))}
            </div>

            {/* Content with Dynamic Quote Icon */}
            <div className="relative">
              <Quote 
                className="absolute -top-2 -left-2 opacity-10" 
                size={40} 
                style={{ color: accentColor }} 
              />
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed relative z-10 text-sm italic`}>
                "{t.content}"
              </p>
            </div>

            {/* Author Section */}
            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-[#262626]' : 'border-gray-50'}`}>
              <p className="font-bold text-sm">{t.author_name}</p>
              {t.author_role && (
                <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-xs font-medium mt-0.5 uppercase tracking-wide`}>
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