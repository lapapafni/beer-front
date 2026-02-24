"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { deleteReview, getByUser } from "@/app/services/review";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import Toast from "@/app/components/ui/Toast";
import { getRoleLabel } from "../scripts/roles";
import { motion, AnimatePresence } from "framer-motion";
import DecorativeBackground from "@/app/components/ui/DecorativeBackground";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { 
  UserCircleIcon,
  DocumentTextIcon,
  StarIcon,
  CalendarIcon,
  TrashIcon,
  TrophyIcon,
  EyeIcon,
  SparklesIcon,
  HeartIcon,
  BeakerIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Review {
  id: number;
  content: string;
  apperanceScore: number;
  aromaScore: number;
  tasteScore: number;
  aftertasteScore: number;
  createdAt: string;
  Beer?: {
    id: number;
    name: string;
  };
}

export default function MePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    undo?: () => void;
  } | null>(null);

  const [deletedCache, setDeletedCache] = useState<Review | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      getByUser(user.id)
        .then((data) => setReviews(data.items || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const username = user?.username || "Пользователь";
  const firstLetter = username.charAt(0).toUpperCase();

  const averageScore =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => {
            const avg =
              (r.apperanceScore +
                r.aromaScore +
                r.tasteScore +
                r.aftertasteScore) /
              4;
            return acc + avg;
          }, 0) / reviews.length
        ).toFixed(1)
      : "0";

  const handleDeleteClick = (review: Review) => {
    setSelectedReview(review);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedReview) return;

    const reviewToDelete = selectedReview;

    setReviews((prev) =>
      prev.filter((r) => r.id !== reviewToDelete.id)
    );

    setDeletedCache(reviewToDelete);

    const timer = setTimeout(async () => {
      await deleteReview(reviewToDelete.id);
      setDeletedCache(null);
      setDeleteTimer(null);
    }, 5000);

    setDeleteTimer(timer);

    setToast({
      message: "Рецензия удалена",
      undo: () => {
        if (deleteTimer) {
          clearTimeout(timer);
        }

        setReviews((prev) => [reviewToDelete, ...prev]);
        setDeletedCache(null);
        setToast(null);
      },
    });

    setConfirmOpen(false);
  };

  // Статистика по оценкам
  const scoreStats = {
    appearance: reviews.reduce((acc, r) => acc + r.apperanceScore, 0) / (reviews.length || 1),
    aroma: reviews.reduce((acc, r) => acc + r.aromaScore, 0) / (reviews.length || 1),
    taste: reviews.reduce((acc, r) => acc + r.tasteScore, 0) / (reviews.length || 1),
    aftertaste: reviews.reduce((acc, r) => acc + r.aftertasteScore, 0) / (reviews.length || 1),
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white px-6 md:px-20 py-24 font-sans">
      {/* Декоративный фон */}
      <DecorativeBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Профиль пользователя */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121212] rounded-3xl shadow-lg border border-gray-800 overflow-hidden mb-12"
        >
          {/* Шапка профиля с градиентом */}
          <div className="h-32 bg-gradient-to-r from-amber-600/20 to-amber-400/20 relative">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
          </div>

          <div className="px-8 pb-8">
            {/* Аватар */}
            <div className="flex items-end gap-6 -mt-16">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-[#121212]">
                  {firstLetter}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-[#121212] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex-1 pt-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  {username}
                  <span className="text-sm font-normal px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/30">
                    {getRoleLabel(user?.role)}
                  </span>
                </h1>
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <CalendarIcon className="w-4 h-4" />
                  На платформе с {new Date().toLocaleDateString("ru-RU")}
                </p>
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  <span className="text-sm text-gray-400">Рецензий</span>
                </div>
                <p className="text-3xl font-bold text-amber-500">{reviews.length}</p>
              </div>

              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <StarIconSolid className="w-5 h-5" />
                  <span className="text-sm text-gray-400">Средняя</span>
                </div>
                <p className="text-3xl font-bold text-amber-500">{averageScore}</p>
              </div>

              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <ChartBarIcon className="w-5 h-5" />
                  <span className="text-sm text-gray-400">Всего оценок</span>
                </div>
                <p className="text-3xl font-bold text-amber-500">{reviews.length * 4}</p>
              </div>

              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <TrophyIcon className="w-5 h-5" />
                  <span className="text-sm text-gray-400">Активность</span>
                </div>
                <p className="text-3xl font-bold text-amber-500">
                  {reviews.length > 10 ? '🔥' : '🌱'}
                </p>
              </div>
            </div>

            {/* Детальная статистика по оценкам */}
            {reviews.length > 0 && (
              <div className="mt-8 p-6 bg-gray-800/20 rounded-xl border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-amber-500" />
                  Статистика оценок
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatBar 
                    label="Внешний вид" 
                    value={scoreStats.appearance} 
                    icon={EyeIcon}
                    color="from-amber-500 to-orange-500"
                  />
                  <StatBar 
                    label="Аромат" 
                    value={scoreStats.aroma} 
                    icon={SparklesIcon}
                    color="from-emerald-500 to-teal-500"
                  />
                  <StatBar 
                    label="Вкус" 
                    value={scoreStats.taste} 
                    icon={HeartIcon}
                    color="from-blue-500 to-indigo-500"
                  />
                  <StatBar 
                    label="Послевкусие" 
                    value={scoreStats.aftertaste} 
                    icon={BeakerIcon}
                    color="from-purple-500 to-pink-500"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Рецензии пользователя */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <DocumentTextIcon className="w-6 h-6 text-amber-500" />
            Мои рецензии
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({reviews.length})
            </span>
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="md" icon={DocumentTextIcon} />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 bg-gray-900/30 rounded-3xl border border-gray-800">
              <DocumentTextIcon className="w-20 h-20 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                У вас пока нет рецензий
              </p>
              <button
                onClick={() => router.push('/beers')}
                className="mt-4 px-6 py-3 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-black transition-all font-semibold"
              >
                Найти пиво для отзыва
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <AnimatePresence>
                {reviews.map((r, index) => {
                  const totalScore = (
                    (r.apperanceScore + r.aromaScore + r.tasteScore + r.aftertasteScore) / 4
                  ).toFixed(1);

                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      onClick={() => {
                        if (r.Beer?.id) {
                          router.push(`/beers/${r.Beer.id}`);
                        }
                      }}
                      className="group relative bg-[#121212] rounded-2xl shadow-lg hover:shadow-amber-500/10 transition-all duration-300 border border-gray-800 hover:border-amber-500/30 cursor-pointer overflow-hidden"
                    >
                      {/* Легкий подсвет */}
                      <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-5 blur-xl transition-opacity pointer-events-none" />

                      <div className="relative z-10 p-6">
                        {/* Заголовок */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold group-hover:text-amber-500 transition-colors">
                              {r.Beer?.name || "Без названия"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{new Date(r.createdAt).toLocaleDateString("ru-RU")}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Общая оценка */}
                            <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
                              <StarIconSolid className="w-4 h-4 text-amber-500" />
                              <span className="font-semibold text-amber-500">{totalScore}</span>
                            </div>

                            {/* Кнопка удаления */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(r);
                              }}
                              className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Текст рецензии */}
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {r.content}
                        </p>

                        {/* Оценки */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <ScoreBlock 
                            label="Внешний вид" 
                            value={r.apperanceScore} 
                            icon={EyeIcon}
                            color="text-amber-500"
                          />
                          <ScoreBlock 
                            label="Аромат" 
                            value={r.aromaScore} 
                            icon={SparklesIcon}
                            color="text-emerald-500"
                          />
                          <ScoreBlock 
                            label="Вкус" 
                            value={r.tasteScore} 
                            icon={HeartIcon}
                            color="text-blue-500"
                          />
                          <ScoreBlock 
                            label="Послевкусие" 
                            value={r.aftertasteScore} 
                            icon={BeakerIcon}
                            color="text-purple-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.section>

        {/* Ачивки (заблокировано) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#121212] rounded-3xl shadow-lg border border-gray-800 p-8 opacity-50 cursor-not-allowed relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-[1px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-400">
              <TrophyIcon className="w-6 h-6" />
              Достижения
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AchievementCard
                title="Первая рецензия"
                description="Оставьте свой первый отзыв"
                icon={DocumentTextIcon}
                unlocked={reviews.length > 0}
              />
              <AchievementCard
                title="Пивной энтузиаст"
                description="10 рецензий"
                icon={StarIcon}
                unlocked={reviews.length >= 10}
              />
              <AchievementCard
                title="Знаток вкуса"
                description="Средняя оценка выше 4.5"
                icon={HeartIcon}
                unlocked={parseFloat(averageScore) > 4.5}
              />
              <AchievementCard
                title="Пивной гуру"
                description="25 рецензий"
                icon={TrophyIcon}
                unlocked={reviews.length >= 25}
              />
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              Достижения появятся в следующем обновлении
            </div>
          </div>
        </motion.section>
      </div>

      {/* Модалка подтверждения */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Удалить рецензию?"
        description="Это действие нельзя отменить. Рецензия будет безвозвратно удалена."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Toast уведомление */}
      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.undo ? "Отменить" : undefined}
          onAction={toast.undo}
        />
      )}
    </main>
  );
}

// Компонент для отображения оценки с иконкой
function ScoreBlock({ 
  label, 
  value, 
  icon: Icon,
  color 
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className={`font-bold ${color}`}>
        {value} / 5
      </p>
    </div>
  );
}

// Компонент для статистической шкалы
function StatBar({ 
  label, 
  value, 
  icon: Icon,
  color 
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType;
  color: string;
}) {
  const percentage = (value / 5) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-amber-500" />
          <span className="text-gray-400">{label}</span>
        </div>
        <span className="font-bold text-amber-500">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Компонент карточки достижения
function AchievementCard({ 
  title, 
  description, 
  icon: Icon,
  unlocked 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  unlocked: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border ${unlocked ? 'border-amber-500/30 bg-amber-500/5' : 'border-gray-700/30 bg-gray-800/20'} transition-all`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${unlocked ? 'bg-amber-500/20' : 'bg-gray-700/30'}`}>
          <Icon className={`w-5 h-5 ${unlocked ? 'text-amber-500' : 'text-gray-600'}`} />
        </div>
        <div>
          <h3 className={`font-semibold ${unlocked ? 'text-amber-500' : 'text-gray-500'}`}>
            {title}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
