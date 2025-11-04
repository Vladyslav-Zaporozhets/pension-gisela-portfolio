import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import BookingForm from "@/components/BookingForm"; // Це вже є

// Функція getRoom (залишається як була)
async function getRoom(id) {
  if (!id) {
    console.error("getRoom (Full Page) called with undefined id");
    return null;
  }
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching room (Full Page):", error);
    return null;
  }
  return data;
}

// --- НОВА ФУНКЦІЯ ---
// Завантажує всі бронювання для конкретного номера
async function getBookings(roomId) {
  // Форматуємо сьогоднішню дату для Supabase (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("bookings")
    .select("start_date, end_date")
    .eq("room_id", roomId) // Тільки для цього номера
    .gte("end_date", today); // Тільки майбутні бронювання

  if (error) {
    console.error("Error fetching bookings:", error);
    return []; // Повертаємо порожній масив у разі помилки
  }
  return data;
}
// --- КІНЕЦЬ НОВОЇ ФУНКЦІЇ ---

export default async function RoomPage(props) {
  const params = await props.params;

  // 1. Отримуємо дані про номер (як і раніше)
  const room = await getRoom(params.id);

  // 2. Отримуємо дані про бронювання
  const bookings = await getBookings(params.id);

  if (!room) {
    return <p>Номер не знайдено.</p>;
  }

  // Це UI повної сторінки
  return (
    <main className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
        {/* Ліва колонка (Інформація про номер) */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{room.name}</h1>
          <div className="relative w-full h-96 mb-4">
            <Image
              src={room.image_url}
              alt={room.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <p className="text-lg text-gray-700 mb-4">{room.description}</p>
          <div className="text-2xl font-bold">
            {room.price_per_night} грн / ніч (до {room.max_guests} гостей)
          </div>
        </div>

        {/* Права колонка (Форма Бронювання) */}
        <div className="md:col-span-1">
          {/* 3. ПЕРЕДАЄМО 'bookings' У ФОРМУ */}
          <BookingForm room={room} bookings={bookings} />
        </div>
      </div>
    </main>
  );
}
