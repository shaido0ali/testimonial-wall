import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  }
)

/**
 * Fetches all approved testimonials for a specific wall slug.
 */
export async function getPublicTestimonials(slug: string) {
  try {
    // 1. Get the wall ID based on the slug
    // We use .single() to get one object, but add error logging to see if slug exists
    const { data: wall, error: wallError } = await supabase
      .from('walls')
      .select('id')
      .eq('slug', slug)
      .single();

    if (wallError || !wall) {
      console.warn(`⚠️ Wall lookup failed for slug: ${slug}`, wallError?.message);
      return [];
    }

    // 2. Fetch approved testimonials
    // IMPORTANT: Ensure 'is_approved' is a boolean column in your Supabase table
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('wall_id', wall.id)
      .eq('is_approved', true) 
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ Testimonial fetch error:", error.message);
      return [];
    }

    console.log(`✅ Success: Found ${data.length} approved reviews for ${slug}`);
    return data;
    
  } catch (err) {
    console.error("Unexpected error in getPublicTestimonials:", err);
    return [];
  }
}