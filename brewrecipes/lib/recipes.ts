import { prisma } from './prisma'
import type { Recipe } from '@/app/types'
import type { Recipe as DbRecipe, Review } from '@prisma/client'

// SQLite لا يدعم المصفوفات، لذلك tasting_notes و steps مخزّنة كنص JSON
function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

type DbRecipeWithReviews = DbRecipe & { reviews?: Pick<Review, 'rating'>[] }

export function toRecipe(row: DbRecipeWithReviews): Recipe {
  const ratings = row.reviews?.map((r) => r.rating) ?? []
  const rating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : null

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coffee_type: row.coffee_type,
    roastery: row.roastery,
    origin_country: row.origin_country,
    roast_level: row.roast_level,
    tasting_notes: parseJsonArray(row.tasting_notes),
    coffee_grams: row.coffee_grams,
    water_ml: row.water_ml,
    temperature: row.temperature,
    grind_size: row.grind_size,
    brew_time: row.brew_time,
    steps: parseJsonArray(row.steps),
    video_url: row.video_url,
    image_url: row.image_url,
    price: row.price,
    is_active: row.is_active,
    rating,
    reviewsCount: ratings.length,
  }
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const rows = await prisma.recipe.findMany({
    where: { is_active: true },
    orderBy: { createdAt: 'desc' },
    include: { reviews: { select: { rating: true } } },
  })
  return rows.map(toRecipe)
}

export async function getFeaturedRecipes(count = 3): Promise<Recipe[]> {
  const rows = await prisma.recipe.findMany({
    where: { is_active: true },
    orderBy: { createdAt: 'asc' },
    take: count,
    include: { reviews: { select: { rating: true } } },
  })
  return rows.map(toRecipe)
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const row = await prisma.recipe.findUnique({
    where: { slug },
    include: { reviews: { select: { rating: true } } },
  })
  return row && row.is_active ? toRecipe(row) : null
}

export async function getCategoryCounts(): Promise<{ name: string; count: number }[]> {
  const groups = await prisma.recipe.groupBy({
    by: ['coffee_type'],
    where: { is_active: true },
    _count: { _all: true },
  })
  return groups.map((g) => ({ name: g.coffee_type, count: g._count._all }))
}
