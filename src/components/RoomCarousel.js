"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function RoomCarousel({ rooms }) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Keyboard]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        spaceBetween={30}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {rooms.map((room) => (
          <SwiperSlide key={room.id} className="pb-12">
            <Link
              href={`/rooms/${room.id}`}
              className="border rounded-lg shadow-lg overflow-hidden block hover:shadow-xl transition-shadow h-full"
            >
              <div className="relative w-full h-48">
                <Image
                  src={room.image_url || "/placeholder.jpg"}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2">{room.name}</h2>
                <p className="text-gray-600 mb-4 h-12">
                  {room.description_short}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
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

      {/* --- ВИПРАВЛЕННЯ ТУТ --- */}
      {/* Додаємо 'hidden' (приховати за замовчуванням) 
        та 'md:block' (показувати на екранах 'medium' і більше) 
      */}
      <div className="swiper-button-prev-custom hidden md:block absolute top-1/2 -translate-y-1/2 -left-12 z-10 p-3 cursor-pointer bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-7 h-7 text-gray-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </div>
      <div className="swiper-button-next-custom hidden md:block absolute top-1/2 -translate-y-1/2 -right-12 z-10 p-3 cursor-pointer bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-7 h-7 text-gray-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </div>
  );
}
