"use client";

import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Wait a split second for cookies to settle
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]} 
          redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
        />
      </div>
    </div>
  );
}