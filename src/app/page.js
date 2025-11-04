// Це файл: src/app/page.js

import { supabase } from "@/lib/supabaseClient";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import RoomCarousel from "@/components/RoomCarousel";

// Завантажуємо дані, які потрібні для каруселі
async function getRoomsForGallery() {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      "id, name, image_url, max_guests, price_long_stay, description_short"
    );

  if (error) {
    console.error("Error fetching rooms for gallery:", error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const rooms = await getRoomsForGallery();

  return (
    <main>
      <Hero />
      <AboutUs />

      {/* Секція "Наші Номери" (з каруселлю) */}
      <div className="container mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Unsere Zimmer</h2>
        <RoomCarousel rooms={rooms} />
      </div>
    </main>
  );
}
