"use client";

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// حالة التطبيق على المتصفح: حساب تجريبي محلي + المفضلة + المشتريات + الاشتراك.
// عند الربط بـ Supabase لاحقاً يُستبدل جزء auth فقط ويبقى الباقي كما هو.

export const ADMIN_EMAIL = 'admin@brew.com'

export interface AuthUser {
  name: string
  email: string
  role: 'user' | 'admin'
}

export type SubscriptionPlan = 'none' | 'monthly' | 'yearly'

interface AppState {
  user: AuthUser | null
  favorites: string[] // slugs
  purchases: string[] // slugs
  subscription: SubscriptionPlan
  subscriptionEndsAt: string | null

  login: (name: string, email: string) => void
  logout: () => void
  toggleFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
  purchase: (slug: string) => void
  hasPurchased: (slug: string) => boolean
  subscribe: (plan: Exclude<SubscriptionPlan, 'none'>) => void
  cancelSubscription: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      favorites: [],
      purchases: [],
      subscription: 'none',
      subscriptionEndsAt: null,

      login: (name, email) =>
        set({
          user: {
            name: name || email.split('@')[0],
            email,
            role: email.trim().toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user',
          },
        }),

      logout: () => set({ user: null }),

      toggleFavorite: (slug) =>
        set((state) => ({
          favorites: state.favorites.includes(slug)
            ? state.favorites.filter((s) => s !== slug)
            : [...state.favorites, slug],
        })),

      isFavorite: (slug) => get().favorites.includes(slug),

      purchase: (slug) =>
        set((state) => ({
          purchases: state.purchases.includes(slug)
            ? state.purchases
            : [...state.purchases, slug],
        })),

      hasPurchased: (slug) => get().purchases.includes(slug),

      subscribe: (plan) => {
        const end = new Date()
        if (plan === 'monthly') end.setMonth(end.getMonth() + 1)
        else end.setFullYear(end.getFullYear() + 1)
        set({ subscription: plan, subscriptionEndsAt: end.toISOString() })
      },

      cancelSubscription: () => set({ subscription: 'none', subscriptionEndsAt: null }),
    }),
    { name: 'brewrecipes-store' }
  )
)

// يمنع اختلاف الـ hydration: لا تعرض حالة المستخدم قبل اكتمال التحميل من localStorage
import { useEffect, useState } from 'react'

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
