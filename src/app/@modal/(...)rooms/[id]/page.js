// Dies ist: src/app/@modal/(...)rooms/[id]/page.js

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import BookingFormSimple from "@/components/BookingFormSimple";
import ModalCloseButton from "@/components/ModalCloseButton";
import ModalShell from "@/components/ModalShell";

// --- Funktionen getRoom & getBookings (bleiben gleich) ---
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
        {/* Linke Spalte (Info) */}
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
          <p className="text-gray-700 mb-4">{room.description}</p>

          {/* --- NEUE PREISLOGIK HIER (Modal-Version) --- */}
          <div className="text-xl font-bold">
            {room.room_type === "Einzelzimmer" ||
            room.room_type === "Doppelzimmer" ? (
              <span>
                ab {(room.price_long_stay / 100).toFixed(2)} € / Nacht
              </span>
            ) : (
              <span>{(room.price_long_stay / 100).toFixed(2)} € / Nacht</span>
            )}
          </div>
          {(room.room_type === "Einzelzimmer" ||
            room.room_type === "Doppelzimmer") && (
            <div className="text-md text-gray-600">
              (1-2 Nächte: {(room.price_short_stay / 100).toFixed(2)} €)
            </div>
          )}
          <div className="text-md text-gray-600 mt-2">
            bis zu {room.max_guests} Gäste
          </div>
          <p className="text-sm text-gray-500 mt-2">zzgl. Kurtaxe</p>
          {/* --- ENDE PREISLOGIK --- */}
        </div>

        {/* Rechte Spalte (Formular) */}
        <div className="md:col-span-1">
          <BookingFormSimple room={room} bookings={bookings} />
        </div>
      </div>
    </ModalShell>
  );
}
