"use client";

import React, { useMemo, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import RecipeCard from './RecipeCard';
import { Search, X } from 'lucide-react';
import type { Recipe } from '@/app/types';

const roastLevels = ['Light', 'Medium', 'Medium-Dark', 'Dark'];

export default function StoreClient({
  recipes,
  initialType,
}: {
  recipes: Recipe[];
  initialType: string;
}) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedRoast, setSelectedRoast] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const coffeeTypes = useMemo(
    () => Array.from(new Set(recipes.map((r) => r.coffee_type))),
    [recipes]
  );

  const filteredRecipes = recipes
    .filter((recipe) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        recipe.title.toLowerCase().includes(q) ||
        recipe.roastery.toLowerCase().includes(q) ||
        recipe.origin_country.toLowerCase().includes(q);
      const matchesType = !selectedType || recipe.coffee_type === selectedType;
      const matchesRoast = !selectedRoast || recipe.roast_level === selectedRoast;
      return matchesSearch && matchesType && matchesRoast;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // popular default
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedRoast('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-[#C5A46E] text-xs tracking-[3px] font-semibold">DISCOVER</div>
          <h1 className="text-6xl tracking-tighter font-bold text-[#5A3E2B] dark:text-white">المتجر</h1>
          <p className="text-lg text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 mt-2">اختر من بين أفضل وصفات القهوة المختصة في العالم</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-auto py-2.5 text-sm"
          >
            <option value="popular">الأكثر شعبية</option>
            <option value="price-low">السعر: من الأقل للأعلى</option>
            <option value="price-high">السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-4 w-5 h-5 text-[#5A3E2B]/40" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pr-12"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {coffeeTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? '' : type)}
              className={`filter-chip text-sm ${selectedType === type ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Roast Level Filter */}
      <div className="mb-8 flex items-center gap-2 flex-wrap">
        <span className="text-sm text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">{t('roastLevel')}:</span>
        {roastLevels.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedRoast(selectedRoast === level ? '' : level)}
            className={`filter-chip text-xs ${selectedRoast === level ? 'active' : ''}`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Active Filters */}
      {(selectedType || selectedRoast || searchTerm) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-[#5A3E2B]/60">الفلاتر النشطة:</span>
          {selectedType && (
            <div className="inline-flex items-center gap-1.5 bg-[#E9D8C3] dark:bg-[#3D2F25] px-3 py-1 rounded-full text-sm">
              {selectedType}
              <button onClick={() => setSelectedType('')} aria-label="إزالة الفلتر"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {selectedRoast && (
            <div className="inline-flex items-center gap-1.5 bg-[#E9D8C3] dark:bg-[#3D2F25] px-3 py-1 rounded-full text-sm">
              {selectedRoast}
              <button onClick={() => setSelectedRoast('')} aria-label="إزالة الفلتر"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          <button onClick={clearFilters} className="text-xs underline text-[#C5A46E]">مسح الكل</button>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-xl">لا توجد وصفات تطابق بحثك</p>
            <button onClick={clearFilters} className="mt-4 text-[#C5A46E] underline">{t('clearFilters')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
