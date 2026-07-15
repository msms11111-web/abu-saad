import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { toRecipe } from '@/lib/recipes';
import { updateRecipe } from '@/lib/admin-actions';
import RecipeForm from '@/app/components/RecipeForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'تعديل الوصفة | Brew Recipes',
};

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.recipe.findUnique({ where: { id } });
  if (!row) notFound();

  const recipe = toRecipe(row);
  const updateAction = updateRecipe.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/admin" className="text-sm mb-6 inline-block hover:text-[#C5A46E]">→ العودة للوحة التحكم</Link>

      <h1 className="text-4xl tracking-tighter font-bold mb-2">تعديل الوصفة</h1>
      <p className="text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 mb-8">{recipe.title}</p>

      <RecipeForm action={updateAction} recipe={recipe} submitLabel="حفظ التعديلات" />
    </div>
  );
}
