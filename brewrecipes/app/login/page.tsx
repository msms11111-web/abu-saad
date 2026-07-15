"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppStore, ADMIN_EMAIL } from '@/lib/app-store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const login = useAppStore((s) => s.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }
    if (password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون ٦ أحرف على الأقل');
      return;
    }

    login('', email);
    toast.success('تم تسجيل الدخول بنجاح');
    router.push(email.trim().toLowerCase() === ADMIN_EMAIL ? '/admin' : '/profile');
  };

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#5A3E2B] dark:bg-[#C5A46E] flex items-center justify-center mb-6">
            <span className="text-white dark:text-[#1C1C1C] text-3xl">☕</span>
          </div>
          <h1 className="text-4xl tracking-tighter font-bold">مرحباً بعودتك</h1>
          <p className="text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 mt-2">سجل الدخول للوصول إلى وصفاتك</p>
        </div>

        <form onSubmit={handleLogin} className="card p-8 rounded-3xl space-y-6">
          <div>
            <label className="block text-sm mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-gold w-full py-4 text-lg">
            تسجيل الدخول
          </button>

          <p className="text-center text-sm text-[#5A3E2B]/70">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-[#C5A46E] hover:underline">أنشئ حساباً جديداً</Link>
          </p>

          <p className="text-center text-xs text-[#5A3E2B]/50 dark:text-[#E9D8C3]/50 pt-2 border-t border-[#E9D8C3] dark:border-[#3D2F25]">
            وضع تجريبي: أي بريد وكلمة مرور تعمل. للدخول كمدير استخدم {ADMIN_EMAIL}
          </p>
        </form>
      </div>
    </div>
  );
}
