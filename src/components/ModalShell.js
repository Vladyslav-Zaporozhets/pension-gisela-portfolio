// Це файл: src/components/ModalShell.js

"use client"; // Це Клієнтський Компонент

import { useRouter } from "next/navigation";

// Він приймає 'children' - це буде наш серверний вміст модалки
export default function ModalShell({ children }) {
  const router = useRouter();

  // Функція, яка спрацьовує при кліку на фон
  const handleClickOutside = (e) => {
    // Ми перевіряємо, чи клікнули ми саме на фон (e.target),
    // а не на його дочірній елемент (саме вікно).
    if (e.target === e.currentTarget) {
      router.back(); // Закриваємо модалку
    }
  };

  return (
    // 1. Наш напівпрозорий фон:
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
      onClick={handleClickOutside}
    >
      {/* 3. Саме вікно. Ми додаємо onClick з e.stopPropagation(),
        щоб клік по вікну не "спливав" до фону і не закривав модалку.
      */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children} {/* Тут буде вміст нашої модалки */}
      </div>
    </div>
  );
}
