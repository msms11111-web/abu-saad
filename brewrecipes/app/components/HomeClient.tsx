"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';
import RecipeCard from './RecipeCard';
import {
  ArrowLeft, Star, Users, Award, Clock,
  Coffee, Zap
} from 'lucide-react';
import type { Recipe } from '@/app/types';

const categoryIcons: Record<string, typeof Coffee> = {
  'Espresso': Zap,
  'Cold Brew': Clock,
};

const testimonials = [
  {
    name: "خالد العتيبي",
    role: "باريستا محترف - الرياض",
    quote: "أفضل استثمار قمت به. الوصفات دقيقة جداً وتغيرت جودة قهوتي في المنزل بشكل ملحوظ.",
    rating: 5
  },
  {
    name: "سارة المنصور",
    role: "عاشقة قهوة - جدة",
    quote: "الاشتراك الشهري يستحق كل ريال. أجرب وصفات جديدة كل أسبوع وأتعلم تقنيات جديدة.",
    rating: 5
  },
  {
    name: "عبدالله الحربي",
    role: "صاحب مقهى - الدمام",
    quote: "استخدمت الوصفات في تدريب فريقي. النتائج ممتازة والعملاء لاحظوا الفرق.",
    rating: 5
  }
];

interface HomeClientProps {
  featuredRecipes: Recipe[];
  categories: { name: string; count: number }[];
  totalRecipes: number;
}

export default function HomeClient({ featuredRecipes, categories, totalRecipes }: HomeClientProps) {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center bg-[#1C1C1C] text-white pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(#3D2F25_0.8px,transparent_1px)] bg-[length:5px_5px] opacity-40" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md mb-6 text-sm">
            <Award className="w-4 h-4 text-[#C5A46E]" />
            <span>{totalRecipes} وصفة احترافية بانتظارك</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-6">
            {t('heroTitle')}
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#E9D8C3]/90 mb-10 tracking-tight">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/store"
              className="btn btn-gold text-lg px-10 py-4 group inline-flex items-center gap-3"
            >
              {t('exploreRecipes')}
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/subscriptions"
              className="btn btn-secondary text-lg px-10 py-4 border-white/30 text-white hover:bg-white/10"
            >
              {t('startSubscription')}
            </Link>
          </div>

          <div className="mt-16 flex justify-center gap-12 text-sm">
            <div className="flex items-center gap-2 text-[#E9D8C3]/70">
              <Users className="w-4 h-4" /> +٨٤٠٠ مستخدم
            </div>
            <div className="flex items-center gap-2 text-[#E9D8C3]/70">
              <Star className="w-4 h-4 text-[#C5A46E]" /> ٤.٩ تقييم متوسط
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs tracking-[3px] text-white/50">
          SCROLL TO EXPLORE
          <div className="w-px h-8 bg-white/30" />
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="uppercase tracking-[3px] text-xs text-[#C5A46E] font-semibold mb-2">FEATURED</div>
            <h2 className="text-5xl tracking-tighter font-bold text-[#5A3E2B] dark:text-[#E9D8C3]">أفضل الوصفات هذا الشهر</h2>
          </div>
          <Link href="/store" className="hidden md:flex items-center gap-2 text-sm font-medium text-[#5A3E2B] dark:text-[#C5A46E] hover:underline">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-[#F8F4EE] dark:bg-[#2A2520] py-16 border-y border-[#E9D8C3] dark:border-[#3D2F25]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[#C5A46E] text-xs tracking-[4px] font-semibold mb-3">EXPLORE BY METHOD</div>
            <h2 className="text-4xl md:text-5xl tracking-tighter font-bold">اختر طريقة التحضير المفضلة لديك</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name] ?? Coffee;
              return (
                <Link
                  key={cat.name}
                  href={`/store?type=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col items-center justify-center p-8 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-[#E9D8C3] dark:border-[#3D2F25] hover:border-[#C5A46E] transition-all active:scale-[0.985]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#5A3E2B] dark:bg-[#C5A46E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white dark:text-[#1C1C1C]" />
                  </div>
                  <div className="font-semibold text-xl tracking-tight mb-1">{cat.name}</div>
                  <div className="text-xs text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">
                    {cat.count} {cat.count === 1 ? 'وصفة' : 'وصفات'}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-[#C5A46E] tracking-[3px] text-xs font-semibold mb-3">LOVED BY COFFEE ENTHUSIASTS</div>
          <h2 className="text-5xl tracking-tighter font-bold">ماذا يقول عشاق القهوة عنا؟</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card p-8 rounded-3xl flex flex-col">
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#C5A46E] text-[#C5A46E]" />
                ))}
              </div>
              <blockquote className="text-lg leading-relaxed flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-8 pt-6 border-t border-[#E9D8C3] dark:border-[#3D2F25]">
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#5A3E2B] text-white py-20">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-5xl tracking-tighter font-bold mb-6">جاهز لتحسين تجربتك مع القهوة؟</h2>
          <p className="text-[#E9D8C3] text-xl mb-10">ابدأ الاشتراك الشهري اليوم واحصل على وصول فوري لكل الوصفات الاحترافية.</p>

          <Link href="/subscriptions" className="inline-flex btn bg-white text-[#5A3E2B] hover:bg-[#E9D8C3] text-lg px-12 py-4 rounded-2xl font-semibold">
            ابدأ الاشتراك الشهري — ٢٩ ر.س
          </Link>
          <p className="mt-4 text-sm text-[#E9D8C3]/70">يمكنك الإلغاء في أي وقت • لا التزامات طويلة الأمد</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-[#C5A46E] text-xs tracking-[3px] font-semibold mb-2">FREQUENTLY ASKED QUESTIONS</div>
          <h2 className="text-4xl tracking-tighter font-bold">الأسئلة الشائعة</h2>
        </div>

        <div className="space-y-4">
          {[
            ["كيف أحصل على الوصفات بعد الشراء؟", "بعد الشراء الفوري، ستظهر الوصفة في ملفك الشخصي ويمكنك الوصول إليها في أي وقت."],
            ["هل الاشتراك يشمل كل الوصفات؟", "نعم، الاشتراك الشهري أو السنوي يمنحك وصولاً كاملاً غير محدود لكل الوصفات الجديدة والحالية."],
            ["هل يمكنني تعديل كميات الوصفة؟", "نعم! كل وصفة تحتوي على حاسبة ذكية تقوم بتعديل كميات الماء تلقائياً عند تغيير كمية البن."],
            ["هل المحتوى محمي؟", "نعم، المحتوى المدفوع محمي ولا يمكن نسخه أو مشاركته. كل وصفة مرتبطة بحسابك."]
          ].map(([q, a], i) => (
            <details key={i} className="group card p-6 rounded-2xl">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {q}
                <span className="text-[#C5A46E] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-[#5A3E2B]/80 dark:text-[#E9D8C3]/80 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
