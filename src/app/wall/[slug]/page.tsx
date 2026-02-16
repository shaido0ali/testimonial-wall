export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabase } from '@/lib/supabase';
import { getPublicTestimonials } from '@/lib/supabase';
import { Star, Quote, ShieldCheck } from 'lucide-react';

export default async function WallPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. Fetch Wall + Testimonials
  const { data: wall } = await supabase
    .from('walls')
    .select('*')
    .eq('slug', slug)
    .single();

  const testimonials = await getPublicTestimonials(slug);

  // 2. Define Settings with Defaults
  // This matches the keys we are saving in StyleEditor.tsx
  const settings = wall?.settings || {
    theme: 'light',
    accent_color: '#2563eb',
    border_radius: '1.5rem',
    show_stars: true,
    font_style: 'sans'
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-black mb-2 tracking-tight text-gray-900">This wall is empty... for now.</h1>
          <p className="text-gray-500 font-medium">When approved reviews are published, they will appear here.</p>
        </div>
      </div>
    );
  }

  // 3. Theme Mapping
  const isDark = settings.theme === 'dark';
  const bgColor = isDark ? 'bg-[#0A0A0A]' : 'bg-[#F8FAFC]';
  const cardBg = isDark ? 'bg-[#171717]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedText = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-[#262626]' : 'border-gray-100';
  
  // Font Mapping
  const fontClass = settings.font_style === 'serif' ? 'font-serif' : 'font-sans';

  return (
    <div className={`min-h-screen ${bgColor} ${fontClass} transition-colors py-16 px-6`}>
      
      {/* Header Section */}
      <header className="max-w-4xl mx-auto text-center mb-20">
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ 
            backgroundColor: `${settings.accent_color}15`, 
            color: settings.accent_color 
          }}
        >
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Verified Wall of Love</span>
        </div>
        <h1 className={`text-4xl md:text-6xl font-black ${textColor} tracking-tighter capitalize mb-4`}>
          {wall?.name || slug.replace(/-/g, ' ')}
        </h1>
        <p className={`${mutedText} font-medium text-lg`}>
          Real stories from our amazing community.
        </p>
      </header>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className={`break-inside-avoid ${cardBg} p-8 border ${borderColor} shadow-sm hover:shadow-xl transition-all duration-500 group`}
              style={{ borderRadius: settings.border_radius || '1.5rem' }}
            >
              {/* Star Rating */}
              {settings.show_stars !== false && (
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      style={{ 
                        color: i < t.rating ? settings.accent_color : (isDark ? '#262626' : '#E5E7EB'),
                        fill: i < t.rating ? settings.accent_color : 'transparent'
                      }} 
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="relative mb-8">
                <Quote 
                  className="absolute -top-4 -left-4 opacity-10 transition-colors" 
                  size={50} 
                  style={{ color: settings.accent_color }}
                />
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed font-medium relative z-10 italic`}>
                  "{t.content}"
                </p>
              </div>

              {/* Footer / Author */}
              <div className={`flex items-center gap-4 pt-6 border-t ${isDark ? 'border-[#262626]' : 'border-gray-50'}`}>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${settings.accent_color}, ${settings.accent_color}dd)`,
                  }}
                >
                  {t.author_name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className={`font-black ${textColor} text-sm leading-tight`}>
                    {t.author_name}
                  </p>
                  <p className={`text-[10px] ${mutedText} uppercase tracking-widest font-black mt-1`}>
                    Verified Customer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Powered By Footer */}
      <footer className="mt-24 text-center">
        <p className={`text-[10px] font-black ${mutedText} uppercase tracking-[0.3em]`}>
          Powered by <span style={{ color: settings.accent_color }}>TestimonialWall</span>
        </p>
      </footer>
    </div>
  );
}