import { getAllRecipes } from '@/lib/recipes';
import StoreClient from '../components/StoreClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'المتجر | Brew Recipes',
};

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const [recipes, params] = await Promise.all([getAllRecipes(), searchParams]);
  return <StoreClient recipes={recipes} initialType={params.type ?? ''} />;
}
