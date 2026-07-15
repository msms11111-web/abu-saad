"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore, useHydrated } from '@/lib/app-store';

const features = [
  'وصول كامل لكل الوصفات الحالية والجديدة',
  'حاسبة الوصفة الذكية لكل وصفة',
  'وصفات جديدة كل أسبوع',
  'تحديثات مستمرة على الوصفات',
  'إلغاء في أي وقت بدون التزامات',
];

export default function SubscriptionsPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAppStore((s) => s.user);
  const subscription = useAppStore((s) => s.subscription);
  const subscriptionEndsAt = useAppStore((s) => s.subscriptionEndsAt);
  const subscribe = useAppStore((s) => s.subscribe);
  const cancelSubscription = useAppStore((s) => s.cancelSubscription);

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    if (!user) {
      toast.error('سجل الدخول أولاً لبدء الاشتراك');
      router.push('/login');
      return;
    }
    subscribe(plan);
    toast.success(plan === 'monthly' ? 'تم تفعيل الاشتراك الشهري! (وضع تجريبي)' : 'تم تفعيل الاشتراك السنوي! (وضع تجريبي)', {
      description: 'الآن لديك وصول كامل لكل الوصفات. عند تفعيل الدفع سيتم التوجيه إلى Stripe.',
    });
  };

  const handleCancel = () => {
    cancelSubscription();
    toast.info('تم إلغاء الاشتراك');
  };

  const active = hydrated && subscription !== 'none';

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <div className="text-[#C5A46E] text-xs tracking-[4px] font-semibold mb-3">MEMBERSHIP</div>
        <h1 className="text-6xl tracking-tighter font-bold mb-4">الاشتراكات</h1>
        <p className="text-xl text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 max-w-2xl mx-auto">
          وصول غير محدود لكل وصفات القهوة المختصة، بدل شراء كل وصفة على حدة
        </p>
      </div>

      {active && (
        <div className="max-w-2xl mx-auto mb-12 card p-6 rounded-3xl flex items-center justify-between gap-4 border-2 border-[#C5A46E]">
          <div>
            <div className="font-bold text-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#C5A46E]" />
              اشتراكك النشط: {subscription === 'monthly' ? 'الخطة الشهرية' : 'الخطة السنوية'}
            </div>
            {subscriptionEndsAt && (
              <p className="text-sm text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 mt-1">
                يتجدد في {new Date(subscriptionEndsAt).toLocaleDateString('ar-SA')}
              </p>
            )}
          </div>
          <button onClick={handleCancel} className="btn btn-secondary text-sm text-red-600 border-red-200">
            إلغاء الاشتراك
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Monthly */}
        <div className="card p-10 rounded-3xl flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">الخطة الشهرية</h2>
            <p className="text-sm text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">مرونة كاملة، شهر بشهر</p>
          </div>
          <div className="mb-8">
            <span className="text-6xl font-bold tracking-tighter">٢٩</span>
            <span className="text-lg text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60"> ر.س / شهرياً</span>
          </div>
          <ul className="space-y-3 mb-10 flex-1">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-[#C5A46E] flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('monthly')}
            disabled={hydrated && subscription === 'monthly'}
            className="btn btn-secondary w-full py-4 disabled:opacity-50"
          >
            {hydrated && subscription === 'monthly' ? 'خطتك الحالية' : 'اشترك شهرياً'}
          </button>
        </div>

        {/* Yearly */}
        <div className="card p-10 rounded-3xl flex flex-col relative border-2 border-[#C5A46E]">
          <div className="absolute -top-4 right-8 px-4 py-1.5 rounded-full bg-[#C5A46E] text-[#1C1C1C] text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> وفّر ٢٠٪
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">الخطة السنوية</h2>
            <p className="text-sm text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">أفضل قيمة لعشاق القهوة</p>
          </div>
          <div className="mb-8">
            <span className="text-6xl font-bold tracking-tighter">٢٧٨</span>
            <span className="text-lg text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60"> ر.س / سنوياً</span>
            <div className="text-xs text-[#C5A46E] mt-1">أي ما يعادل ٢٣ ر.س شهرياً فقط</div>
          </div>
          <ul className="space-y-3 mb-10 flex-1">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-[#C5A46E] flex-shrink-0" /> {f}
              </li>
            ))}
            <li className="flex items-start gap-3 text-sm font-semibold">
              <Check className="w-5 h-5 text-[#C5A46E] flex-shrink-0" /> شهران مجاناً مقارنة بالخطة الشهرية
            </li>
          </ul>
          <button
            onClick={() => handleSubscribe('yearly')}
            disabled={hydrated && subscription === 'yearly'}
            className="btn btn-gold w-full py-4 disabled:opacity-50"
          >
            {hydrated && subscription === 'yearly' ? 'خطتك الحالية' : 'اشترك سنوياً'}
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60 mt-12">
        الدفع تجريبي حالياً — سيتم ربط Stripe عند الإطلاق الفعلي. تصفح{' '}
        <Link href="/store" className="text-[#C5A46E] underline">المتجر</Link>{' '}
        لشراء وصفات فردية.
      </p>
    </div>
  );
}
