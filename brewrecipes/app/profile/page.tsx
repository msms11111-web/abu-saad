"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Heart, ShoppingBag, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore, useHydrated } from '@/lib/app-store';

export default function ProfilePage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const favorites = useAppStore((s) => s.favorites);
  const purchases = useAppStore((s) => s.purchases);
  const subscription = useAppStore((s) => s.subscription);
  const subscriptionEndsAt = useAppStore((s) => s.subscriptionEndsAt);
  const logout = useAppStore((s) => s.logout);

  if (!hydrated) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="skeleton h-96 rounded-3xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6">
        <p className="mb-6 text-lg">يجب تسجيل الدخول أولاً</p>
        <Link href="/login" className="btn btn-primary px-10 py-3">تسجيل الدخول</Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('تم تسجيل الخروج');
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="card p-10 rounded-3xl">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-[#5A3E2B] dark:bg-[#C5A46E] flex items-center justify-center text-white dark:text-[#1C1C1C] text-4xl font-bold">
            {user.name?.[0] || 'م'}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl tracking-tighter font-bold">{user.name}</h1>
            <p className="text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#C5A46E]/20 text-[#C5A46E] text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" /> مدير
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary text-sm text-red-600 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#F8F4EE] dark:bg-[#2A2520] rounded-2xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <Crown className="w-4 h-4 text-[#C5A46E]" /> اشتراكي
            </h3>
            {subscription !== 'none' ? (
              <>
                <p className="text-xl font-bold text-[#C5A46E]">
                  {subscription === 'monthly' ? 'الخطة الشهرية' : 'الخطة السنوية'}
                </p>
                {subscriptionEndsAt && (
                  <p className="text-xs text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 mt-1">
                    نشط حتى {new Date(subscriptionEndsAt).toLocaleDateString('ar-SA')}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">لا يوجد اشتراك</p>
                <Link href="/subscriptions" className="text-xs text-[#C5A46E] underline">ابدأ الآن</Link>
              </>
            )}
          </div>

          <div className="p-6 bg-[#F8F4EE] dark:bg-[#2A2520] rounded-2xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <ShoppingBag className="w-4 h-4 text-[#C5A46E]" /> الوصفات المشتراة
            </h3>
            <p className="text-4xl font-bold">{purchases.length}</p>
          </div>

          <div className="p-6 bg-[#F8F4EE] dark:bg-[#2A2520] rounded-2xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-[#C5A46E]" /> المفضلة
            </h3>
            <p className="text-4xl font-bold">{favorites.length}</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#E9D8C3] dark:border-[#3D2F25] flex flex-wrap gap-4">
          <Link href="/favorites" className="btn btn-secondary flex-1 text-center min-w-40">المفضلة</Link>
          <Link href="/subscriptions" className="btn btn-secondary flex-1 text-center min-w-40">إدارة الاشتراك</Link>
          {user.role === 'admin' && (
            <Link href="/admin" className="btn btn-gold flex-1 text-center min-w-40">لوحة التحكم</Link>
          )}
        </div>
      </div>
    </div>
  );
}
