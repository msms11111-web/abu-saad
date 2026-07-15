"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import { useTheme } from 'next-themes';
import { useAppStore, useHydrated } from '@/lib/app-store';
import { toast } from 'sonner';
import {
  Coffee, Menu, X, User, Heart,
  Moon, Sun, Globe, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const hydrated = useHydrated();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const currentUser = hydrated ? user : null;

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/store', label: t('store') },
    { href: '/subscriptions', label: t('subscriptions') },
    { href: '/favorites', label: t('favorites') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    toast.success('تم تسجيل الخروج');
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#1C1C1C]/95 backdrop-blur-lg border-b border-[#E9D8C3] dark:border-[#3D2F25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#5A3E2B] dark:bg-[#C5A46E] flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white dark:text-[#1C1C1C]" />
            </div>
            <div>
              <div className="font-bold text-2xl tracking-tighter text-[#5A3E2B] dark:text-[#C5A46E]">
                Brew Recipes
              </div>
              <div className="text-[10px] text-[#5A3E2B]/60 dark:text-[#C5A46E]/60 -mt-1">
                SPECIALTY COFFEE
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-[#5A3E2B] dark:text-[#E9D8C3] hover:text-[#C5A46E] dark:hover:text-[#C5A46E]"
              >
                {link.label}
              </Link>
            ))}
            {currentUser?.role === 'admin' && (
              <Link href="/admin" className="nav-link text-[#C5A46E] font-semibold">
                {t('admin')}
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-[#E9D8C3] dark:hover:bg-[#3D2F25] transition-colors text-sm"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium hidden sm:inline">{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-[#E9D8C3] dark:hover:bg-[#3D2F25] transition-colors"
              aria-label="Toggle theme"
            >
              {hydrated && resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#C5A46E]" />
              ) : (
                <Moon className="w-5 h-5 text-[#5A3E2B]" />
              )}
            </button>

            {/* User Menu / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-[#E9D8C3] dark:hover:bg-[#3D2F25] transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#5A3E2B] dark:bg-[#C5A46E] flex items-center justify-center">
                    <User className="w-4 h-4 text-white dark:text-[#1C1C1C]" />
                  </div>
                  <span className="text-sm font-medium hidden md:block">{currentUser.name}</span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#2A2520] rounded-2xl shadow-xl border border-[#E9D8C3] dark:border-[#3D2F25] py-2 z-50"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F4EE] dark:hover:bg-[#1C1C1C] text-sm"
                      >
                        <User className="w-4 h-4" /> {t('profile')}
                      </Link>
                      <Link
                        href="/favorites"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F4EE] dark:hover:bg-[#1C1C1C] text-sm"
                      >
                        <Heart className="w-4 h-4" /> {t('favorites')}
                      </Link>
                      <div className="h-px bg-[#E9D8C3] dark:bg-[#3D2F25] my-1 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-start flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm text-red-600"
                      >
                        <LogOut className="w-4 h-4" /> {t('logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="btn btn-secondary text-sm px-5 py-2 hidden sm:block"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary text-sm px-5 py-2 hidden sm:block"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-[#E9D8C3] dark:hover:bg-[#3D2F25]"
              aria-label="القائمة"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#E9D8C3] dark:border-[#3D2F25] bg-white dark:bg-[#1C1C1C] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4 text-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2 text-[#5A3E2B] dark:text-[#E9D8C3]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {currentUser?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="py-2 text-[#C5A46E] font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('admin')}
                </Link>
              )}
              {!currentUser && (
                <>
                  <Link href="/login" className="py-2 text-[#5A3E2B] dark:text-[#E9D8C3]" onClick={() => setIsMenuOpen(false)}>{t('login')}</Link>
                  <Link href="/register" className="btn btn-primary w-full justify-center mt-2" onClick={() => setIsMenuOpen(false)}>{t('register')}</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
