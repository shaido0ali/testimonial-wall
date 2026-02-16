"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Paintbrush, Save, Check, Loader2 } from 'lucide-react';

export default function StyleEditor({ wallId, initialSettings, onUpdate }: any) {
  // Sync local state if initialSettings change (e.g., when switching walls)
  const [settings, setSettings] = useState({
    theme: 'light',
    accent_color: '#2563eb',
    border_radius: '1.5rem',
    ...initialSettings
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings((prev: any) => ({ ...prev, ...initialSettings }));
    }
  }, [initialSettings]);

  const saveStyles = async () => {
    if (!wallId) {
      console.error("No wallId provided to StyleEditor");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('walls')
      .update({ settings: settings }) // This saves the JSON object to the 'settings' column
      .eq('id', wallId);
    
    if (!error) {
      if (onUpdate) onUpdate();
      // Optional: Show a success toast or feedback
    } else {
      console.error("Error saving styles:", error.message);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 bg-app-bg p-6 rounded-[2rem] border border-app-border">
      <h3 className="text-[10px] font-black text-app-muted uppercase tracking-widest flex items-center gap-2">
        <Paintbrush size={14} /> Style Lab
      </h3>

      <div className="space-y-5">
        {/* Theme Toggle */}
        <div>
          <label className="text-[10px] font-bold text-app-muted uppercase block mb-2">Theme</label>
          <div className="flex gap-2 p-1 bg-app-card rounded-xl border border-app-border">
            {['light', 'dark'].map((t) => (
              <button
                key={t}
                onClick={() => setSettings({ ...settings, theme: t })}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                  settings.theme === t ? 'bg-blue-600 text-white shadow-lg' : 'text-app-muted hover:text-app-fg'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color Picker */}
        <div>
          <label className="text-[10px] font-bold text-app-muted uppercase block mb-2">Accent Color</label>
          <div className="flex flex-wrap gap-3">
            {['#2563eb', '#7c3aed', '#db2777', '#f59e0b', '#10b981', '#000000'].map((c) => (
              <button
                key={c}
                onClick={() => setSettings({ ...settings, accent_color: c })}
                className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-90 ${
                  settings.accent_color === c ? 'border-app-fg scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Border Radius Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-app-muted uppercase">Corner Roundness</label>
            <span className="text-[10px] font-black text-blue-600">{settings.border_radius}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="3" 
            step="0.5"
            value={parseFloat(settings.border_radius)}
            onChange={(e) => setSettings({ ...settings, border_radius: `${e.target.value}rem` })}
            className="w-full h-1.5 bg-app-card rounded-lg appearance-none cursor-pointer accent-blue-600 border border-app-border"
          />
        </div>

        <button
          onClick={saveStyles}
          disabled={saving}
          className="w-full bg-app-fg text-app-bg py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving Changes..." : "Apply Styles"}
        </button>
      </div>
    </div>
  );
}