// Це файл: src/components/RoomCard.js
import Image from "next/image";
import Link from "next/link";

export default function RoomCard({ room }) {
  return (
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
        <p className="text-gray-600 mb-4 h-12">{room.description_short}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            ab {room.price_long_stay / 100} € / Nacht
          </span>
          <span className="text-gray-700">bis zu {room.max_guests} Gäste</span>
        </div>
      </div>
    </Link>
  );
}
