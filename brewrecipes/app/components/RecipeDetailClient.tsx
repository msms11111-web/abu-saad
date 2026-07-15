"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import RecipeCalculator from './RecipeCalculator';
import { useAppStore, useHydrated } from '@/lib/app-store';
import {
  ArrowRight, Play, Heart, Share2, Star,
  Coffee, ThermometerSun, Clock, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import type { Recipe } from '@/app/types';

function formatBrewTime(seconds: number): string {
  if (seconds >= 3600) return `${Math.round(seconds / 3600)} ساعة`;
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs ? `${mins} د ${secs} ث` : `${mins} دقائق`;
  }
  return `${seconds} ثانية`;
}

export default function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const { t } = useLanguage();
  const router = useRouter();
  const hydrated = useHydrated();
  const [showVideo, setShowVideo] = useState(false);

  const user = useAppStore((s) => s.user);
  const favorites = useAppStore((s) => s.favorites);
  const purchases = useAppStore((s) => s.purchases);
  const subscription = useAppStore((s) => s.subscription);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const purchase = useAppStore((s) => s.purchase);

  const favorited = hydrated && favorites.includes(recipe.slug);
  const owned = hydrated && (purchases.includes(recipe.slug) || subscription !== 'none');

  const handleBuy = () => {
    if (!user) {
      toast.error('سجل الدخول أولاً لإتمام الشراء');
      router.push('/login');
      return;
    }
    if (owned) {
      toast.info('هذه الوصفة ملكك بالفعل');
      return;
    }
    purchase(recipe.slug);
    toast.success('تم شراء الوصفة بنجاح! (وضع تجريبي)', {
      description: 'أُضيفت إلى مشترياتك في ملفك الشخصي. عند تفعيل الدفع سيتم التوجيه إلى Stripe.',
    });
  };

  const handleFavorite = () => {
    toggleFavorite(recipe.slug);
    toast.success(favorited ? 'أُزيلت من المفضلة' : 'أُضيفت إلى المفضلة');
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: recipe.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('تم نسخ رابط الوصفة');
      }
    } catch {
      // المستخدم ألغى المشاركة
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link href="/store" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-[#C5A46E] transition-colors">
        <ArrowRight className="w-4 h-4" /> العودة إلى المتجر
      </Link>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Image + Info */}
        <div className="lg:col-span-3">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/10] mb-8">
            <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

            <div className="absolute bottom-0 p-8 text-white">
              <div className="uppercase tracking-[4px] text-xs mb-2 text-[#C5A46E]">{recipe.coffee_type} • {recipe.roast_level}</div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-3">{recipe.title}</h1>
              <p className="text-xl text-white/90">{recipe.roastery} — {recipe.origin_country}</p>
            </div>

            {recipe.video_url && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute top-8 left-8 flex items-center gap-3 bg-white/95 hover:bg-white text-[#1C1C1C] px-6 py-3 rounded-2xl font-semibold text-sm shadow-xl active:scale-95 transition-all"
              >
                <Play className="w-4 h-4" /> شاهد الفيديو
              </button>
            )}
          </div>

          {/* Tasting Notes */}
          <div className="mb-10">
            <div className="uppercase text-xs tracking-[3px] text-[#C5A46E] mb-3 font-semibold">{t('tastingNotes')}</div>
            <div className="flex flex-wrap gap-2">
              {recipe.tasting_notes.map((note, index) => (
                <div key={index} className="px-5 py-2 rounded-2xl bg-[#E9D8C3] dark:bg-[#3D2F25] text-sm font-medium">
                  {note}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none text-[#5A3E2B] dark:text-[#E9D8C3]">
            <p className="text-lg leading-relaxed">{recipe.description}</p>
          </div>
        </div>

        {/* Sidebar: Purchase + Specs + Calculator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchase Card */}
          <div className="card p-7 rounded-3xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-6xl font-bold tracking-tighter text-[#5A3E2B] dark:text-[#C5A46E]">{recipe.price}</div>
                <div className="text-sm -mt-1 text-[#5A3E2B]/60">ر.س (شراء مرة واحدة)</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleFavorite}
                  aria-label={favorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                  className="p-3 rounded-2xl border border-[#E9D8C3] dark:border-[#3D2F25] hover:bg-[#F8F4EE] dark:hover:bg-[#1C1C1C]"
                >
                  <Heart className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="مشاركة"
                  className="p-3 rounded-2xl border border-[#E9D8C3] dark:border-[#3D2F25] hover:bg-[#F8F4EE] dark:hover:bg-[#1C1C1C]"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {owned ? (
              <div className="flex items-center justify-center gap-2 w-full py-4 mb-3 rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-semibold">
                <CheckCircle2 className="w-5 h-5" /> تمتلك هذه الوصفة
              </div>
            ) : (
              <button onClick={handleBuy} className="btn btn-gold w-full py-4 text-lg mb-3">
                {t('buyNow')} — {recipe.price} ر.س
              </button>
            )}

            <Link href="/subscriptions" className="btn btn-secondary w-full py-4 text-sm">
              أو اشترك شهرياً (٢٩ ر.س) للوصول الكامل
            </Link>

            <div className="text-center text-xs text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60 mt-4">
              وصول فوري • حاسبة ذكية • تحديثات مستمرة
            </div>
          </div>

          {/* Specs */}
          <div className="card p-7 rounded-3xl">
            <h3 className="font-semibold mb-5 flex items-center gap-2"><Coffee className="w-4 h-4" /> مواصفات الوصفة</h3>

            <div className="space-y-4 text-sm">
              {[
                [t('origin'), recipe.origin_country],
                [t('roastery'), recipe.roastery],
                [t('roastLevel'), recipe.roast_level],
                [t('grindSize'), recipe.grind_size],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-[#E9D8C3] dark:border-[#3D2F25]">
                  <span className="text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-b border-[#E9D8C3] dark:border-[#3D2F25]">
                <span className="text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 flex items-center gap-1.5">
                  <ThermometerSun className="w-4 h-4" /> {t('temperature')}
                </span>
                <span className="font-medium">{recipe.temperature}°م</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {t('brewTime')}
                </span>
                <span className="font-medium">{formatBrewTime(recipe.brew_time)}</span>
              </div>
            </div>
          </div>

          {/* Smart Calculator */}
          <RecipeCalculator
            initialCoffeeGrams={recipe.coffee_grams}
            initialWaterMl={recipe.water_ml}
            initialBrewTime={recipe.brew_time}
          />

          {recipe.rating != null && (
            <div className="card p-6 rounded-3xl flex items-center justify-center gap-3">
              <Star className="w-6 h-6 fill-[#C5A46E] text-[#C5A46E]" />
              <span className="text-2xl font-bold">{recipe.rating}</span>
              <span className="text-sm text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">({recipe.reviewsCount} تقييم)</span>
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="mt-16">
        <h2 className="text-4xl tracking-tighter font-bold mb-8 flex items-center gap-3">
          {t('steps')}
          <span className="text-base align-middle px-4 py-1 rounded-full bg-[#E9D8C3] dark:bg-[#3D2F25] text-[#5A3E2B] dark:text-[#C5A46E] font-mono tracking-widest text-xs">STEP BY STEP</span>
        </h2>

        <div className="space-y-4 max-w-3xl">
          {recipe.steps.map((step, index) => (
            <div key={index} className="flex gap-5 bg-white dark:bg-[#2A2520] p-6 rounded-3xl border border-[#E9D8C3] dark:border-[#3D2F25]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5A3E2B] dark:bg-[#C5A46E] text-white dark:text-[#1C1C1C] flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="pt-1 text-lg leading-relaxed text-[#5A3E2B] dark:text-[#E9D8C3]">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && recipe.video_url && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6" onClick={() => setShowVideo(false)}>
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={recipe.video_url}
                title="فيديو التحضير"
                allowFullScreen
              />
            </div>
            <button onClick={() => setShowVideo(false)} className="mt-4 text-white/70 hover:text-white text-sm">إغلاق الفيديو</button>
          </div>
        </div>
      )}
    </div>
  );
}
