export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  coffee_type: string;
  roastery: string;
  origin_country: string;
  roast_level: string;
  tasting_notes: string[];
  coffee_grams: number;
  water_ml: number;
  temperature: number;
  grind_size: string;
  brew_time: number;
  steps: string[];
  video_url?: string | null;
  image_url: string;
  price: number;
  is_active?: boolean;
  rating?: number | null;
  reviewsCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
}

export interface Review {
  id: string;
  userId: string;
  recipeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    name: string;
    image?: string;
  };
}
