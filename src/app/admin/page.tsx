'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { products } from '@/data/products';
import { getOrders } from '@/lib/actions/orders';
import { Order } from '@/lib/admin-types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrders();
        setOrders(data.length > 0 ? data : []);
      } catch {
        // If Supabase fails, orders will be empty
      } finally {
        setMounted(true);
      }
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
    };
  }, [orders]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, href: '/admin/products', color: 'bg-stone-900 text-white' },
    { label: 'Total Orders', value: stats.totalOrders, href: '/admin/orders', color: 'bg-white border border-stone-200' },
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), href: '/admin/orders', color: 'bg-white border border-stone-200' },
    { label: 'Pending Orders', value: stats.pendingOrders, href: '/admin/orders', color: 'bg-amber-50 border border-amber-200' },
  ];

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-light text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-500 mt-1">Overview of your store performance</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 bg-white border border-stone-200 rounded-sm animate-pulse">
              <div className="h-3 w-20 bg-stone-200 rounded mb-2" />
              <div className="h-8 w-16 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-stone-900">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`p-5 rounded-sm ${card.color} transition-shadow hover:shadow-md`}
          >
            <p className={`text-xs tracking-wide uppercase mb-2 ${card.color.includes('bg-stone-900') ? 'text-stone-400' : 'text-stone-500'}`}>
              {card.label}
            </p>
            <p className={`text-2xl font-light ${card.color.includes('bg-stone-900') ? 'text-white' : 'text-stone-900'}`}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-sm p-6">
        <h2 className="text-sm font-medium text-stone-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products" className="px-5 py-2.5 bg-stone-900 text-white text-xs tracking-wide uppercase hover:bg-stone-800 transition-colors">
            Manage Products
          </Link>
          <Link href="/admin/orders" className="px-5 py-2.5 border border-stone-200 text-stone-700 text-xs tracking-wide uppercase hover:bg-stone-50 transition-colors">
            View Orders
          </Link>
          <Link href="/shop" className="px-5 py-2.5 border border-stone-200 text-stone-700 text-xs tracking-wide uppercase hover:bg-stone-50 transition-colors">
            View Store
          </Link>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-stone-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-stone-600">{order.id}</td>
                  <td className="px-6 py-3 text-stone-900">{order.customerName}</td>
                  <td className="px-6 py-3 text-stone-900">{formatPrice(order.total)}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] tracking-wide uppercase ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                      order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                      order.status === 'processing' ? 'bg-amber-50 text-amber-700' :
                      order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
