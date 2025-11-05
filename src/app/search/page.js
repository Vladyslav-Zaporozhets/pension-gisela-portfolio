// Це файл: src/app/search/page.js

import { supabase } from "@/lib/supabaseClient";
import RoomCard from "@/components/RoomCard";
import Link from "next/link";

// Функція, яка знаходить ID зайнятих номерів
async function getBookedRoomIds(start, end) {
  const { data, error } = await supabase
    .from("bookings")
    .select("room_id")
    .lt("start_date", end)
    .gt("end_date", start);

  if (error) {
    console.error("Error fetching booked room IDs:", error);
    return [];
  }
  // Повертаємо масив УНІКАЛЬНИХ ID
  const uniqueIds = [...new Set(data.map((booking) => booking.room_id))];
  return uniqueIds;
}

// Функція, яка завантажує ВСІ номери, що підходять
async function getRooms(guests, bookedRoomIds) {
  // 'guests' тут - це вже ЧИСЛО
  let query = supabase
    .from("rooms")
    .select(
      "id, name, image_url, max_guests, price_long_stay, description_short"
    )
    .gte("max_guests", guests); // Тепер ми порівнюємо ЧИСЛО з ЧИСЛОМ

  // Додаємо фільтр .not() ТІЛЬКИ якщо є зайняті номери
  if (bookedRoomIds && bookedRoomIds.length > 0) {
    query = query.not("id", "in", `(${bookedRoomIds.join(",")})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching available rooms:", error);
    return [];
  }
  return data;
}

export default async function SearchPage({ searchParams }) {
  const { start, end, guests } = searchParams;

  // Головна перевірка (якщо параметрів немає)
  if (!start || !end || !guests) {
    return (
      <main className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Bitte starten Sie eine Suche
        </h1>
        <p className="text-lg mb-6">
          Gehen Sie zurück zur Startseite, um Ihre Reisedaten auszuwählen.
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Zurück zur Startseite
        </Link>
      </main>
    );
  }

  // --- 1. ГОЛОВНЕ ВИПРАВЛЕННЯ ---
  // Перетворюємо 'guests' (який є рядком "1") на число 1
  const guestsAsNumber = parseInt(guests, 10);

  // Перевірка, чи 'guests' взагалі є числом
  if (isNaN(guestsAsNumber)) {
    return (
      <main className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Ungültige Gästeanzahl</h1>
        <p className="text-lg mb-6">
          Die Anzahl der Gäste muss eine Zahl sein.
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Zurück zur Startseite
        </Link>
      </main>
    );
  }
  // --- КІНЕЦЬ ВИПРАВЛЕННЯ ---

  // Код виконується, тільки якщо параметри є:
  const bookedRoomIds = await getBookedRoomIds(start, end);
  // 2. Передаємо ЧИСЛО, а не рядок
  const availableRooms = await getRooms(guestsAsNumber, bookedRoomIds);

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Verfügbare Zimmer</h1>
      <p className="text-lg mb-6">
        Ergebnisse für {guestsAsNumber} {guestsAsNumber > 1 ? "Gäste" : "Gast"}{" "}
        vom {start} bis {end}
      </p>

      {availableRooms.length === 0 ? (
        <p className="text-center text-xl">
          Leider wurden für diesen Zeitraum keine Zimmer gefunden.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {availableRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </main>
  );
}
