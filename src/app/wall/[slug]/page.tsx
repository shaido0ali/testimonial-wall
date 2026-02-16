export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getPublicTestimonials } from '@/lib/supabase';
import { Star, Quote, ShieldCheck } from 'lucide-react';

// Use Promise type for params
export default async function WallPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. AWAIT the params to get the slug correctly
  const { slug } = await params;
  
  // 2. Fetch data with the resolved slug
  const testimonials = await getPublicTestimonials(slug);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-black mb-2 tracking-tight text-gray-900">This wall is empty... for now.</h1>
          <p className="text-gray-500 font-medium">When approved reviews are published, they will appear here.</p>
          <p className="text-[10px] text-gray-300 mt-4 uppercase">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A0A0A] transition-colors py-16 px-6">
      
      {/* Header Section */}
      <header className="max-w-4xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full mb-6">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Verified Wall of Love</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter capitalize mb-4">
          {slug.replace(/-/g, ' ')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
          Real stories from our amazing community.
        </p>
      </header>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="break-inside-avoid bg-white dark:bg-[#171717] p-8 rounded-[2.5rem] border border-gray-100 dark:border-[#262626] shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={`${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-800'}`} 
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative mb-8">
                <Quote className="absolute -top-4 -left-4 text-blue-600/10 dark:text-blue-500/5 group-hover:text-blue-600/20 transition-colors" size={50} />
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium relative z-10 italic">
                  "{t.content}"
                </p>
              </div>

              {/* Footer / Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50 dark:border-[#262626]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
                  {t.author_name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-black text-gray-900 dark:text-white text-sm leading-tight">
                    {t.author_name}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">
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
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Powered by <span className="text-blue-600">TestimonialWall</span>
        </p>
      </footer>
    </div>
  );
}