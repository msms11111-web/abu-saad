import Link from 'next/link';
import { Coffee } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-[#E9D8C3] dark:bg-[#3D2F25] flex items-center justify-center mb-8">
        <Coffee className="w-10 h-10 text-[#5A3E2B] dark:text-[#C5A46E]" />
      </div>
      <h1 className="text-7xl font-bold tracking-tighter mb-4">٤٠٤</h1>
      <p className="text-xl text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 mb-10">
        عذراً، هذه الصفحة غير موجودة — ربما تبخرت مثل رغوة الإسبريسو
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn btn-gold px-8 py-3">الرئيسية</Link>
        <Link href="/store" className="btn btn-secondary px-8 py-3">تصفح المتجر</Link>
      </div>
    </div>
  );
}
