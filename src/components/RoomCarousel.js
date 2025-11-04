// Це файл: src/components/RoomCarousel.js

"use client"; // Карусель - це клієнтський компонент

import Link from "next/link";
import Image from "next/image";

// Імпортуємо Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Імпортуємо стилі Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function RoomCarousel({ rooms }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]} // Вмикаємо стрілки та крапки
      navigation // Стрілки "Вперед/Назад"
      pagination={{ clickable: true }} // Крапки навігації
      spaceBetween={30} // Відстань між слайдами
      // Налаштування, скільки слайдів показувати
      breakpoints={{
        // Коли екран >= 640px
        640: {
          slidesPerView: 1,
        },
        // Коли екран >= 768px
        768: {
          slidesPerView: 2,
        },
        // Коли екран >= 1024px
        1024: {
          slidesPerView: 3,
        },
      }}
    >
      {rooms.map((room) => (
        <SwiperSlide key={room.id} className="pb-10">
          {/* pb-10 = відступ знизу для крапок пагінації */}
          <Link
            href={`/rooms/${room.id}`}
            className="border rounded-lg shadow-lg overflow-hidden block hover:shadow-xl transition-shadow"
          >
            <div className="relative w-full h-48">
              <Image
                src={room.image_url}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">{room.name}</h2>
              {/* ВИКОРИСТОВУЄМО НОВЕ ПОЛЕ */}
              <p className="text-gray-600 mb-4 h-12">
                {room.description_short}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">
                  {/* ПОКАЗУЄМО ЦІНУ "ВІД" (за 3+ ночі) І ДІЛИМО НА 100 */}
                  ab {room.price_long_stay / 100} € / Nacht
                </span>
                <span className="text-gray-700">
                  bis zu {room.max_guests} Gäste
                </span>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
