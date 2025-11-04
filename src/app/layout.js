import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pension Gisela",
  description: "Ihre gemütliche Pension...",
};

// 1. ПОВЕРТАЄМО 'modal' В ПРОПСИ
export default function RootLayout({ children, modal }) {
  return (
    <html lang="de" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children} {/* Це наша звичайна сторінка */}
        {modal} {/* 2. ПОВЕРТАЄМО СЛОТ ДЛЯ МОДАЛКИ */}
      </body>
    </html>
  );
}
