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

// МИ ПРИБРАЛИ 'modal' ЗВІДСИ
export default function RootLayout({ children }) {
  return (
    <html lang="de" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children} {/* Залишаємо тільки children */}
      </body>
    </html>
  );
}
