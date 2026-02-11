// src/app/widget/[slug]/page.tsx
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";

export default async function Widget({ params }: { params: { slug: string } }) {
  // 1. Fetch the Wall and its approved testimonials
  const { data: wall } = await supabase
    .from("walls")
    .select("id, name, testimonials(*)")
    .eq("slug", params.slug)
    .eq("testimonials.is_approved", true) // Only show approved ones
    .single();

  if (!wall) return <div>Wall not found</div>;

  return (
    <div className="p-4 bg-transparent">
      <h2 className="text-xl font-bold mb-6 text-center">{wall.name}</h2>
      
      {/* 2. Responsive Grid Layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {wall.testimonials.map((t: any) => (
          <div 
            key={t.id} 
            className="break-inside-avoid p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex mb-2">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={16} fill="#FACC15" color="#FACC15" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-4">"{t.content}"</p>
            <div>
              <p className="font-bold text-gray-900">{t.author_name}</p>
              <p className="text-sm text-gray-500">{t.author_role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}