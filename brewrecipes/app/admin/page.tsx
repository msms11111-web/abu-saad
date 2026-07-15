import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteRecipe } from '@/lib/admin-actions';
import { Plus, Edit, Trash2, Users, ShoppingBag, TrendingUp, Coffee } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'لوحة التحكم | Brew Recipes',
};

// ملاحظة: الحماية الحقيقية لهذه الصفحة تتطلب مصادقة من جهة الخادم (Supabase/NextAuth).
// حالياً المشروع في وضع تجريبي والرابط يظهر فقط لمن سجل دخوله كمدير.
export default async function AdminDashboard() {
  const [recipes, totalRecipes, totalUsers, totalOrders, activeSubscriptions] = await Promise.all([
    prisma.recipe.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.recipe.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.subscription.count({ where: { status: 'active' } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-5xl tracking-tighter font-bold text-[#5A3E2B] dark:text-white">لوحة التحكم</h1>
          <p className="text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70">إدارة وصفات Brew Recipes</p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="btn btn-gold flex items-center gap-2 px-6 py-3 self-start"
        >
          <Plus className="w-4 h-4" /> إضافة وصفة جديدة
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'إجمالي الوصفات', value: totalRecipes, Icon: Coffee },
          { label: 'المستخدمين', value: totalUsers, Icon: Users },
          { label: 'الطلبات', value: totalOrders, Icon: ShoppingBag },
          { label: 'الاشتراكات النشطة', value: activeSubscriptions, Icon: TrendingUp },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="admin-card card p-6 rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">{label}</p>
                <p className="text-4xl font-bold tracking-tighter mt-1">{value}</p>
              </div>
              <div className="p-3 bg-[#E9D8C3] dark:bg-[#3D2F25] rounded-2xl">
                <Icon className="w-6 h-6 text-[#5A3E2B] dark:text-[#C5A46E]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipes Table */}
      <div className="card rounded-3xl overflow-hidden">
        <div className="px-8 py-6 border-b border-[#E9D8C3] dark:border-[#3D2F25] flex items-center justify-between">
          <h2 className="font-semibold text-xl">أحدث الوصفات</h2>
          <Link href="/admin/recipes" className="text-sm text-[#C5A46E] hover:underline">عرض الكل</Link>
        </div>

        <div className="overflow-x-auto">
          {recipes.length === 0 ? (
            <div className="p-12 text-center text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">
              لا توجد وصفات بعد — أضف أول وصفة أو شغّل <code dir="ltr">npm run db:seed</code>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#F8F4EE] dark:bg-[#2A2520]">
                <tr className="text-start text-sm text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70">
                  <th className="px-8 py-4 font-medium text-start">الوصفة</th>
                  <th className="px-6 py-4 font-medium text-start">النوع</th>
                  <th className="px-6 py-4 font-medium text-start">المحمصة</th>
                  <th className="px-6 py-4 font-medium text-start">السعر</th>
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
                    <td className="px-6 py-5 font-mono font-semibold">{recipe.price} ر.س</td>
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

      <div className="mt-8 text-center text-xs text-[#5A3E2B]/50">
        لوحة التحكم التجريبية — تُربط بنظام مصادقة حقيقي (Supabase) عند الإطلاق
      </div>
    </div>
  );
}
