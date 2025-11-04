// Це файл: src/components/ModalCloseButton.js
"use client"; // Це клієнтський компонент

import { useRouter } from "next/navigation";

export default function ModalCloseButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()} // Просто повертає користувача назад
      className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full text-black hover:bg-gray-200"
      aria-label="Закрити"
    >
      {/* Іконка "X" */}
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  );
}
