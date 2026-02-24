"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BeakerIcon,
  CurrencyDollarIcon,
  CubeIcon,
  CalendarIcon,
  EyeIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

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
}

export const BeerInfo: React.FC<Props> = ({
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
}) => {
  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Общая оценка
  const totalScore = ((apperanceScore + aromaScore + tasteScore + aftertasteScore) / 4).toFixed(1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-[#121212] rounded-3xl shadow-lg hover:shadow-amber-500/10 transition-all duration-300 border border-gray-800 overflow-hidden group mb-12"
    >
      {/* Легкий подсвет как на карточках */}
      <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-5 blur-xl transition-opacity pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row">
        {/* Левая колонка с изображением */}
        <div className="w-full md:w-2/5 lg:w-1/3">
          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px] bg-gradient-to-br from-gray-800 to-gray-900">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.querySelector('.placeholder')?.classList.remove('hidden');
                }}
              />
            ) : null}
            
            {/* Плейсхолдер */}
            <div className={`placeholder w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
              <BeakerIcon className="w-24 h-24 text-amber-500/30 transform group-hover:scale-110 transition-transform" />
            </div>

            {/* Бейдж с общей оценкой */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-amber-500 px-4 py-2 rounded-full text-lg font-bold border border-amber-500/30 flex items-center gap-2">
              <StarIconSolid className="w-5 h-5 text-amber-500" />
              <span>{totalScore}</span>
            </div>

            {/* Бейдж с ценой и объемом (для мобильных) */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between md:hidden">
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
        </div>

        {/* Правая колонка с информацией */}
        <div className="flex-1 p-6 md:p-8 lg:p-10">
          {/* Название */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            {name}
          </h1>

          {/* Описание */}
          {description && (
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {description}
            </p>
          )}

          {/* Цена и объем для десктопа */}
          <div className="hidden md:flex gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span className="text-sm text-gray-400">Цена</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">{price} ₽</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <CubeIcon className="w-4 h-4" />
                <span className="text-sm text-gray-400">Объем</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">{volume} л</div>
            </div>
          </div>

          {/* Оценки в стиле главной страницы */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
                <EyeIcon className="w-5 h-5" />
                <span className="text-gray-300">Вид:</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">{apperanceScore}</div>
              <div className="text-xs text-gray-500 mt-1">/5</div>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
                <SparklesIcon className="w-5 h-5" />
                <span className="text-gray-300">Аромат:</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">{aromaScore}</div>
              <div className="text-xs text-gray-500 mt-1">/5</div>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
                <HeartIcon className="w-5 h-5" />
                <span className="text-gray-300">Вкус:</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">{tasteScore}</div>
              <div className="text-xs text-gray-500 mt-1">/5</div>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
                <BeakerIcon className="w-5 h-5" />
                <span className="text-gray-300">Послевкусие:</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">{aftertasteScore}</div>
              <div className="text-xs text-gray-500 mt-1">/5</div>
            </div>
          </div>

          {/* Дата добавления */}
          <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-800 pt-4">
            <CalendarIcon className="w-4 h-4 text-amber-500" />
            <span>Добавлено: {formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};