'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/actions/orders';
import { Order } from '@/lib/admin-types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch {
        // Supabase not connected yet
      } finally {
        setMounted(true);
      }
    }
    load();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    const success = await updateOrderStatus(orderId, status);
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-stone-200 rounded animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 w-24 bg-stone-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-stone-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-stone-900">Orders</h1>
          <p className="text-sm text-stone-500 mt-1">Manage and track customer orders</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', ...statusOptions] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-xs tracking-wide uppercase border transition-colors ${
              filter === status
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
            }`}
          >
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white border border-stone-200 rounded-sm overflow-hidden">
            <div
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-stone-500">{order.id}</span>
                <div>
                  <p className="text-sm font-medium text-stone-900">{order.customerName}</p>
                  <p className="text-xs text-stone-500">{order.email} · {order.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-stone-900">{formatPrice(order.total)}</span>
                <span className={`inline-block px-2 py-0.5 text-[10px] tracking-wide uppercase ${
                  order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                  order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                  order.status === 'processing' ? 'bg-amber-50 text-amber-700' :
                  order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {order.status}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={`text-stone-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="border-t border-stone-100 px-6 py-4 space-y-4">
                <div>
                  <p className="text-xs tracking-wide uppercase text-stone-500 mb-1">Shipping Address</p>
                  <p className="text-sm text-stone-700">{order.address}, {order.city}</p>
                </div>

                <div>
                  <p className="text-xs tracking-wide uppercase text-stone-500 mb-2">Items</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-stone-700">
                          {item.name} <span className="text-stone-400">({item.color}, {item.size})</span>
                        </span>
                        <span className="text-stone-900">
                          {item.quantity} × {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <p className="text-xs tracking-wide uppercase text-stone-500 mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order.id, status)}
                        className={`px-3 py-1.5 text-[10px] tracking-wide uppercase border transition-colors ${
                          order.status === status
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-stone-400">Ordered on {formatDate(order.createdAt)}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white border border-stone-200 rounded-sm">
          <p className="text-stone-500 text-sm">No orders found.</p>
        </div>
      )}
    </div>
  );
}
