"use client";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['github']} // Adds "Login with GitHub" automatically
        redirectTo="http://localhost:3000/dashboard"
      />
    </div>
  );
}