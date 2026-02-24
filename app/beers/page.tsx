
"use client";

import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { getAllBeers } from "../services/beer";
import { buildAssetUrl } from "@/app/utils/media";
import DecorativeBackground from "../components/ui/DecorativeBackground";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  ArrowUpIcon,
  ArrowDownIcon,
  Squares2X2Icon,
  Bars3Icon,
  BeakerIcon
} from '@heroicons/react/24/outline';

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

export default function BeersPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("totalScore");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [ratedFilter, setRatedFilter] = useState<undefined | boolean>(undefined);
  const [hasImageFilter, setHasImageFilter] = useState<undefined | boolean>(undefined);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const limit = 9;

  const fetchBeers = async () => {
    setLoading(true);
    const data = await getAllBeers(page, limit, sort, order, ratedFilter, searchValue, hasImageFilter);
    setBeers(data.items);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchBeers();
  }, [page, sort, order, ratedFilter, searchValue, hasImageFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setSearchValue(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleDeleteBeer = (deletedId: number) => {
    
    setBeers(prevBeers => prevBeers.filter(beer => beer.id !== deletedId));
    
    
    if (beers.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      
      
      
    }
  };


  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-20 px-6 md:px-20 font-sans">
      {}
      <DecorativeBackground />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Пивной архив
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Рецензии и оценки от Ильи Юровского
          </p>
        </motion.div>

        {}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-8 justify-center items-center"
        >
          {}
          <div className="relative group">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-800/50 text-white p-3 pl-10 rounded-xl w-64 backdrop-blur-sm border border-gray-700 focus:border-amber-500 focus:outline-none transition-all group-hover:border-gray-600"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
          </div>

          {}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-800/50 text-white p-3 rounded-xl backdrop-blur-sm border border-gray-700 focus:border-amber-500 focus:outline-none transition-all appearance-none cursor-pointer hover:border-gray-600"
            style={{ paddingRight: '2.5rem' }}
          >
            <option value="totalScore">Общая оценка</option>
            <option value="tasteScore">Вкус</option>
            <option value="aromaScore">Аромат</option>
            <option value="apperanceScore">Внешний вид</option>
            <option value="aftertasteScore">Послевкусие</option>
            <option value="price">Цена</option>
            <option value="volume">Объем</option>
          </select>

          {}
          <button
            onClick={() => setOrder(order === "DESC" ? "ASC" : "DESC")}
            className="bg-gray-800/50 text-white p-3 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-amber-500 transition-all flex items-center gap-2"
          >
            {order === "DESC" ? (
              <ArrowDownIcon className="w-5 h-5" />
            ) : (
              <ArrowUpIcon className="w-5 h-5" />
            )}
            <span>{order === "DESC" ? "По убыванию" : "По возрастанию"}</span>
          </button>

          {}
          <select
            value={ratedFilter === undefined ? "" : ratedFilter ? "rated" : "unrated"}
            onChange={(e) => {
              if (e.target.value === "rated") setRatedFilter(true);
              else if (e.target.value === "unrated") setRatedFilter(false);
              else setRatedFilter(undefined);
            }}
            className="bg-gray-800/50 text-white p-3 rounded-xl backdrop-blur-sm border border-gray-700 focus:border-amber-500 focus:outline-none transition-all cursor-pointer hover:border-gray-600"
          >
            <option value="">Все пива</option>
            <option value="rated">Оцененные</option>
            <option value="unrated">Не оцененные</option>
          </select>
          {}
          <div className="flex gap-2 ml-2 bg-gray-800/30 rounded-xl p-1 backdrop-blur-sm border border-gray-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid" 
                  ? "bg-amber-500 text-black" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list" 
                  ? "bg-amber-500 text-black" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-400 mb-6 flex items-center justify-center gap-2"
        >
        </motion.div>

        {}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode + page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`${
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                : "flex flex-col gap-4"
            }`}
          >
            {beers?.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <BeakerIcon className="w-20 h-20 mx-auto text-gray-700 mb-4" />
                <p className="text-gray-400 text-xl">Пива пока нет</p>
                <p className="text-gray-600">Скоро здесь появятся новые рецензии</p>
              </motion.div>
            ) : (
              beers.map((beer, index) => {
                const imageUrl = buildAssetUrl(beer.imageUrl ?? beer.imagePath);
                
                return (
                  <motion.div
                    key={beer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      key={beer.id}
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
                      viewMode={viewMode}
                      onDelete={handleDeleteBeer}
                    />
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        {}
        {beers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-3 mt-12"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-3 bg-gray-800/50 rounded-xl disabled:opacity-30 hover:bg-gray-700/50 transition-all backdrop-blur-sm border border-gray-700 disabled:hover:bg-gray-800/50 flex items-center gap-2"
            >
              <ArrowDownIcon className="w-4 h-4 rotate-90" />
              Назад
            </button>
            
            <div className="flex gap-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = page;
                if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`w-12 h-12 rounded-xl transition-all ${
                        page === pageNum
                          ? "bg-amber-500 text-black font-bold"
                          : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-3 bg-gray-800/50 rounded-xl disabled:opacity-30 hover:bg-gray-700/50 transition-all backdrop-blur-sm border border-gray-700 disabled:hover:bg-gray-800/50 flex items-center gap-2"
            >
              Вперед
              <ArrowUpIcon className="w-4 h-4 rotate-90" />
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
