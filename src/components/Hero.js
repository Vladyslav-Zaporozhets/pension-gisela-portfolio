// Це файл: src/components/Hero.js
import AvailabilitySearch from "./AvailabilitySearch"; // 1. ІМПОРТУЄМО ФОРМУ

export default function Hero() {
  return (
    <div className="relative h-[500px] bg-gray-800 text-white flex items-center justify-center">
      <div className="text-center z-10">
        <h1 className="text-5xl font-bold">Pension Gisela</h1>
        <p className="text-2xl mt-2">
          Willkommen in der „Fränkischen Schweiz“!
        </p>
      </div>
      <div className="absolute -bottom-24 w-full px-4">
        {/* 2. Змінив з -bottom-20 на -bottom-24, щоб дати більше місця */}
        <AvailabilitySearch /> {/* 3. ВСТАВЛЯЄМО КОМПОНЕНТ */}
      </div>
    </div>
  );
}
