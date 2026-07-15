"use client";

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { Coffee, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1C1C1C] text-[#E9D8C3] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#C5A46E] flex items-center justify-center">
                <Coffee className="w-5 h-5 text-[#1C1C1C]" />
              </div>
              <span className="font-bold text-2xl tracking-tighter text-white">Brew Recipes</span>
            </div>
            <p className="text-sm text-[#E9D8C3]/70 leading-relaxed">
              أفضل وصفات القهوة المختصة من أشهر المحامص العالمية. جودة فاخرة في كل كوب.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-widest">الروابط السريعة</h4>
            <div className="space-y-2.5 text-sm">
              <Link href="/store" className="block hover:text-[#C5A46E] transition-colors">المتجر</Link>
              <Link href="/subscriptions" className="block hover:text-[#C5A46E] transition-colors">الاشتراكات</Link>
              <Link href="/favorites" className="block hover:text-[#C5A46E] transition-colors">المفضلة</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-widest">الدعم</h4>
            <div className="space-y-2.5 text-sm">
              <a href="#faq" className="block hover:text-[#C5A46E] transition-colors">الأسئلة الشائعة</a>
              <a href="#" className="block hover:text-[#C5A46E] transition-colors">سياسة الخصوصية</a>
              <a href="#" className="block hover:text-[#C5A46E] transition-colors">شروط الاستخدام</a>
              <a href="#" className="block hover:text-[#C5A46E] transition-colors">اتصل بنا</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-widest">تابعنا</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
            <div className="text-xs text-[#E9D8C3]/60">
              © {new Date().getFullYear()} Brew Recipes. جميع الحقوق محفوظة.
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-[#E9D8C3]/50">
          صُمم بحب لعشاق القهوة المختصة في المملكة العربية السعودية والعالم
        </div>
      </div>
    </footer>
  );
}
