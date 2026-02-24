/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BeakerIcon,
  StarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  EyeIcon,
  HeartIcon,
  SparklesIcon as AromaIcon,
  BeakerIcon as AftertasteIcon,
  TrophyIcon,
  BookOpenIcon,
  ChatBubbleLeftIcon,
  ChevronDoubleDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Light {
  width: number;
  height: number;
  top: number;
  left: number;
  delay: number;
  opacity: number;
}

export default function Home() {
  const [lights, setLights] = useState<Light[]>([]);

  useEffect(() => {
    const generated = [...Array(15)].map(() => ({
      width: 10 + Math.random() * 20,
      height: 10 + Math.random() * 20,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setLights(generated);
  }, []);

  // Статистика
  const stats = [
    { label: 'Сортов пива', value: '150+', icon: BeakerIcon },
    { label: 'Рецензий', value: '100+', icon: ChatBubbleLeftIcon },
    { label: 'Довольных читателей', value: '20+', icon: UserGroupIcon },
    { label: 'Лет опыта', value: '5+', icon: TrophyIcon },
  ];

  // Преимущества
  const features = [
    {
      title: 'Экспертные оценки',
      description: 'Каждое пиво оценивается по 4 ключевым критериям: внешний вид, аромат, вкус и послевкусие',
      icon: StarIcon,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Уникальный опыт',
      description: 'Илья делится своим многолетним опытом и знаниями о пиве',
      icon: SparklesIcon,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Сообщество ценителей',
      description: 'Обсуждайте пиво, делитесь мнениями и находите единомышленников',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Редкие сорта',
      description: 'Обзоры на редкие и интересные сорта пива со всего мира',
      icon: BookOpenIcon,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  // Критерии оценки
  const criteria = [
    { name: 'Внешний вид', icon: EyeIcon, color: '#f59e0b' },
    { name: 'Аромат', icon: AromaIcon, color: '#10b981' },
    { name: 'Вкус', icon: HeartIcon, color: '#3b82f6' },
    { name: 'Послевкусие', icon: AftertasteIcon, color: '#a855f7' },
  ];

  return (
    <main className="relative w-full min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Пульсирующие огоньки */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {lights.map((light, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber-400 animate-pulseLight"
            style={{
              width: `${light.width}px`,
              height: `${light.height}px`,
              top: `${light.top}%`,
              left: `${light.left}%`,
              animationDelay: `${light.delay}s`,
              opacity: light.opacity,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0">
          <Image
            src="/beer-hero.jpg"
            alt="Legendary beer sommelier"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0a0a0a]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-wide drop-shadow-lg mb-6">
            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              Искусство пива
            </span>
            <br />
            <span className="text-4xl md:text-5xl text-gray-300">
              с Ильёй Юровским
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl max-w-3xl mx-auto drop-shadow-md font-sans text-gray-300 mb-8 leading-relaxed">
            Откройте мир пива глазами настоящего мастера.  
            Редкие сорта, профессиональные дегустации и уникальное послевкусие.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/beers"
              className="group inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-amber-500/30"
            >
              <BeakerIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              К рецензиям
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="#about"
              className="group inline-flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all backdrop-blur-sm border border-gray-700 hover:border-amber-500/50"
            >
              <UserGroupIcon className="w-5 h-5" />
              О мастере
            </Link>
          </div>

          {/* Критерии оценки */}
          <div className="flex justify-center gap-6 mt-16">
            {criteria.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center mb-2 mx-auto group-hover:border-amber-500/50 transition-colors">
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <span className="text-xs text-gray-400">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Скролл индикатор */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => {
            document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center hover:border-amber-500 transition-colors">
            <div className="w-1 h-2 bg-amber-500 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Статистика */}
      <section id="stats" className="relative z-10 py-20 px-6 md:px-20 bg-gradient-to-b from-transparent to-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#121212] p-6 rounded-2xl border border-gray-800 text-center group hover:border-amber-500/30 transition-all"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-amber-500 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Ilya */}
      <section id="about" className="relative z-10 py-32 px-6 md:px-20 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Фото Ильи */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-2/5"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900/30 to-amber-700/30 border border-gray-800 shadow-2xl group">
                {/* Здесь будет ваше фото */}
                <Image
                  src="/photo.jpg" // Замените на название вашего файла
                  alt="Илья Юровский - эксперт по пиву"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                
                {/* Градиент для затемнения */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Подпись */}
                <div className="absolute bottom-6 left-6">
                  <p className="text-3xl font-bold text-amber-500">Илья</p>
                  <p className="text-lg text-gray-300">Юровский</p>
                </div>

                {/* Декоративный элемент */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
              </div>
            </motion.div>

            {/* Текст */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-3/5"
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                О <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">легендарном</span> мастере
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <p className="text-lg md:text-xl leading-relaxed">
                  Илья Юровский — признанный эксперт в мире пива с более чем 5-летним опытом. 
                  За его плечами сотни продегустированных сортов, от классических европейских 
                  лагеров до редких крафтовых имперских стаутов.
                </p>

                <p className="text-lg md:text-xl leading-relaxed">
                  Его уникальный подход к оценке пива основан на четырех ключевых критериях, 
                  что позволяет давать максимально объективную и полную характеристику каждому сорту.
                </p>

                <div className="bg-amber-500/5 p-6 rounded-2xl border border-amber-500/20">
                  <p className="text-lg italic text-amber-200">
                    "Пиво — это еще одно доказательство того, что Бог любит нас и хочет, чтобы мы были счастливы"
                  </p>
                  <p className="mt-2 text-amber-500 font-semibold">— Илья Юровский</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {criteria.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 bg-gray-800/30 p-3 rounded-xl">
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="relative z-10 py-32 px-6 md:px-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Мы создали уникальное пространство для настоящих ценителей пива
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-[#121212] p-8 rounded-3xl border border-gray-800 hover:border-amber-500/30 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/0 rounded-3xl transition-all" />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-amber-500" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-500 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6 md:px-20 bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-500/10 to-transparent p-12 rounded-3xl border border-amber-500/20"
          >
            <BeakerIcon className="w-20 h-20 text-amber-500 mx-auto mb-6" />
            
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              Готовы к дегустации?
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к сообществу ценителей пива. Изучайте рецензии, 
              оставляйте свои оценки и открывайте новые вкусы.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/beers"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-amber-500/30"
              >
                <BeakerIcon className="w-5 h-5" />
                Начать изучение
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all backdrop-blur-sm border border-gray-700 hover:border-amber-500/50"
              >
                <UserGroupIcon className="w-5 h-5" />
                Присоединиться
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulseLight {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
            filter: blur(5px);
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
            filter: blur(15px);
          }
        }

        .animate-pulseLight {
          animation: pulseLight 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}