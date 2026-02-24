"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerRequest } from "@/app/services/auth";
import { useAuth } from "@/app/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
    setMounted(true);
  }, [isAuthenticated, router]);

  const validate = () => {
    if (name.length < 2) {
      return "Имя должно быть минимум 2 символа";
    }
    if (!email.includes("@")) {
      return "Введите корректный email";
    }
    if (password.length < 8) {
      return "Пароль минимум 8 символов";
    }
    if (!/[A-Z]/.test(password)) {
      return "Пароль должен содержать заглавную букву";
    }
    if (!/[0-9]/.test(password)) {
      return "Пароль должен содержать цифру";
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = await registerRequest(email, password, name);
      login(data.token, data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white px-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-[#141414] p-8 rounded-2xl border border-white/10 shadow-xl 
                   animate-[fadeIn_.5s_ease-out]"
      >
        <h1 className="text-3xl font-bold mb-6 text-amber-500">
          Регистрация
        </h1>

        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-xl bg-[#1f1f1f] border border-white/10 focus:outline-none focus:border-amber-500 transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl bg-[#1f1f1f] border border-white/10 focus:outline-none focus:border-amber-500 transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1f1f1f] border border-white/10 focus:outline-none focus:border-amber-500 transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition text-sm"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Создание..." : "Создать аккаунт"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="text-amber-500 hover:text-amber-400 transition font-semibold"
          >
            Войти
          </Link>
        </div>
      </form>
    </main>
  );
}