"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { deleteBeer } from "@/app/services/beer";
import Image from "next/image";
import { 
  EyeIcon, 
  HeartIcon, 
  BeakerIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  CubeIcon,
  CalendarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import ConfirmModal from "./ui/ConfirmModal";

interface Props {
  id: number;
  name: string;
  description: string;
  price: number;
  volume: number;
  apperanceScore: number;
  aromaScore: number;
  tasteScore: number;
  aftertasteScore: number;
  createdAt: string;
  imageUrl?: string | null;
  viewMode?: "grid" | "list";
  onDelete?: (id: number) => void; // Добавляем колбэк
}

export const Card: React.FC<Props> = ({
  id,
  name,
  description,
  price,
  volume,
  apperanceScore,
  aromaScore,
  tasteScore,
  aftertasteScore,
  createdAt,
  imageUrl,
  viewMode = "grid",
  onDelete, // Получаем колбэк
}) => {
  const router = useRouter();
  const { hasRole } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Не переходим на страницу пива, если кликнули на кнопку удаления
    if ((e.target as HTMLElement).closest('.delete-button')) {
      return;
    }
    router.push(`/beers/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteBeer(id);
      setShowDeleteModal(false);
      
      // Если есть колбэк, вызываем его для удаления из списка
      if (onDelete) {
        onDelete(id);
      } else {
        // Если нет колбэка, перезагружаем страницу
        window.location.reload();
      }
      
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось удалить пиво. Попробуйте позже.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleting(false);
  };

  const totalScore = ((apperanceScore + aromaScore + tasteScore + aftertasteScore) / 4).toFixed(1);

  const BeerPlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-amber-700/30 flex items-center justify-center">
      <BeakerIcon className="w-12 h-12 text-amber-500/30" />
    </div>
  );

  if (viewMode === "list") {
    return (
      <>
        <div
          onClick={handleClick}
          className="relative bg-[#121212] rounded-2xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300 overflow-hidden font-sans cursor-pointer group border border-gray-800 hover:border-amber-500/50"
        >
          <div className="flex">
            {/* Изображение */}
            <div className="w-32 h-32 flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-amber-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg></div>';
                  }}
                />
              ) : (
                <BeerPlaceholder />
              )}
            </div>

            {/* Контент */}
            <div className="flex-1 p-4 relative">
              {/* Кнопка удаления для админа */}
              {hasRole("admin") && (
                <button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="delete-button absolute top-2 right-2 p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-start justify-between mb-2 pr-8">
                <h2 className="text-lg font-bold group-hover:text-amber-500 transition-colors line-clamp-1">
                  {name}
                </h2>
                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-full">
                  <StarIcon className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-amber-500">{totalScore}</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                {description || "Нет описания"}
              </p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-300">
                  <CurrencyDollarIcon className="w-4 h-4 text-amber-500" />
                  <span>{price} ₽</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <CubeIcon className="w-4 h-4 text-amber-500" />
                  <span>{volume} л</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <CalendarIcon className="w-4 h-4 text-amber-500" />
                  <span>{new Date(createdAt).toLocaleDateString("ru-RU")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Модалка подтверждения удаления */}
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Удалить пиво?"
          description={`Вы уверены, что хотите удалить "${name}"? Это действие нельзя отменить.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </>
    );
  }

  // Grid view
  return (
    <>
      <div
        onClick={handleClick}
        className="relative bg-[#121212] rounded-2xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300 overflow-hidden font-sans cursor-pointer group border border-gray-800 hover:border-amber-500/50 h-full flex flex-col"
      >
        {/* Легкий подсвет */}
        <div className="absolute inset-0 rounded-2xl bg-amber-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity pointer-events-none" />

        {/* Изображение */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.querySelector('.placeholder')?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* Плейсхолдер */}
          <div className={`placeholder w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
            <BeakerIcon className="w-16 h-16 text-amber-500/30 group-hover:scale-110 transition-transform" />
          </div>

          {/* Бейдж с общей оценкой */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-amber-500 px-3 py-1 rounded-full text-sm font-semibold border border-amber-500/30 flex items-center gap-1">
            <StarIcon className="w-4 h-4" />
            <span>{totalScore}</span>
          </div>

          {/* Кнопка удаления для админа */}
          {hasRole("admin") && (
            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="delete-button absolute top-3 left-3 p-2 bg-black/70 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-full border border-gray-700 hover:border-red-500/50 transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}

          {/* Бейдж с ценой и объемом */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between">
            <div className="bg-black/70 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700 flex items-center gap-1">
              <CurrencyDollarIcon className="w-4 h-4 text-amber-500" />
              <span>{price} ₽</span>
            </div>
            <div className="bg-black/70 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700 flex items-center gap-1">
              <CubeIcon className="w-4 h-4 text-amber-500" />
              <span>{volume} л</span>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="relative z-10 p-5 flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors line-clamp-1">
            {name}
          </h2>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
            {description || "Нет описания"}
          </p>

          {/* Оценки */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                <EyeIcon className="w-3 h-3" />
                <span>Вид</span>
              </div>
              <div className="font-bold text-amber-500">{apperanceScore}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                <SparklesIcon className="w-3 h-3" />
                <span>Аромат</span>
              </div>
              <div className="font-bold text-amber-500">{aromaScore}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                <HeartIcon className="w-3 h-3" />
                <span>Вкус</span>
              </div>
              <div className="font-bold text-amber-500">{tasteScore}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                <BeakerIcon className="w-3 h-3" />
                <span>Послевк.</span>
              </div>
              <div className="font-bold text-amber-500">{aftertasteScore}</div>
            </div>
          </div>

          {/* Дата */}
          <div className="text-xs text-gray-600 flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span>{new Date(createdAt).toLocaleDateString("ru-RU")}</span>
          </div>
        </div>
      </div>

      {/* Модалка подтверждения удаления */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Удалить пиво?"
        description={`Вы уверены, что хотите удалить "${name}"? Это действие нельзя отменить.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};