'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabaseAdmin.from('settings').select('*');
  if (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
  const result: Record<string, any> = {};
  (data || []).forEach((row) => {
    result[row.key] = row.value;
  });
  return result;
}

export async function updateSetting(key: string, value: any): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) {
    console.error('Error updating setting:', error);
    return false;
  }

  revalidatePath('/');
  return true;
}

export async function getHomepageSections(): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('homepage_sections')
    .select('*')
    .eq('page', 'home')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching homepage sections:', error);
    return [];
  }
  return data || [];
}

export async function updateHomepageSection(id: string, updates: { order?: number; is_active?: boolean; config?: any }): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('homepage_sections')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating section:', error);
    return false;
  }

  revalidatePath('/');
  return true;
}

export async function reorderHomepageSections(orderedIds: string[]): Promise<boolean> {
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabaseAdmin
      .from('homepage_sections')
      .update({ order: i + 1 })
      .eq('id', orderedIds[i]);
    if (error) {
      console.error('Error reordering sections:', error);
      return false;
    }
  }
  revalidatePath('/');
  return true;
}

export async function getFooterColumns(): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('footer_columns')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching footer columns:', error);
    return [];
  }
  return data || [];
}

export async function updateFooterColumn(id: string, updates: { order?: number; title?: string; items?: any[] }): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('footer_columns')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating footer column:', error);
    return false;
  }

  revalidatePath('/');
  return true;
}

export async function reorderFooterColumns(orderedIds: string[]): Promise<boolean> {
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabaseAdmin
      .from('footer_columns')
      .update({ order: i })
      .eq('id', orderedIds[i]);
    if (error) {
      console.error('Error reordering footer columns:', error);
      return false;
    }
  }
  revalidatePath('/');
  return true;
}
