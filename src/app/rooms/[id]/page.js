import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import BookingForm from "@/components/BookingForm"; // <-- 1. ІМПОРТУЄМО ФОРМУ

// Функція getRoom (залишається як була)
async function getRoom(id) {
  // Ми все ще використовуємо 'await props.params' тут, бо це працювало
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

// Використовуємо 'props' і 'await props.params', оскільки це
// єдине, що працювало для вас без помилок
export default async function RoomPage(props) {
  const params = await props.params;
  const room = await getRoom(params.id);

  if (!room) {
    return <p>Номер не знайдено.</p>;
  }

  // Це UI повної сторінки
  return (
    <main className="container mx-auto p-8">
      {/* Ми об'єднаємо все в один контейнер з 2-ма колонками */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          {/* 2. ВСТАВЛЯЄМО ФОРМУ І ПЕРЕДАЄМО 'room' */}
          <BookingForm room={room} />
        </div>
      </div>
    </main>
  );
}
