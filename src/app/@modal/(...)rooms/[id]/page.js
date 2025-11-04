// Це файл: src/app/@modal/(...)rooms/[id]/page.js

// Це СЕРВЕРНИЙ КОМПОНЕНТ. Це наше виправлення.
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import ModalCloseButton from "@/components/ModalCloseButton"; // Ми створимо його
import ModalShell from "@/components/ModalShell";

// (Функції getRoom та getBookings - ідентичні тим, що у /rooms/[id]/page.js)
async function getRoom(id) {
  if (!id) return null;
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching room (Modal):", error);
    return null;
  }
  return data;
}

async function getBookings(roomId) {
  if (!roomId) return [];
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("bookings")
    .select("start_date, end_date")
    .eq("room_id", roomId)
    .gte("end_date", today);
  if (error) {
    console.error("Error fetching bookings (Modal):", error);
    return [];
  }
  return data;
}

export default async function RoomModal(props) {
  // Використовуємо 'await props.params' - це виправлення нашого старого багу
  const params = await props.params;
  const room = await getRoom(params.id);
  const bookings = await getBookings(params.id);

  if (!room) {
    return null;
  }

  return (
    <ModalShell>
      <ModalCloseButton />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 items-start">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
          <div className="relative w-full h-80 mb-4">
            <Image
              src={room.image_url || "/placeholder.jpg"}
              alt={room.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {/* Використовуємо ДОВГИЙ опис з бази */}
          <p className="text-gray-700 mb-4">{room.description}</p>
          <div className="text-xl font-bold">
            ab {room.price_long_stay / 100} € / Nacht
          </div>
        </div>
        <div className="md:col-span-1">
          {/* Передаємо дані у форму */}
          <BookingForm room={room} bookings={bookings} />
        </div>
      </div>
    </ModalShell>
  );
}
