"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    home: "الرئيسية",
    store: "المتجر",
    recipes: "الوصفات",
    subscriptions: "الاشتراكات",
    favorites: "المفضلة",
    profile: "الملف الشخصي",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    admin: "لوحة التحكم",
    logout: "تسجيل الخروج",
    
    // Hero
    heroTitle: "اكتشف أسرار القهوة المختصة",
    heroSubtitle: "وصفات احترافية من أفضل المحامص العالمية. اشترِ وصفة أو اشترك شهرياً للوصول الكامل.",
    exploreRecipes: "استكشف الوصفات",
    startSubscription: "ابدأ الاشتراك الشهري",
    
    // Common
    buyNow: "اشترِ الآن",
    subscribe: "اشترك الآن",
    addToFavorites: "أضف للمفضلة",
    removeFromFavorites: "إزالة من المفضلة",
    viewRecipe: "عرض الوصفة",
    price: "السعر",
    currency: "ر.س",
    monthly: "شهرياً",
    yearly: "سنوياً",
    
    // Recipe
    origin: "بلد المنشأ",
    roastery: "المحمصة",
    roastLevel: "درجة التحميص",
    tastingNotes: "ملاحظات التذوق",
    coffeeGrams: "كمية البن (جرام)",
    waterMl: "كمية الماء (مل)",
    temperature: "درجة الحرارة",
    grindSize: "درجة الطحن",
    brewTime: "وقت الاستخلاص",
    steps: "خطوات التحضير",
    video: "فيديو التحضير",
    calculator: "حاسبة الوصفة الذكية",
    adjustCoffee: "اضبط كمية البن",
    autoUpdate: "يتم تحديث كمية الماء تلقائياً",
    
    // Store
    filters: "الفلاتر",
    searchPlaceholder: "ابحث عن وصفة أو محمصة...",
    allTypes: "كل الأنواع",
    clearFilters: "مسح الفلاتر",
    
    // Auth
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم الكامل",
    loginTitle: "مرحباً بعودتك",
    registerTitle: "انضم إلى مجتمع Brew Recipes",
    
    // Admin
    dashboard: "لوحة التحكم",
    manageRecipes: "إدارة الوصفات",
    addRecipe: "إضافة وصفة جديدة",
    totalSales: "إجمالي المبيعات",
    activeSubscriptions: "الاشتراكات النشطة",
    totalUsers: "إجمالي المستخدمين",
  },
  en: {
    home: "Home",
    store: "Store",
    recipes: "Recipes",
    subscriptions: "Subscriptions",
    favorites: "Favorites",
    profile: "Profile",
    login: "Login",
    register: "Sign Up",
    admin: "Admin Panel",
    logout: "Logout",
    
    heroTitle: "Discover the Secrets of Specialty Coffee",
    heroSubtitle: "Professional recipes from the world's best roasters. Buy individual recipes or subscribe monthly for full access.",
    exploreRecipes: "Explore Recipes",
    startSubscription: "Start Monthly Subscription",
    
    buyNow: "Buy Now",
    subscribe: "Subscribe Now",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    viewRecipe: "View Recipe",
    price: "Price",
    currency: "SAR",
    monthly: "Monthly",
    yearly: "Yearly",
    
    origin: "Origin Country",
    roastery: "Roastery",
    roastLevel: "Roast Level",
    tastingNotes: "Tasting Notes",
    coffeeGrams: "Coffee (grams)",
    waterMl: "Water (ml)",
    temperature: "Temperature",
    grindSize: "Grind Size",
    brewTime: "Brew Time",
    steps: "Brewing Steps",
    video: "Brewing Video",
    calculator: "Smart Recipe Calculator",
    adjustCoffee: "Adjust Coffee Amount",
    autoUpdate: "Water amount updates automatically",
    
    filters: "Filters",
    searchPlaceholder: "Search recipes or roasteries...",
    allTypes: "All Types",
    clearFilters: "Clear Filters",
    
    email: "Email Address",
    password: "Password",
    name: "Full Name",
    loginTitle: "Welcome Back",
    registerTitle: "Join the Brew Recipes Community",
    
    dashboard: "Dashboard",
    manageRecipes: "Manage Recipes",
    addRecipe: "Add New Recipe",
    totalSales: "Total Sales",
    activeSubscriptions: "Active Subscriptions",
    totalUsers: "Total Users",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'brewrecipes-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  // استرجاع اللغة المحفوظة بعد التحميل (يتجنب اختلاف الـ hydration)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  // تحديث اتجاه الصفحة ولغتها عند كل تغيير
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
