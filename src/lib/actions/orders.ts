'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { Order } from '@/lib/admin-types';

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return (data || []).map((o) => ({
    id: o.id,
    customerName: o.customer_name,
    email: o.email,
    phone: o.phone,
    address: o.address,
    city: o.city,
    items: (o.items as any[]).map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color,
    })),
    total: o.total,
    status: o.status,
    createdAt: o.created_at,
  }));
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_name: order.customerName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      items: order.items,
      total: order.total,
      status: order.status,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return null;
  }

  return data?.id || null;
}
