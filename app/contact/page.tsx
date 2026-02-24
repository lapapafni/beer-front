"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import DecorativeBackground from "@/app/components/ui/DecorativeBackground";
import { 
  EnvelopeIcon,
  PaperAirplaneIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  HeartIcon,
  UserIcon,
  BeakerIcon,
  ArrowLeftIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function ContactsPage() {
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
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            На главную
          </Link>
        </motion.div>

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Контакты и поддержка
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Свяжитесь с нами по любым вопросам или поддержите проект
          </p>
        </motion.div>

        {/* Автор сайта */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative bg-[#121212] rounded-3xl shadow-lg border border-gray-800 overflow-hidden mb-8 hover:border-amber-500/30 transition-all"
        >
          <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-5 blur-xl transition-opacity pointer-events-none" />
          
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-amber-400">Автор сайта</h2>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Если у вас есть вопросы по работе сайта, предложения по улучшению 
              или вы нашли ошибку — пишите автору сайта. Мы обязательно ответим!
            </p>

            <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <EnvelopeIcon className="w-5 h-5 text-amber-500" />
                <span className="text-gray-400">Email для связи:</span>
              </div>
              <a
                href="mailto:llpnskj@gmail.com"
                className="text-xl text-amber-400 hover:text-amber-300 transition-colors break-all"
              >
                llpnskj@gmail.com
              </a>
            </div>

            <div className="flex justify-center">
              <a
                href="https://t.me/ilja_paw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-sky-500/30 transition-all group"
              >
                <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Написать в Telegram
              </a>
            </div>
          </div>
        </motion.section>

        {/* Автор рецензий */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative bg-[#121212] rounded-3xl shadow-lg border border-gray-800 overflow-hidden mb-8 hover:border-amber-500/30 transition-all"
        >
          <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-5 blur-xl transition-opacity pointer-events-none" />
          
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl">
                <BeakerIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-amber-400">Автор рецензий</h2>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Все рецензии на пиво создаются Ильёй Юровским. Здесь вы можете обсудить рецензии, 
              узнать новости о проекте или предложить сотрудничество.
            </p>

            <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <EnvelopeIcon className="w-5 h-5 text-amber-500" />
                <span className="text-gray-400">Почта для сотрудничества:</span>
              </div>
              <a
                href="mailto:ilya.yurovsky@example.com"
                className="text-xl text-amber-400 hover:text-amber-300 transition-colors break-all"
              >
                ilya.yurovsky@example.com
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <a
                href="https://t.me/tpestblack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white p-4 rounded-xl hover:shadow-lg hover:shadow-sky-500/30 transition-all group"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                <span className="font-semibold">Telegram</span>
              </a>
              
              <a
                href="https://www.youtube.com/@ilya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white p-4 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all group"
              >
                <VideoCameraIcon className="w-5 h-5" />
                <span className="font-semibold">YouTube</span>
              </a>
              
              <a
                href="https://www.tiktok.com/@ilya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 rounded-xl hover:shadow-lg hover:shadow-gray-700/30 transition-all group md:col-span-1 col-span-2"
              >
                <MusicalNoteIcon className="w-5 h-5" />
                <span className="font-semibold">TikTok</span>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Донаты - только DonationAlerts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative bg-[#121212] rounded-3xl shadow-lg border border-gray-800 overflow-hidden"
        >
          <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-5 blur-xl transition-opacity pointer-events-none" />
          
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl">
                <HeartIconSolid className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-amber-400">Поддержать проект</h2>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed text-center max-w-2xl mx-auto">
              Если вам нравятся рецензии и контент, вы можете поддержать Илью донатом.  
              Это помогает создавать новые обзоры и дегустации, а также развивать проект.
            </p>

            {/* Одна карточка DonationAlerts */}
            <div className="flex justify-center">
              <a
                href="https://www.donationalerts.com/r/ilya"
                target="_blank"
                rel="noopener noreferrer"
                className="group/donate relative w-full max-w-md bg-gradient-to-br from-red-500 to-pink-500 p-8 rounded-2xl hover:shadow-2xl hover:shadow-red-500/30 transition-all text-center"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover/donate:opacity-10 rounded-2xl transition-opacity" />
                
                <div className="relative z-10">
                  <HeartIconSolid className="w-20 h-20 mx-auto mb-4 text-white" />
                  
                  <h3 className="text-3xl font-bold mb-3 text-white">
                    DonationAlerts
                  </h3>
                  
                  <p className="text-white/90 mb-4">
                    Поддержать разовым донатом
                  </p>

                  <div className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur-sm">
                    <HeartIcon className="w-5 h-5" />
                    Поддержать
                  </div>
                </div>
              </a>
            </div>

            <div className="mt-8 p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
              <p className="text-sm text-gray-400 text-center flex items-center justify-center gap-2">
                <GiftIcon className="w-4 h-4 text-amber-500" />
                Все донаты идут на развитие канала и покупку новых сортов пива для обзоров
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
