"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBeerById } from "@/app/services/beer";
import { createReview, getByBeer } from "@/app/services/review";
import { Beer } from "@/app/interfaces/beer";
import { Review } from "@/app/interfaces/review";
import { CardReview } from "@/app/components/CardReview";
import { BeerInfo } from "@/app/components/BeerInfo";
import { Notification } from "@/app/components/Notification";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import { buildAssetUrl } from "@/app/utils/media";
import DecorativeBackground from "@/app/components/ui/DecorativeBackground";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { 
  ArrowLeftIcon,
  BeakerIcon,
  PencilSquareIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  SparklesIcon,
  HeartIcon,
  BeakerIcon as AftertasteIcon,
  DocumentTextIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { deleteBeer } from "@/app/services/beer";

interface BeerWithImage extends Beer {
  imagePath?: string;
  imageUrl?: string;
}

interface NotificationState {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message?: string;
}

export default function BeerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, hasRole } = useAuth();
  

  const [beer, setBeer] = useState<BeerWithImage | null>(null);
  const [loadingBeer, setLoadingBeer] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [content, setContent] = useState("");
  const [scores, setScores] = useState({
    apperanceScore: 5,
    aromaScore: 5,
    tasteScore: 5,
    aftertasteScore: 5,
  });
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: ''
  });

  const showNotification = (type: 'success' | 'error', title: string, message?: string) => {
    setNotification({
      show: true,
      type,
      title,
      message
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    if (!params?.id) return;
    setLoadingBeer(true);
    getBeerById(Number(params.id))
      .then((data) => setBeer(data))
      .catch((err) => {
        console.error(err);
        showNotification('error', 'Ошибка загрузки', 'Не удалось загрузить информацию о пиве');
      })
      .finally(() => setLoadingBeer(false));
  }, [params?.id]);

  useEffect(() => {
    if (!params?.id) return;
    setLoadingReviews(true);
    getByBeer(Number(params.id))
      .then((data) => setReviews(data.items))
      .catch((err) => {
        console.error(err);
        showNotification('error', 'Ошибка загрузки', 'Не удалось загрузить отзывы');
      })
      .finally(() => setLoadingReviews(false));
  }, [params?.id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      showNotification('error', 'Ошибка', 'Напишите текст отзыва');
      return;
    }

    if (content.length < 5) {
      showNotification('error', 'Ошибка', 'Отзыв должен содержать минимум 10 символов');
      return;
    }

    setSubmitting(true);
    
    try {
      const review = {
        content,
        beerId: Number(params.id),
        apperanceScore: scores.apperanceScore,
        aromaScore: scores.aromaScore,
        tasteScore: scores.tasteScore,
        aftertasteScore: scores.aftertasteScore
      };
      
      const newReview = await createReview(review);
      setReviews(prevReviews => [newReview, ...prevReviews]);
      
      setContent("");
      setScores({
        apperanceScore: 5,
        aromaScore: 5,
        tasteScore: 5,
        aftertasteScore: 5,
      });
      
      showNotification('success', 'Отзыв опубликован', 'Спасибо за ваше мнение!');
      
    } catch (error: any) {
      console.error("Ошибка при создании отзыва:", error);
      
      const errorMessage = error.message || 'Неизвестная ошибка';
      const status = error.status;
      
      let title = 'Ошибка';
      if (status === 401) title = 'Ошибка авторизации';
      else if (status === 403) title = 'Доступ запрещен';
      else if (status === 400) title = 'Ошибка валидации';
      else if (status === 409) title = 'Повторный отзыв';
      else if (status === 500) title = 'Ошибка сервера';
      
      showNotification('error', title, errorMessage);
      
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteBeer(Number(params.id));
      showNotification('success', 'Пиво удалено', 'Перенаправляем на список...');
      setTimeout(() => {
        router.push('/beers');
      }, 2000);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      showNotification('error', 'Ошибка', 'Не удалось удалить пиво');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const ratingConfig = [
    {
      key: "apperanceScore",
      title: "Внешний вид",
      description: "Цвет, прозрачность, пена и подача",
      icon: EyeIcon,
      color: "#f59e0b",
    },
    {
      key: "aromaScore",
      title: "Аромат",
      description: "Насыщенность запаха и глубина оттенков",
      icon: SparklesIcon,
      color: "#10b981",
    },
    {
      key: "tasteScore",
      title: "Вкус",
      description: "Баланс, сладость, горечь, кислотность",
      icon: HeartIcon,
      color: "#3b82f6",
    },
    {
      key: "aftertasteScore",
      title: "Послевкусие",
      description: "Длительность и приятность финала",
      icon: AftertasteIcon,
      color: "#a855f7",
    },
  ];

  if (loadingBeer)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (!beer)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <BeakerIcon className="w-24 h-24 text-gray-700 mx-auto mb-4" />
          <h1 className="text-2xl text-gray-400">
            Пиво не найдено
          </h1>
          <Link 
            href="/beers" 
            className="inline-block mt-4 text-amber-500 hover:text-amber-400 transition"
          >
            ← Вернуться к списку
          </Link>
        </div>
      </div>
    );

  const renderSliderBlock = (
    key: keyof typeof scores,
    title: string,
    description: string,
    icon: React.ElementType,
    color: string
  ) => {
    const percentage = ((scores[key] - 1) / 4) * 100;
    const Icon = icon;

    return (
      <div key={key} className="relative bg-[#141414] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <Icon className="w-6 h-6 mt-1" style={{ color }} />
            <div>
              <h3
                className="text-lg md:text-xl font-semibold group-hover:text-amber-500 transition-colors"
                style={{ color }}
              >
                {title}
              </h3>
              <p className="text-sm text-gray-400 mt-1 max-w-[240px]">
                {description}
              </p>
            </div>
          </div>

          <span
            className="text-3xl font-bold group-hover:scale-110 transition-transform"
            style={{ color }}
          >
            {scores[key]}
          </span>
        </div>

        <div className="flex justify-between text-sm md:text-base text-gray-500 px-1 mb-2 font-medium">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>

        <div className="relative">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={scores[key]}
            onChange={(e) =>
              setScores({ ...scores, [key]: Number(e.target.value) })
            }
            style={{
              background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #2a2a2a ${percentage}%, #2a2a2a 100%)`,
            }}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>
    );
  };

  const imageUrl = buildAssetUrl(beer.imageUrl ?? beer.imagePath);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6 md:px-20 font-sans">
      {/* Уведомление */}
      <Notification
        show={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={closeNotification}
      />

      {/* Модалка подтверждения удаления */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Удалить пиво?"
        description={`Вы уверены, что хотите удалить "${beer.name}"? Это действие нельзя отменить.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Декоративный фон как на главной */}
      <DecorativeBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Кнопка назад и действия админа */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link 
            href="/beers" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Назад к списку
          </Link>

          {/* Кнопки для админа - теперь с явной проверкой */}
          {isAuthenticated && hasRole('admin') && (
            <div className="flex items-center gap-3">
              <Link
                href={`/beers/${params.id}/edit`}
                className="inline-flex items-center gap-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 px-4 py-2 rounded-xl transition-all border border-amber-500/30"
              >
                <PencilSquareIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Редактировать</span>
              </Link>
              
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className="inline-flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 px-4 py-2 rounded-xl transition-all border border-red-500/30 disabled:opacity-50"
              >
                <TrashIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Удалить</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Информация о пиве - BeerInfo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BeerInfo
            id={beer.id}
            name={beer.name}
            description={beer.description}
            price={beer.price}
            volume={beer.volume}
            apperanceScore={beer.apperanceScore}
            aromaScore={beer.aromaScore}
            tasteScore={beer.tasteScore}
            aftertasteScore={beer.aftertasteScore}
            createdAt={beer.createdAt}
            imageUrl={imageUrl}
          />
        </motion.div>

        {/* Заголовок для отзывов */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center flex items-center justify-center gap-3"
        >
          {isAuthenticated ? (
            <>
              <PencilSquareIcon className="w-8 h-8 text-amber-500" />
              Оцените и вы
            </>
          ) : (
            <>
              <ChatBubbleLeftIcon className="w-8 h-8 text-amber-500" />
              Отзывы
            </>
          )}
        </motion.h2>

        {/* Блок оценок для авторизованных */}
        {isAuthenticated ? (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {ratingConfig.map(({ key, title, description, icon, color }) =>
                renderSliderBlock(
                  key as keyof typeof scores,
                  title,
                  description,
                  icon,
                  color
                )
              )}
            </div>

            <div className="mt-8">
              <textarea
                placeholder="Напишите свой отзыв... (минимум 10 символов)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-5 rounded-2xl bg-[#141414] border border-white/5 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition resize-none"
                rows={4}
                disabled={submitting}
              />

              <button
                onClick={handleAddReview}
                disabled={submitting || content.length < 5}
                className="mt-4 px-10 py-4 bg-amber-600 hover:bg-amber-500 rounded-2xl transition font-semibold text-lg shadow-lg hover:shadow-amber-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="w-5 h-5" />
                    Опубликовать отзыв
                  </>
                )}
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#121212] p-8 rounded-3xl shadow-xl mb-16 text-center border border-gray-800"
          >
            <h3 className="text-2xl font-serif font-bold mb-3 text-gray-300 flex items-center justify-center gap-2">
              <ChatBubbleLeftIcon className="w-6 h-6 text-amber-500" />
              Чтобы оставлять оценки, нужно{" "}
              <Link href="/login" className="text-amber-500 hover:text-amber-400 transition">
                авторизоваться
              </Link>
            </h3>
          </motion.div>
        )}

        {/* Отзывы */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center flex items-center justify-center gap-2">
            <ChatBubbleLeftIcon className="w-8 h-8 text-amber-500" />
            Все отзывы ({reviews.length})
          </h2>

          {loadingReviews ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftIcon className="w-20 h-20 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                Пока нет отзывов. Будьте первым!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map((r, index) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CardReview
                    id={r.id}
                    User={r.User}
                    content={r.content}
                    apperanceScore={r.apperanceScore}
                    aromaScore={r.aromaScore}
                    tasteScore={r.tasteScore}
                    aftertasteScore={r.aftertasteScore}
                    createdAt={r.createdAt}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}
