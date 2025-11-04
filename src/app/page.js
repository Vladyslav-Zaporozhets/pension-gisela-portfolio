import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link"; // <-- 1. ІМПОРТУЄМО LINK

export default async function HomePage() {
  const { data: rooms, error } = await supabase.from("rooms").select("*");

  if (error) {
    console.error("Error fetching rooms:", error);
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Наші Номери</h1>

      {!rooms || rooms.length === 0 ? (
        <p>Вибачте, наразі немає доступних номерів.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            // 2. ОБГОРТАЄМО КАРТКУ В <LINK>
            <Link
              href={`/rooms/${room.id}`} // Динамічне посилання
              key={room.id}
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
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {room.price_per_night} грн / ніч
                  </span>
                  <span className="text-gray-700">
                    до {room.max_guests} гостей
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
