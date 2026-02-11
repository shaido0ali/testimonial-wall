"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";

export default function SubmitTestimonial({ params }: { params: { slug: string } }) {
  const [formData, setFormData] = useState({ name: "", role: "", content: "", rating: 5 });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Find the wall ID based on the slug
    const { data: wall } = await supabase.from("walls").select("id").eq("slug", params.slug).single();

    if (wall) {
      // 2. Insert the testimonial
      await supabase.from("testimonials").insert([
        { 
          wall_id: wall.id, 
          author_name: formData.name, 
          author_role: formData.role, 
          content: formData.content, 
          rating: formData.rating 
        }
      ]);
      setSubmitted(true);
    }
  };

  if (submitted) return <div className="text-center p-10">Thanks for the review! 🚀</div>;

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="Your Name" 
          className="w-full p-2 border rounded" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Your Role (e.g. CEO at Apple)" 
          className="w-full p-2 border rounded" 
          onChange={(e) => setFormData({...formData, role: e.target.value})} 
        />
        <textarea 
          placeholder="What did you think of the service?" 
          className="w-full p-2 border rounded h-32" 
          onChange={(e) => setFormData({...formData, content: e.target.value})} 
          required 
        />
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star 
              key={num} 
              fill={num <= formData.rating ? "gold" : "none"} 
              className="cursor-pointer" 
              onClick={() => setFormData({...formData, rating: num})} 
            />
          ))}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
          Submit Review
        </button>
      </form>
    </main>
  );
}