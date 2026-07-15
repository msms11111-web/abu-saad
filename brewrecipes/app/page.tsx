import { getFeaturedRecipes, getCategoryCounts, getAllRecipes } from '@/lib/recipes';
import HomeClient from './components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featured, categories, all] = await Promise.all([
    getFeaturedRecipes(3),
    getCategoryCounts(),
    getAllRecipes(),
  ]);

  return <HomeClient featuredRecipes={featured} categories={categories} totalRecipes={all.length} />;
}
