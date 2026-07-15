import Link from 'next/link';
import RecipeForm from '@/app/components/RecipeForm';
import { createRecipe } from '@/lib/admin-actions';

export const metadata = {
  title: 'إضافة وصفة جديدة | Brew Recipes',
};

export default function NewRecipePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/admin" className="text-sm mb-6 inline-block hover:text-[#C5A46E]">→ العودة للوحة التحكم</Link>

      <h1 className="text-4xl tracking-tighter font-bold mb-8">إضافة وصفة جديدة</h1>

      <RecipeForm action={createRecipe} submitLabel="إضافة الوصفة" />
    </div>
  );
}
