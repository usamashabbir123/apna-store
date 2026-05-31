'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(password)) {
      router.push('/admin');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50">
      <div className="w-full max-w-md px-8 py-12 bg-white shadow-sm border border-stone-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-stone-900 mb-2">
            Apna
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-stone-500">
            Admin Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs tracking-wide uppercase text-stone-500 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 text-sm focus:outline-none focus:border-stone-400 transition-colors"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-stone-900 text-white text-sm tracking-wide uppercase hover:bg-stone-800 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-[10px] text-stone-400 mt-6 tracking-wide">
          Demo password: <span className="font-mono text-stone-600">apna2024</span>
        </p>
      </div>
    </div>
  );
}
