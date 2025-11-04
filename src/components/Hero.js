// Це файл: src/components/Hero.js

export default function Hero() {
  return (
    <div className="relative h-[500px] bg-gray-800 text-white flex items-center justify-center">
      {/* (Ми додамо фонове зображення пізніше) */}
      <div className="text-center z-10">
        <h1 className="text-5xl font-bold">Pension Gisela</h1>
        <p className="text-2xl mt-2">
          Willkommen in der „Fränkischen Schweiz“!
        </p>
      </div>
      {/* Абсолютне позиціонування форми пошуку */}
      <div className="absolute -bottom-20 w-full px-4">
        {/* <AvailabilitySearch /> */}
        <p className="text-center text-black">(Тут буде форма пошуку)</p>
      </div>
    </div>
  );
}
