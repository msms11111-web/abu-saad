"use client";

import React, { useState } from 'react';

interface RecipeCalculatorProps {
  initialCoffeeGrams: number;
  initialWaterMl: number;
  initialBrewTime: number;
}

export default function RecipeCalculator({ 
  initialCoffeeGrams, 
  initialWaterMl, 
  initialBrewTime 
}: RecipeCalculatorProps) {
  const [coffeeGrams, setCoffeeGrams] = useState(initialCoffeeGrams);
  
  const waterRatio = initialWaterMl / initialCoffeeGrams;
  const calculatedWater = Math.round(coffeeGrams * waterRatio);
  const calculatedTime = Math.round((initialBrewTime / initialCoffeeGrams) * coffeeGrams);

  return (
    <div className="calculator p-7 rounded-3xl border border-[#E9D8C3] dark:border-[#3D2F25]">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold tracking-tight">حاسبة الوصفة الذكية</h3>
      </div>
      <p className="text-xs text-[#5A3E2B]/70 dark:text-[#E9D8C3]/70 mb-6">
        غيّر كمية البن وسيتم تحديث كمية الماء والوقت تلقائياً
      </p>

      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>كمية البن</span>
          <span className="font-mono font-bold text-lg tabular-nums">{coffeeGrams} <span className="text-xs">جرام</span></span>
        </div>
        <input 
          type="range" 
          min="8" 
          max="35" 
          step="1"
          value={coffeeGrams} 
          onChange={(e) => setCoffeeGrams(parseInt(e.target.value))}
          className="w-full accent-[#5A3E2B] dark:accent-[#C5A46E]"
        />
        <div className="flex justify-between text-[10px] text-[#5A3E2B]/50 mt-1">
          <span>8g</span>
          <span>35g</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl p-5 text-center border border-[#E9D8C3] dark:border-[#3D2F25]">
          <div className="text-[#C5A46E] text-xs tracking-widest mb-1">الماء</div>
          <div className="text-4xl font-bold tabular-nums tracking-tighter text-[#5A3E2B] dark:text-white">
            {calculatedWater}
          </div>
          <div className="text-xs text-[#5A3E2B]/60">مل</div>
        </div>
        
        <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl p-5 text-center border border-[#E9D8C3] dark:border-[#3D2F25]">
          <div className="text-[#C5A46E] text-xs tracking-widest mb-1">وقت الاستخلاص</div>
          <div className="text-4xl font-bold tabular-nums tracking-tighter text-[#5A3E2B] dark:text-white">
            {calculatedTime}
          </div>
          <div className="text-xs text-[#5A3E2B]/60">ثانية</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-[#5A3E2B]/60 dark:text-[#E9D8C3]/60">
          النسبة الأصلية: 1 : {waterRatio.toFixed(1)}
        </p>
      </div>
    </div>
  );
}
