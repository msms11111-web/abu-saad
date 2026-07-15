import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteRecipe } from '@/lib/admin-actions';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'كل الوصفات | Brew Recipes',
};

export default async function AdminRecipesPage() {
  const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link href="/admin" className="text-sm mb-6 inline-block hover:text-[#C5A46E]">→ العودة للوحة التحكم</Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-5xl tracking-tighter font-bold">كل الوصفات</h1>
          <p className="text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70">{recipes.length} وصفة</p>
        </div>
        <Link href="/admin/recipes/new" className="btn btn-gold flex items-center gap-2 px-6 py-3 self-start">
          <Plus className="w-4 h-4" /> إضافة وصفة جديدة
        </Link>
      </div>

      <div className="card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          {recipes.length === 0 ? (
            <div className="p-12 text-center text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">
              لا توجد وصفات بعد
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#F8F4EE] dark:bg-[#2A2520]">
                <tr className="text-sm text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70">
                  <th className="px-8 py-4 font-medium text-start">الوصفة</th>
                  <th className="px-6 py-4 font-medium text-start">النوع</th>
                  <th className="px-6 py-4 font-medium text-start">المحمصة</th>
                  <th className="px-6 py-4 font-medium text-start">البلد</th>
                  <th className="px-6 py-4 font-medium text-start">السعر</th>
                  <th className="px-6 py-4 font-medium text-start">الحالة</th>
                  <th className="px-6 py-4 font-medium text-end">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9D8C3] dark:divide-[#3D2F25]">
                {recipes.map((recipe) => (
                  <tr key={recipe.id} className="hover:bg-[#F8F4EE] dark:hover:bg-[#2A2520]">
                    <td className="px-8 py-5">
                      <div className="font-medium">{recipe.title}</div>
                      <div className="text-xs text-[#5A3E2B]/50" dir="ltr">{recipe.slug}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#E9D8C3] dark:bg-[#3D2F25]">
                        {recipe.coffee_type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm">{recipe.roastery}</td>
                    <td className="px-6 py-5 text-sm">{recipe.origin_country}</td>
                    <td className="px-6 py-5 font-mono font-semibold">{recipe.price} ر.س</td>
                    <td className="px-6 py-5 text-sm">
                      {recipe.is_active ? (
                        <span className="text-green-600">نشطة</span>
                      ) : (
                        <span className="text-red-500">موقوفة</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/recipes/${recipe.id}/edit`}
                          className="p-2 hover:bg-[#E9D8C3] dark:hover:bg-[#1C1C1C] rounded-xl"
                          aria-label="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <form action={deleteRecipe}>
                          <input type="hidden" name="id" value={recipe.id} />
                          <button
                            type="submit"
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600 rounded-xl"
                            aria-label="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
