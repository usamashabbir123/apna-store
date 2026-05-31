'use client';

import { useState, useEffect } from 'react';
import { getHomepageSections, updateHomepageSection, reorderHomepageSections } from '@/lib/actions/settings';

const SECTION_TYPES: Record<string, { label: string; icon: string }> = {
  hero: { label: 'Hero Banner', icon: '🖼️' },
  category_grid: { label: 'Category Grid', icon: '📂' },
  product_grid: { label: 'Product Grid', icon: '🛍️' },
  promo: { label: 'Promo Banner', icon: '✨' },
  values: { label: 'Brand Values', icon: '💎' },
  testimonials: { label: 'Testimonials', icon: '💬' },
  newsletter: { label: 'Newsletter', icon: '📧' },
  text_block: { label: 'Text Block', icon: '📝' },
};

export default function PagesBuilder() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getHomepageSections();
      setSections(data);
      setLoading(false);
    }
    load();
  }, []);

  const toggleActive = async (id: string, current: boolean) => {
    const success = await updateHomepageSection(id, { is_active: !current });
    if (success) {
      setSections((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s)));
    }
  };

  const updateConfig = (id: string, field: string, value: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, config: { ...(s.config || {}), [field]: value } };
      })
    );
  };

  const saveConfig = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    const success = await updateHomepageSection(id, { config: section.config });
    if (success) setEditingSection(null);
  };

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const newOrder = [...sections];
    const fromIdx = newOrder.findIndex((s) => s.id === draggedId);
    const toIdx = newOrder.findIndex((s) => s.id === targetId);
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);
    setSections(newOrder);
    setDraggedId(null);
    await reorderHomepageSections(newOrder.map((s) => s.id));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-stone-200 animate-pulse rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-stone-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-stone-900">Homepage Builder</h1>
        <p className="text-sm text-stone-500 mt-1">Drag to reorder, click to edit, toggle to show/hide</p>
      </div>

      {message && (
        <div className={`px-4 py-2.5 text-sm ${message.includes('saved') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-3">
        {sections.map((section, idx) => {
          const typeInfo = SECTION_TYPES[section.type] || { label: section.type, icon: '📄' };
          const isEditing = editingSection === section.id;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(section.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(section.id)}
              className={`bg-white border rounded-sm transition-shadow ${
                draggedId === section.id ? 'opacity-50' : ''
              } ${section.is_active ? 'border-stone-200' : 'border-stone-100 opacity-60'}`}
            >
              {/* Header */}
              <div
                className="px-5 py-3 flex items-center justify-between cursor-move"
                onClick={() => setEditingSection(isEditing ? null : section.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{typeInfo.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-stone-900">{typeInfo.label}</p>
                    <p className="text-[10px] text-stone-400">
                      {section.is_active ? 'Visible' : 'Hidden'} · Order {idx + 1}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleActive(section.id, section.is_active); }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      section.is_active ? 'bg-stone-900' : 'bg-stone-300'
                    }`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      section.is_active ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`text-stone-400 transition-transform ${isEditing ? 'rotate-180' : ''}`}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Edit Panel */}
              {isEditing && (
                <div className="border-t border-stone-100 px-5 py-4 bg-stone-50 space-y-3">
                  {section.config?.headline !== undefined && (
                    <div>
                      <label className="text-[10px] tracking-wide uppercase text-stone-500">Headline</label>
                      <input
                        type="text"
                        value={section.config.headline || ''}
                        onChange={(e) => updateConfig(section.id, 'headline', e.target.value)}
                        className="w-full px-3 py-1.5 mt-1 border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-500"
                      />
                    </div>
                  )}
                  {section.config?.subheadline !== undefined && (
                    <div>
                      <label className="text-[10px] tracking-wide uppercase text-stone-500">Subheadline</label>
                      <textarea
                        value={section.config.subheadline || ''}
                        onChange={(e) => updateConfig(section.id, 'subheadline', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 mt-1 border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-500 resize-none"
                      />
                    </div>
                  )}
                  {section.config?.title !== undefined && (
                    <div>
                      <label className="text-[10px] tracking-wide uppercase text-stone-500">Title</label>
                      <input
                        type="text"
                        value={section.config.title || ''}
                        onChange={(e) => updateConfig(section.id, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 mt-1 border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-500"
                      />
                    </div>
                  )}
                  {section.config?.subtitle !== undefined && (
                    <div>
                      <label className="text-[10px] tracking-wide uppercase text-stone-500">Subtitle</label>
                      <input
                        type="text"
                        value={section.config.subtitle || ''}
                        onChange={(e) => updateConfig(section.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-1.5 mt-1 border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-500"
                      />
                    </div>
                  )}
                  {section.config?.filter !== undefined && (
                    <div>
                      <label className="text-[10px] tracking-wide uppercase text-stone-500">Filter</label>
                      <select
                        value={section.config.filter || ''}
                        onChange={(e) => updateConfig(section.id, 'filter', e.target.value)}
                        className="w-full px-3 py-1.5 mt-1 border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-500"
                      >
                        <option value="featured">Featured</option>
                        <option value="trending">Trending</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>
                  )}
                  {section.config?.bgImage !== undefined && (
                    <div>
                      <label className="text-[10px] tracking-wide uppercase text-stone-500">Background Image</label>
                      <input
                        type="text"
                        value={section.config.bgImage || ''}
                        onChange={(e) => updateConfig(section.id, 'bgImage', e.target.value)}
                        placeholder="/images/hero.jpg"
                        className="w-full px-3 py-1.5 mt-1 border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-500 font-mono"
                      />
                    </div>
                  )}
                  {(section.config?.ctaPrimary || section.config?.cta) && (
                    <div>
                      <label className="text-[10px] tracking-wide uppercase text-stone-500">CTA Text</label>
                      <input
                        type="text"
                        value={section.config.cta?.text || section.config.ctaPrimary?.text || ''}
                        onChange={(e) => {
                          const cta = section.config.cta || section.config.ctaPrimary || {};
                          const key = section.config.cta ? 'cta' : 'ctaPrimary';
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id
                                ? { ...s, config: { ...s.config, [key]: { ...cta, text: e.target.value } } }
                                : s
                            )
                          );
                        }}
                        className="w-full px-3 py-1.5 mt-1 border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-500"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => saveConfig(section.id)}
                      className="px-4 py-1.5 bg-stone-900 text-white text-xs tracking-wide uppercase hover:bg-stone-800"
                    >
                      Save Section
                    </button>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="px-4 py-1.5 border border-stone-200 text-stone-600 text-xs hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
