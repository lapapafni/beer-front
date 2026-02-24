"use client";

import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BeakerIcon,
  HomeIcon,
  BookOpenIcon,
  PlusCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { UserIcon as UserIconSolid, StarIcon as CrownIcon } from '@heroicons/react/24/solid';

export default function Header() {
  const { isAuthenticated, hasRole, logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  
  const userInitial = user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {}
        <Link href="/" className="group">
          <div className="flex items-center gap-2">
            <div className="relative">
              <BeakerIcon className="w-8 h-8 text-amber-500 group-hover:rotate-12 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xl md:text-2xl font-serif font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              Beer Archive
            </span>
          </div>
        </Link>

        {}
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-amber-500/10"
          >
            <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Главная</span>
          </Link>

          <Link
            href="/beers"
            className="group flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-amber-500/10"
          >
            <BookOpenIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Рецензии</span>
          </Link>

          {hasRole("admin") && (
            <Link
              href="/submit"
              className="group flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              <PlusCircleIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="hidden md:inline">Добавить</span>
            </Link>
          )}

          {}
          {!isAuthenticated ? (
            <Link
              href="/login"
              className="group flex items-center gap-2 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-lg hover:bg-amber-500 hover:text-black transition-all font-semibold"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>Войти</span>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-all font-medium focus:outline-none group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-black font-bold shadow-lg group-hover:scale-105 transition-transform">
                    {hasRole("admin") ? (
                      <CrownIcon className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white text-lg">{userInitial}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black" />
                </div>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-sm"
                  >
                    {}
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-sm text-gray-400">Вы вошли как</p>
                      <p className="font-semibold text-amber-400">{user?.username || "Пользователь"}</p>
                      {hasRole("admin") && (
                        <span className="inline-block mt-1 text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
                          Администратор
                        </span>
                      )}
                    </div>

                    <Link
                      href="/me"
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span>Мой профиль</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Выйти</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}