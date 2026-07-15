-- ============================================
-- Brew Recipes - Supabase Database Setup
-- انسخ هذا الكود كاملاً والصقه في Supabase SQL Editor
-- ============================================

-- تفعيل Row Level Security (موصى به)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- جدول الوصفات (Recipes)
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  coffee_type TEXT NOT NULL,
  roastery TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  roast_level TEXT NOT NULL,
  tasting_notes TEXT[] DEFAULT '{}',
  coffee_grams INTEGER NOT NULL DEFAULT 15,
  water_ml INTEGER NOT NULL DEFAULT 250,
  temperature INTEGER NOT NULL DEFAULT 92,
  grind_size TEXT,
  brew_time INTEGER NOT NULL DEFAULT 180,
  steps TEXT[] DEFAULT '{}',
  video_url TEXT,
  image_url TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 39,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول المستخدمين (يمكن استخدام Supabase Auth بدلاً منه)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  image TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول التقييمات
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول المفضلة
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- إضافة بيانات تجريبية (يمكن حذفها لاحقاً)
INSERT INTO recipes (title, slug, description, coffee_type, roastery, origin_country, roast_level, tasting_notes, coffee_grams, water_ml, temperature, grind_size, brew_time, steps, image_url, price) VALUES
(
  'V60 - إثيوبيا يرغاتشيف',
  'v60-ethiopia-yirgacheffe',
  'وصفة نظيفة وحمضية رائعة من أفضل مناطق إثيوبيا. مثالية لعشاق القهوة الخفيفة ذات النكهات الزهرية والفواكهية.',
  'V60',
  'Blue Bottle Coffee',
  'إثيوبيا',
  'Light',
  ARRAY['فواكه استوائية', 'ياسمين', 'حمضية مشرقة', 'عسل'],
  15, 250, 92,
  'متوسط ناعم (مثل ملح الطعام)',
  180,
  ARRAY[
    'سخن الفلتر والـ V60 بماء ساخن ثم تخلص من الماء.',
    'ضع ١٥ جرام بن مطحون في الفلتر.',
    'صب ٣٠ مل ماء (٩٢°م) لعملية الـ Bloom لمدة ٣٠ ثانية.',
    'صب الماء المتبقي (٢٢٠ مل) على ٣ مراحل كل ٣٠ ثانية.',
    'حرك بلطف في النهاية واتركها تستقر.',
    'الوقت الإجمالي يجب أن يكون حوالي ٣ دقائق.'
  ],
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80',
  45
),
(
  'Espresso - البرازيل سيراادو',
  'espresso-brazil-cerrado',
  'إسبريسو متوازن وغني بالنكهات الشوكولاتية والمكسرات من البرازيل.',
  'Espresso',
  'Counter Culture Coffee',
  'البرازيل',
  'Medium',
  ARRAY['شوكولاتة داكنة', 'مكسرات محمصة', 'كراميل', 'جسم كامل'],
  18, 36, 93,
  'ناعم جداً (مثل السكر البودرة)',
  28,
  ARRAY[
    'طحن البن ناعم جداً.',
    'وزن ١٨ جرام بن في الـ portafilter.',
    'توزيع البن بالتساوي.',
    'الضغط بقوة ١٥-٢٠ كجم.',
    'استخراج لمدة ٢٥-٣٠ ثانية حتى يصل الوزن إلى ٣٦ جرام.'
  ],
  'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=1200&q=80',
  39
);

-- تفعيل Row Level Security (اختياري للبداية)
-- ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Recipes are viewable by everyone" ON recipes FOR SELECT USING (true);
