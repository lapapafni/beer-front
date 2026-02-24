"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginRequest } from "@/app/services/auth";
import { useAuth } from "@/app/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🛡 Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
    setMounted(true);
  }, [isAuthenticated, router]);

  const validate = () => {
    if (!email.includes("@")) {
      return "Введите корректный email";
    }
    if (password.length < 6) {
      return "Пароль должен быть минимум 6 символов";
    }
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = await loginRequest(email, password);
      login(data.token, data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-[#141414] p-8 rounded-2xl border border-white/10 shadow-xl 
                   animate-[fadeIn_.5s_ease-out]"
      >
        <h1 className="text-3xl font-bold mb-6 text-amber-500">
          Вход в аккаунт
        </h1>

        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl bg-[#1f1f1f] border border-white/10 focus:outline-none focus:border-amber-500 transition"
          />

          {/* 👁 Пароль */}
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
            {loading ? "Вход..." : "Войти"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="text-amber-500 hover:text-amber-400 transition font-semibold"
          >
            Зарегистрируйтесь
          </Link>
        </div>
      </form>
    </main>
  );
}