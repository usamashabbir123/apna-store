'use client';

import { useState, useEffect } from 'react';
import { getFooterColumns, updateFooterColumn, reorderFooterColumns, getSettings, updateSetting } from '@/lib/actions/settings';

export default function FooterBuilder() {
  const [columns, setColumns] = useState<any[]>([]);
  const [footerSettings, setFooterSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [cols, settings] = await Promise.all([getFooterColumns(), getSettings()]);
      setColumns(cols);
      setFooterSettings(settings.footer || {});
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const s1 = await updateSetting('footer', footerSettings);
    setSaving(false);
    setMessage(s1 ? 'Footer saved!' : 'Failed to save');
    setTimeout(() => setMessage(''), 3000);
  };

  const updateColumn = (id: string, field: string, value: any) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const updateColumnItem = (colId: string, itemIdx: number, field: string, value: string) => {
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== colId) return c;
        const items = [...(c.items || [])];
        items[itemIdx] = { ...items[itemIdx], [field]: value };
        return { ...c, items };
      })
    );
  };

  const addColumnItem = (colId: string) => {
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== colId) return c;
        return { ...c, items: [...(c.items || []), { type: 'text', content: '' }] };
      })
    );
  };

  const removeColumnItem = (colId: string, itemIdx: number) => {
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== colId) return c;
        return { ...c, items: (c.items || []).filter((_: any, i: number) => i !== itemIdx) };
      })
    );
  };

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const newOrder = [...columns];
    const fromIdx = newOrder.findIndex((c) => c.id === draggedId);
    const toIdx = newOrder.findIndex((c) => c.id === targetId);
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);
    setColumns(newOrder);
    setDraggedId(null);
    await reorderFooterColumns(newOrder.map((c) => c.id));
  };

  const saveColumn = async (col: any) => {
    await updateFooterColumn(col.id, { title: col.title, items: col.items });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-stone-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-stone-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-stone-900">Footer Builder</h1>
        <p className="text-sm text-stone-500 mt-1">Customize footer columns and content</p>
      </div>

      {message && (
        <div className={`px-4 py-2.5 text-sm ${message.includes('saved') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div>
        <label className="block text-xs tracking-wide uppercase text-stone-500 mb-2">Copyright Text</label>
        <input
          type="text"
          value={footerSettings.copyright || ''}
          onChange={(e) => setFooterSettings({ ...footerSettings, copyright: e.target.value })}
          className="w-full max-w-md px-4 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
          placeholder="© 2024 Apna. All rights reserved."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div
            key={col.id}
            draggable
            onDragStart={() => handleDragStart(col.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.id)}
            className="bg-white border border-stone-200 rounded-sm p-4 cursor-move hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-stone-400 font-mono">{col.id.slice(0, 8)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-300">
                <path d="M4 8h16" /><path d="M4 16h16" />
              </svg>
            </div>

            <input
              type="text"
              value={col.title || ''}
              onChange={(e) => updateColumn(col.id, 'title', e.target.value)}
              onBlur={() => saveColumn(col)}
              placeholder="Column Title"
              className="w-full px-2 py-1.5 mb-3 border border-stone-200 text-sm font-medium focus:outline-none focus:border-stone-500"
            />

            <div className="space-y-2">
              {(col.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex gap-2 items-start">
                  <select
                    value={item.type || 'text'}
                    onChange={(e) => updateColumnItem(col.id, idx, 'type', e.target.value)}
                    onBlur={() => saveColumn(col)}
                    className="text-[10px] px-1 py-1 border border-stone-200 bg-white focus:outline-none w-16 flex-shrink-0"
                  >
                    <option value="text">Text</option>
                    <option value="link">Link</option>
                  </select>
                  {item.type === 'link' ? (
                    <>
                      <input
                        type="text"
                        value={item.label || ''}
                        onChange={(e) => updateColumnItem(col.id, idx, 'label', e.target.value)}
                        onBlur={() => saveColumn(col)}
                        placeholder="Label"
                        className="flex-1 px-2 py-1 text-xs border border-stone-200 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={item.href || ''}
                        onChange={(e) => updateColumnItem(col.id, idx, 'href', e.target.value)}
                        onBlur={() => saveColumn(col)}
                        placeholder="/shop"
                        className="flex-1 px-2 py-1 text-xs border border-stone-200 focus:outline-none font-mono"
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      value={item.content || item.label || ''}
                      onChange={(e) => updateColumnItem(col.id, idx, item.type === 'link' ? 'label' : 'content', e.target.value)}
                      onBlur={() => saveColumn(col)}
                      placeholder="Content"
                      className="flex-1 px-2 py-1 text-xs border border-stone-200 focus:outline-none"
                    />
                  )}
                  <button
                    onClick={() => removeColumnItem(col.id, idx)}
                    className="text-stone-300 hover:text-red-500 text-xs px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => { addColumnItem(col.id); saveColumn({ ...col, items: [...(col.items || []), { type: 'text', content: '' }] }); }}
              className="mt-3 text-xs text-stone-500 hover:text-stone-900 underline"
            >
              + Add Item
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-8 py-3 bg-stone-900 text-white text-sm tracking-wide uppercase hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Footer'}
      </button>
    </div>
  );
}
