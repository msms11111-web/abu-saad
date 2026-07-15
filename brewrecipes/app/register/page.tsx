"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/app-store';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const login = useAppStore((s) => s.login);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error('الرجاء إدخال الاسم الكامل');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }
    if (password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون ٦ أحرف على الأقل');
      return;
    }

    login(name.trim(), email);
    toast.success('تم إنشاء الحساب بنجاح، أهلاً بك!');
    router.push('/profile');
  };

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl tracking-tighter font-bold">انضم إلى Brew Recipes</h1>
          <p className="text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 mt-2">ابدأ رحلتك مع أفضل وصفات القهوة</p>
        </div>

        <form onSubmit={handleRegister} className="card p-8 rounded-3xl space-y-6">
          <div>
            <label className="block text-sm mb-2">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
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
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-gold w-full py-4 text-lg">
            إنشاء حساب
          </button>

          <p className="text-center text-sm text-[#5A3E2B]/70">
            لديك حساب بالفعل؟ <Link href="/login" className="text-[#C5A46E] hover:underline">سجل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
