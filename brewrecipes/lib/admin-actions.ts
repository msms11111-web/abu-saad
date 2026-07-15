'use server';

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// تحويل نصوص النموذج إلى JSON: الخطوات سطر لكل خطوة، والنكهات مفصولة بفواصل
function linesToJson(value: string): string {
  const items = value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  return JSON.stringify(items)
}

function commaToJson(value: string): string {
  const items = value
    .split(/[,،]/)
    .map((s) => s.trim())
    .filter(Boolean)
  return JSON.stringify(items)
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9؀-ۿ-]/g, '')
    .replace(/-+/g, '-')
}

function recipeDataFromForm(formData: FormData) {
  const num = (name: string, fallback: number) => {
    const parsed = parseFloat(formData.get(name) as string)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  const title = ((formData.get('title') as string) || '').trim()
  const rawSlug = ((formData.get('slug') as string) || '').trim()

  return {
    title,
    slug: slugify(rawSlug || title),
    description: ((formData.get('description') as string) || '').trim(),
    coffee_type: ((formData.get('coffee_type') as string) || 'V60').trim(),
    roastery: ((formData.get('roastery') as string) || '').trim(),
    origin_country: ((formData.get('origin_country') as string) || '').trim(),
    roast_level: ((formData.get('roast_level') as string) || 'Medium').trim(),
    price: num('price', 45),
    coffee_grams: Math.round(num('coffee_grams', 15)),
    water_ml: Math.round(num('water_ml', 250)),
    temperature: Math.round(num('temperature', 92)),
    grind_size: ((formData.get('grind_size') as string) || 'متوسط').trim(),
    brew_time: Math.round(num('brew_time', 180)),
    steps: linesToJson((formData.get('steps') as string) || ''),
    tasting_notes: commaToJson((formData.get('tasting_notes') as string) || ''),
    image_url:
      ((formData.get('image_url') as string) || '').trim() ||
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80',
    video_url: ((formData.get('video_url') as string) || '').trim() || null,
  }
}

function revalidateRecipePages(slug?: string) {
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/recipes')
  revalidatePath('/store')
  if (slug) revalidatePath(`/recipe/${slug}`)
}

export async function createRecipe(formData: FormData) {
  const data = recipeDataFromForm(formData)
  if (!data.title || !data.slug) {
    throw new Error('اسم الوصفة مطلوب')
  }

  await prisma.recipe.create({ data })
  revalidateRecipePages(data.slug)
  redirect('/admin')
}

export async function updateRecipe(id: string, formData: FormData) {
  const data = recipeDataFromForm(formData)
  if (!data.title || !data.slug) {
    throw new Error('اسم الوصفة مطلوب')
  }

  await prisma.recipe.update({ where: { id }, data })
  revalidateRecipePages(data.slug)
  redirect('/admin')
}

export async function deleteRecipe(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  // حذف السجلات المرتبطة أولاً حفاظاً على سلامة قاعدة البيانات
  await prisma.$transaction([
    prisma.review.deleteMany({ where: { recipeId: id } }),
    prisma.favorite.deleteMany({ where: { recipeId: id } }),
    prisma.orderItem.deleteMany({ where: { recipeId: id } }),
    prisma.recipe.delete({ where: { id } }),
  ])

  revalidateRecipePages()
}
