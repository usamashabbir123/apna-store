'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSetting } from '@/lib/actions/settings';

export default function ThemeCustomizer() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const theme = settings.theme || {};

  useEffect(() => {
    async function load() {
      const data = await getSettings();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  const updateTheme = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      theme: { ...(prev.theme || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const success = await updateSetting('theme', settings.theme || {});
    setSaving(false);
    setMessage(success ? 'Theme saved!' : 'Failed to save');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-stone-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-stone-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-stone-900">Theme Customizer</h1>
        <p className="text-sm text-stone-500 mt-1">Customize colors, fonts, and branding</p>
      </div>

      {message && (
        <div className={`px-4 py-2.5 text-sm ${message.includes('saved') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs tracking-wide uppercase text-stone-500 mb-2">Primary Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.primaryColor || '#292524'}
              onChange={(e) => updateTheme('primaryColor', e.target.value)}
              className="w-12 h-10 border border-stone-200 cursor-pointer"
            />
            <input
              type="text"
              value={theme.primaryColor || '#292524'}
              onChange={(e) => updateTheme('primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-200 text-sm font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-wide uppercase text-stone-500 mb-2">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.bgColor || '#ffffff'}
              onChange={(e) => updateTheme('bgColor', e.target.value)}
              className="w-12 h-10 border border-stone-200 cursor-pointer"
            />
            <input
              type="text"
              value={theme.bgColor || '#ffffff'}
              onChange={(e) => updateTheme('bgColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-200 text-sm font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-wide uppercase text-stone-500 mb-2">Text Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.textColor || '#1c1917'}
              onChange={(e) => updateTheme('textColor', e.target.value)}
              className="w-12 h-10 border border-stone-200 cursor-pointer"
            />
            <input
              type="text"
              value={theme.textColor || '#1c1917'}
              onChange={(e) => updateTheme('textColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-200 text-sm font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-wide uppercase text-stone-500 mb-2">Font Family</label>
          <select
            value={theme.fontFamily || 'Geist, sans-serif'}
            onChange={(e) => updateTheme('fontFamily', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-500"
          >
            <option value="Geist, sans-serif">Geist (Modern)</option>
            <option value="Inter, sans-serif">Inter (Clean)</option>
            <option value="Playfair Display, serif">Playfair Display (Elegant)</option>
            <option value="Cormorant Garamond, serif">Cormorant Garamond (Classic)</option>
            <option value="system-ui, sans-serif">System UI</option>
          </select>
        </div>

        <div>
          <label className="block text-xs tracking-wide uppercase text-stone-500 mb-2">Button Style</label>
          <div className="flex gap-2">
            {['square', 'rounded', 'pill'].map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => updateTheme('buttonStyle', style)}
                className={`px-4 py-2 text-xs border transition-colors ${
                  theme.buttonStyle === style
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
                style={{ borderRadius: style === 'pill' ? '999px' : style === 'rounded' ? '6px' : '0' }}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-wide uppercase text-stone-500 mb-2">Navbar</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateTheme('navbarSticky', !theme.navbarSticky)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme.navbarSticky ? 'bg-stone-900' : 'bg-stone-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme.navbarSticky ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
            <span className="text-sm text-stone-700">{theme.navbarSticky ? 'Sticky' : 'Static'}</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="border border-stone-200 rounded-sm p-6 bg-white">
        <h2 className="text-sm font-medium text-stone-900 mb-4">Live Preview</h2>
        <div
          className="p-6 space-y-4"
          style={{
            backgroundColor: theme.bgColor || '#ffffff',
            color: theme.textColor || '#1c1917',
            fontFamily: theme.fontFamily || 'Geist, sans-serif',
          }}
        >
          <h3 className="text-xl font-light">Apna Store</h3>
          <p className="text-sm opacity-70">This is how your store will look with the selected theme.</p>
          <div className="flex gap-3">
            <button
              className="px-6 py-2.5 text-sm text-white transition-colors"
              style={{
                backgroundColor: theme.primaryColor || '#292524',
                borderRadius: theme.buttonStyle === 'pill' ? '999px' : theme.buttonStyle === 'rounded' ? '6px' : '0',
              }}
            >
              Primary Button
            </button>
            <button
              className="px-6 py-2.5 text-sm border transition-colors"
              style={{
                borderColor: theme.primaryColor || '#292524',
                color: theme.primaryColor || '#292524',
                borderRadius: theme.buttonStyle === 'pill' ? '999px' : theme.buttonStyle === 'rounded' ? '6px' : '0',
              }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-8 py-3 bg-stone-900 text-white text-sm tracking-wide uppercase hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Theme'}
      </button>
    </div>
  );
}
