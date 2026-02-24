"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { createBeer } from "@/app/services/beer";
import { motion } from "framer-motion";
import Link from "next/link";
import DecorativeBackground from "@/app/components/ui/DecorativeBackground";
import Image from "next/image";
import { 
  BeakerIcon,
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  EyeIcon,
  SparklesIcon,
  HeartIcon,
  BeakerIcon as AftertasteIcon,
  CurrencyDollarIcon,
  CubeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  description: string;
  price: string;
  volume: string;
  apperanceScore: number;
  aromaScore: number;
  tasteScore: number;
  aftertasteScore: number;
}

export default function SubmitPage() {
  const { isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Состояние формы
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    volume: "",
    apperanceScore: 3,
    aromaScore: 3,
    tasteScore: 3,
    aftertasteScore: 3,
  });

  // Проверка прав доступа
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!hasRole("admin")) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, hasRole, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (name: string, value: number) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Файл слишком большой. Максимальный размер 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Пожалуйста, выберите изображение");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Файл слишком большой. Максимальный размер 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Пожалуйста, выберите изображение");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Валидация
      if (!form.name.trim()) {
        throw new Error("Название пива обязательно");
      }

      if (!form.price || parseFloat(form.price) <= 0) {
        throw new Error("Укажите корректную цену");
      }

      if (!form.volume || parseFloat(form.volume) <= 0) {
        throw new Error("Укажите корректный объем");
      }

      // Создаем FormData для отправки
      const submitData = new FormData();
      
      // Добавляем все поля
      submitData.append("name", form.name);
      submitData.append("description", form.description);
      submitData.append("price", form.price);
      submitData.append("volume", form.volume);
      submitData.append("apperanceScore", form.apperanceScore.toString());
      submitData.append("aromaScore", form.aromaScore.toString());
      submitData.append("tasteScore", form.tasteScore.toString());
      submitData.append("aftertasteScore", form.aftertasteScore.toString());
      
      // Добавляем изображение, если есть
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      await createBeer(submitData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/beers");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Ошибка при создании пива");
    } finally {
      setLoading(false);
    }
  };

  const ratingConfig = [
    {
      key: "apperanceScore",
      label: "Внешний вид",
      description: "Цвет, прозрачность, пена",
      icon: EyeIcon,
      color: "#f59e0b",
    },
    {
      key: "aromaScore",
      label: "Аромат",
      description: "Насыщенность, оттенки",
      icon: SparklesIcon,
      color: "#10b981",
    },
    {
      key: "tasteScore",
      label: "Вкус",
      description: "Баланс, горечь, сладость",
      icon: HeartIcon,
      color: "#3b82f6",
    },
    {
      key: "aftertasteScore",
      label: "Послевкусие",
      description: "Длительность, приятность",
      icon: AftertasteIcon,
      color: "#a855f7",
    },
  ];

  if (!isAuthenticated || !hasRole("admin")) {
    return null;
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-20 px-6 md:px-20 font-sans">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4">Пиво успешно добавлено!</h1>
          <p className="text-gray-400 mb-8">Сейчас вы будете перенаправлены к списку</p>
          
          <Link
            href="/beers"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Вернуться к списку
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-20 px-6 md:px-20 font-sans">
      {/* Декоративный фон */}
      <DecorativeBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Кнопка назад */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/beers" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Назад к списку
          </Link>
        </motion.div>

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Добавить новое пиво
          </h1>
          <p className="text-gray-400 text-lg">
            Заполните форму для добавления нового сорта в коллекцию
          </p>
        </motion.div>

        {/* Форма */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Ошибка */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <ExclamationCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Основная информация */}
          <div className="bg-[#121212] rounded-3xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <DocumentTextIcon className="w-6 h-6 text-amber-500" />
              Основная информация
            </h2>

            <div className="space-y-6">
              {/* Название */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Название пива *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Введите название пива"
                />
              </div>

              {/* Описание */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Описание
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  placeholder="Опишите вкус, аромат, особенности..."
                />
              </div>

              {/* Цена и объем */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      Цена (₽) *
                    </span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <CubeIcon className="w-4 h-4" />
                      Объем (л) *
                    </span>
                  </label>
                  <input
                    type="number"
                    name="volume"
                    value={form.volume}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Изображение */}
          <div className="bg-[#121212] rounded-3xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <PhotoIcon className="w-6 h-6 text-amber-500" />
              Изображение
            </h2>

            {!imagePreview ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center
                  transition-all cursor-pointer
                  ${dragActive 
                    ? 'border-amber-500 bg-amber-500/5' 
                    : 'border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/30'
                  }
                `}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                <PhotoIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 mb-2">
                  Перетащите изображение сюда или кликните для выбора
                </p>
                <p className="text-sm text-gray-600">
                  PNG, JPG, WEBP до 5MB
                </p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-[300px] object-contain bg-gray-900"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Оценки */}
          <div className="bg-[#121212] rounded-3xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <StarIcon className="w-6 h-6 text-amber-500" />
              Оценки
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ratingConfig.map((item) => {
                const Icon = item.icon;
                const value = form[item.key as keyof FormData] as number;
                const percentage = ((value - 1) / 4) * 100;

                return (
                  <div key={item.key} className="bg-gray-800/30 p-6 rounded-2xl">
                    <div className="flex items-start gap-3 mb-4">
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                      <div>
                        <h3 className="font-semibold">{item.label}</h3>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={value}
                        onChange={(e) => handleScoreChange(item.key, parseInt(e.target.value))}
                        style={{
                          background: `linear-gradient(to right, ${item.color} 0%, ${item.color} ${percentage}%, #2a2a2a ${percentage}%, #2a2a2a 100%)`,
                        }}
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-2xl font-bold" style={{ color: item.color }}>
                        {value}
                      </span>
                    </div>

                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Кнопка отправки */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Добавление...
                </>
              ) : (
                <>
                  <BeakerIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Добавить пиво
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
