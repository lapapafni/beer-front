"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { getBeerById, updateBeer } from "@/app/services/beer";
import { motion } from "framer-motion";
import Link from "next/link";
import { buildAssetUrl } from "@/app/utils/media";
import DecorativeBackground from "@/app/components/ui/DecorativeBackground";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
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
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface Beer {
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
  imagePath?: string;
  imageUrl?: string;
}

export default function EditBeerPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, hasRole } = useAuth();
  
  const [beer, setBeer] = useState<Beer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  // Состояние формы
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    volume: "",
    apperanceScore: 3,
    aromaScore: 3,
    tasteScore: 3,
    aftertasteScore: 3,
  });

  // Проверка прав доступа - только для админа
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

  // Загрузка данных пива
  useEffect(() => {
    if (!params?.id || !hasRole("admin")) return;
    
    const fetchBeer = async () => {
      try {
        const data = await getBeerById(Number(params.id));
        setBeer(data);
        
        // Заполняем форму
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          volume: data.volume?.toString() || "",
          apperanceScore: data.apperanceScore || 3,
          aromaScore: data.aromaScore || 3,
          tasteScore: data.tasteScore || 3,
          aftertasteScore: data.aftertasteScore || 3,
        });

        // Устанавливаем предпросмотр изображения
        if (data.imageUrl || data.imagePath) {
          const url = buildAssetUrl(data.imageUrl ?? data.imagePath);
          if (url) {
            setImagePreview(url);
          }
        }

      } catch (err) {
        console.error("Ошибка загрузки пива:", err);
        setError("Не удалось загрузить данные пива");
      } finally {
        setLoading(false);
      }
    };

    fetchBeer();
  }, [params?.id, hasRole]);

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
      setRemoveCurrentImage(false); // Не удаляем текущее, а заменяем
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
      setRemoveCurrentImage(false);
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
    setRemoveCurrentImage(true); // Помечаем, что нужно удалить текущее изображение
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
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
    
    // Добавляем новое изображение, если есть
    if (imageFile) {
      submitData.append("image", imageFile);
    }
    
    // Если нужно удалить текущее изображение
    if (removeCurrentImage && !imageFile) {
      submitData.append("removeImage", "true");
    }

    await updateBeer(Number(params.id), submitData);
    
    setSuccess(true);
    setTimeout(() => {
      router.push(`/beers/${params.id}`);
    }, 2000);
    
  } catch (err: any) {
    console.error("Ошибка при обновлении:", err);
    setError(err.message || "Ошибка при обновлении пива");
  } finally {
    setSubmitting(false);
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

  // Показываем заглушку если нет прав
  if (isAuthenticated && !hasRole("admin")) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-20 px-6 md:px-20 font-sans">
        <div className="max-w-4xl mx-auto text-center">
          <ExclamationCircleIcon className="w-24 h-24 text-red-500/50 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-gray-400 mb-8">
            Только администраторы могут редактировать пиво
          </p>
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

  if (!isAuthenticated) {
    return null; // Редирект произойдет в useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
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
          
          <h1 className="text-4xl font-bold mb-4">Пиво успешно обновлено!</h1>
          <p className="text-gray-400 mb-8">Сейчас вы будете перенаправлены</p>
          
          <Link
            href={`/beers/${params.id}`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Вернуться к пиву
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
            href={`/beers/${params.id}`} 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Назад к пиву
          </Link>
        </motion.div>

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <PencilSquareIcon className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Редактировать пиво
          </h1>
          <p className="text-gray-400 text-lg">
            Измените информацию о сорте пива
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
                  {beer?.imagePath ? 'Заменить изображение' : 'Добавить изображение'}
                </p>
                <p className="text-sm text-gray-600">
                  Перетащите файл сюда или кликните для выбора
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
                  className="w-full max-h-[300px] object-contain bg-gray-900 rounded-xl"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-3 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="p-3 bg-amber-500/80 hover:bg-amber-500 rounded-full transition-colors"
                  >
                    <PhotoIcon className="w-6 h-6 text-white" />
                  </button>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
            
            {beer?.imagePath && !imageFile && !removeCurrentImage && (
              <p className="text-sm text-gray-500 mt-2">
                Текущее изображение будет сохранено
              </p>
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
                const value = form[item.key as keyof typeof form] as number;
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
          <div className="flex justify-end gap-4">
            <Link
              href={`/beers/${params.id}`}
              className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl font-semibold text-lg transition-all"
            >
              Отмена
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <PencilSquareIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
