"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCircleIcon,
  EyeIcon,
  SparklesIcon,
  HeartIcon,
  BeakerIcon,
  CalendarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from "@/app/hooks/useAuth";
import { deleteReview } from "@/app/services/review";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import Toast from "@/app/components/ui/Toast";

interface Props {
  id: number;
  User: {
    id: number;
    username: string;
  };
  content: string;
  apperanceScore: number;
  aromaScore: number;
  tasteScore: number;
  aftertasteScore: number;
  createdAt: string;
  updatedAt?: string;
  beerId?: number;
  userId?: number;
  onDelete?: (id: number) => void;
}

export const CardReview: React.FC<Props> = ({
  id,
  User,
  content,
  apperanceScore,
  aromaScore,
  tasteScore,
  aftertasteScore,
  createdAt,
  onDelete,
}) => {
  const { hasRole } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteReview(id);
      setIsDeleted(true);
      setShowDeleteModal(false);
      setShowToast(true);
      
      if (onDelete) {
        onDelete(id);
      }
      
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      
    } catch (error) {
      console.error("Ошибка при удалении отзыва:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  
  const canDelete = hasRole("moderator") || hasRole("admin");

  return (
    <>
      <AnimatePresence>
        {!isDeleted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            className="group relative bg-[#121212] p-6 rounded-2xl shadow-lg hover:shadow-amber-500/10 transition-all duration-300 border border-gray-800 hover:border-amber-500/30"
          >
            {}
            <div className="absolute inset-0 rounded-2xl bg-amber-500 opacity-0 group-hover:opacity-5 blur-xl transition-opacity pointer-events-none" />

            <div className="relative z-10 flex gap-4">
              {}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {getInitials(User.username)}
                </div>
              </div>

              {}
              <div className="flex-1">
                {}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-lg group-hover:text-amber-500 transition-colors">
                      {User.username}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(createdAt).toLocaleDateString("ru-RU")}</span>
                    </div>
                    
                    {}
                    {canDelete && (
                      <button
                        onClick={handleDeleteClick}
                        disabled={deleting}
                        className="p-1.5 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                        title="Удалить отзыв"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {}
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {content}
                </p>

                {}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="flex items-center gap-1 bg-gray-800/30 p-2 rounded-lg">
                    <EyeIcon className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-300">Вид:</span>
                    <span className="font-bold text-amber-500 ml-auto">{apperanceScore}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-800/30 p-2 rounded-lg">
                    <SparklesIcon className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-300">Аромат:</span>
                    <span className="font-bold text-amber-500 ml-auto">{aromaScore}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-800/30 p-2 rounded-lg">
                    <HeartIcon className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-300">Вкус:</span>
                    <span className="font-bold text-amber-500 ml-auto">{tasteScore}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-800/30 p-2 rounded-lg">
                    <BeakerIcon className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-300">Послевкусие:</span>
                    <span className="font-bold text-amber-500 ml-auto">{aftertasteScore}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Удалить отзыв?"
        description={`Вы уверены, что хотите удалить отзыв пользователя ${User.username}? Это действие нельзя отменить.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {}
      {showToast && (
        <Toast
          message="Ревью успешно удален"
        />
      )}
    </>
  );
};