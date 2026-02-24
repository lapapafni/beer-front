"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BeakerIcon,
  HeartIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { FaYoutube, FaTelegramPlane, FaTiktok } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'YouTube',
      icon: FaYoutube,
      href: 'https://www.youtube.com/@ilya',
      color: 'hover:text-red-500',
      bg: 'bg-red-500/10'
    },
    {
      name: 'Telegram',
      icon: FaTelegramPlane,
      href: 'https://t.me/tpestblack',
      color: 'hover:text-sky-500',
      bg: 'bg-sky-500/10'
    },
    {
      name: 'TikTok',
      icon: SiTiktok,
      href: 'https://www.tiktok.com/@ilya',
      color: 'hover:text-gray-300',
      bg: 'bg-gray-500/10'
    }
  ];

  const quickLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Рецензии', href: '/beers' },
    { name: 'Контакты', href: '/contact' },
  ];

  return (
    <footer className="relative z-10 bg-gradient-to-b from-[#0a0a0a] to-[#000000] text-white border-t border-gray-800/50">
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="group inline-block">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <BeakerIcon className="w-10 h-10 text-amber-500 group-hover:rotate-12 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                </div>
                <span className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                  Beer Archive
                </span>
              </div>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Искусство пива с Ильёй Юровским.  
              Редкие сорта, профессиональные дегустации и уникальное послевкусие.
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <HeartIcon className="w-4 h-4 text-amber-500" />
              <span>Сделано с любовью к пиву</span>
            </div>
          </div>

          {}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold text-amber-500 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
              Навигация
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-amber-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold text-amber-500 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
              Контакты
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:llpnskj@gmail.com"
                  className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2 group"
                >
                  <EnvelopeIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  llpnskj@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/ilja_paw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2 group"
                >
                  <PaperAirplaneIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Telegram автора
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/tpestblack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2 group"
                >
                  <PaperAirplaneIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Telegram Ильи
                </a>
              </li>
            </ul>
          </div>

          {}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold text-amber-500 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
              Мы в соцсетях
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`p-3 rounded-xl ${social.bg} ${social.color} transition-all group relative`}
                  >
                    <Icon size={24} />
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {social.name}
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {}
        <div className="border-t border-gray-800/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © {currentYear} Пивной архив Ильи Юровского. Все права защищены.
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-amber-500 transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-amber-500 transition-colors">
                Условия использования
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>Сделано с</span>
              <HeartIcon className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>в 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}