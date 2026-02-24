/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/authContext";

// Оптимизированная загрузка Roboto через Next.js
const roboto = Roboto({ 
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['400', '500', '700'] // обычный, средний, жирный
});

export const metadata: Metadata = {
  title: "Искусство Пива с Ильёй Юровским",
  description: "Рецензии, вкусы и дегустации от легендарного пивного сомелье",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${roboto.variable}`}>
      <head>
        {/* Резервное подключение Roboto */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#0a0a0a] text-white font-roboto">
        <AuthProvider>
          <Header />
            {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}