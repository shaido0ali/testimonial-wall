"use server";

import { supabase } from '@/lib/supabase';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function syncGoogleReviews(wallId: string, placeId: string) {
  if (!GOOGLE_API_KEY) throw new Error("Missing Google API Key");

  // 1. Fetch from Google
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${GOOGLE_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (!data.result?.reviews) return { error: "No reviews found or invalid Place ID" };

  const reviews = data.result.reviews;

  // 2. Format for our Database
  const formattedReviews = reviews.map((rev: any) => ({
    wall_id: wallId,
    author_name: rev.author_name,
    content: rev.text,
    rating: rev.rating,
    is_approved: true, // Auto-approve Google reviews
    created_at: new Date(rev.time * 1000).toISOString(),
  }));

  // 3. Upsert into Supabase (Avoid duplicates based on content/author)
  const { error } = await supabase
    .from('testimonials')
    .upsert(formattedReviews, { onConflict: 'content, author_name' });

  if (error) return { error: error.message };
  return { success: true, count: reviews.length };
}