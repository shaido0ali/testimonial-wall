"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import EmbedCode from '@/components/EmbedCode';

export default function Dashboard() {
  const [walls, setWalls] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Get user's walls
    const { data: wallsData } = await supabase.from('walls').select('*');
    if (wallsData) setWalls(wallsData);

    // 2. Get all testimonials for those walls
    const { data: testData } = await supabase.from('testimonials').select('*');
    if (testData) setTestimonials(testData);
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    await supabase.from('testimonials').update({ is_approved: !currentStatus }).eq('id', id);
    fetchData(); // Refresh UI
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Testimonial Walls</h1>
      
      {walls.map(wall => (
        <div key={wall.id} className="mb-10 p-6 border rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-600">{wall.name}</h2>
            <span className="text-sm text-gray-400">Slug: /{wall.slug}</span>
          </div>

          <EmbedCode slug={wall.slug} />

          <h3 className="mt-8 font-bold text-gray-700">Recent Submissions:</h3>
          <div className="mt-4 space-y-3">
            {testimonials.filter(t => t.wall_id === wall.id).map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div>
                  <p className="font-medium">{t.author_name} ({t.rating} ⭐)</p>
                  <p className="text-sm text-gray-600 italic">"{t.content}"</p>
                </div>
                <button 
                  onClick={() => toggleApproval(t.id, t.is_approved)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                    t.is_approved ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}
                >
                  {t.is_approved ? 'Unapprove' : 'Approve'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}