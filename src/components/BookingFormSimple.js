// Це файл: src/components/BookingFormSimple.js

"use client";

import { useState, useMemo } from "react";
import { registerLocale } from "react-datepicker";
import { de } from "date-fns/locale/de";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  eachDayOfInterval,
  parseISO,
  subDays,
  differenceInCalendarDays,
  format,
} from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

registerLocale("de", de);

export default function BookingFormSimple({ room, bookings }) {
  const router = useRouter();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Спрощена форма:
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState(""); // Телефон залишаємо

  const [status, setStatus] = useState("");

  const disabledDates = useMemo(() => {
    if (!bookings) return [];
    const dates = bookings.flatMap((booking) => {
      return eachDayOfInterval({
        start: parseISO(booking.start_date),
        end: subDays(parseISO(booking.end_date), 1),
      });
    });
    return dates;
  }, [bookings]);

  const { numNights, totalPrice } = useMemo(() => {
    if (!startDate || !endDate) {
      return { numNights: 0, totalPrice: 0 };
    }
    const nights = differenceInCalendarDays(endDate, startDate);
    if (nights <= 0) {
      return { numNights: 0, totalPrice: 0 };
    }
    const pricePerNight =
      nights <= 2 ? room.price_short_stay : room.price_long_stay;
    return { numNights: nights, totalPrice: nights * pricePerNight };
  }, [startDate, endDate, room.price_short_stay, room.price_long_stay]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    // ----- Валідація (спрощена) -----
    if (!startDate || !endDate || numNights <= 0) {
      alert("Bitte wählen Sie gültige Reisedaten.");
      setStatus("");
      return;
    }
    if (!guestName || !guestEmail) {
      alert("Bitte füllen Sie alle erforderlichen Felder aus (*).");
      setStatus("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      setStatus("");
      return;
    }
    if (numAdults + numChildren > room.max_guests) {
      alert(
        `Die maximale Gästeanzahl für dieses Zimmer beträgt: ${room.max_guests}`
      );
      setStatus("");
      return;
    }

    // ----- Об'єкт для Supabase (спрощений) -----
    const newBooking = {
      room_id: room.id,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      num_adults: numAdults,
      num_children: numChildren,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      // Поля адреси просто залишаються 'null'
      total_price: totalPrice,
      status: "confirmed",
      kurtaxe_price: 0,
    };

    // ----- Відправка -----
    const { error } = await supabase.from("bookings").insert(newBooking);

    if (error) {
      console.error("Error creating booking:", error);
      setStatus("error");
    } else {
      setStatus("success");
      setTimeout(() => {
        // Закриваємо модалку, повернувшись назад
        router.back();
        // Оновлюємо головну сторінку, щоб вона завантажила нові бронювання
        router.refresh();
      }, 2000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 py-8 px-6 rounded-lg shadow-inner"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Schnellbuchung</h2>

      {/* --- Календар --- */}
      <div className="flex justify-center mb-4">
        <ReactDatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          selectsRange
          inline
          excludeDates={disabledDates}
          locale="de"
        />
      </div>

      {/* --- Спрощені Поля --- */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="numAdults"
              className="block text-sm font-medium text-gray-700"
            >
              Erwachsene *
            </label>
            <input
              type="number"
              id="numAdults"
              value={numAdults}
              onChange={(e) => setNumAdults(parseInt(e.target.value))}
              min="1"
              max={room.max_guests}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <div>
            <label
              htmlFor="numChildren"
              className="block text-sm font-medium text-gray-700"
            >
              Kinder
            </label>
            <input
              type="number"
              id="numChildren"
              value={numChildren}
              onChange={(e) => setNumChildren(parseInt(e.target.value))}
              min="0"
              max={room.max_guests - numAdults}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="guestName"
            className="block text-sm font-medium text-gray-700"
          >
            Name *
          </label>
          <input
            type="text"
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            required
          />
        </div>
        <div>
          <label
            htmlFor="guestEmail"
            className="block text-sm font-medium text-gray-700"
          >
            E-Mail *
          </label>
          <input
            type="email"
            id="guestEmail"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            required
          />
        </div>
        <div>
          <label
            htmlFor="guestPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Telefon *
          </label>
          <input
            type="tel"
            id="guestPhone"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            required
          />
        </div>
      </div>

      {/* --- Розрахунок ціни (без змін) --- */}
      {numNights > 0 && (
        <div className="bg-white p-4 rounded-md mb-6 text-center">
          <p className="text-lg font-semibold">Gesamtpreis:</p>
          <p className="text-2xl font-bold">
            {(totalPrice / 100).toFixed(2)} €
          </p>
          <p className="text-sm text-gray-600">
            ({numNights} {numNights > 1 ? "Nächte" : "Nacht"} à{" "}
            {(totalPrice / numNights / 100).toFixed(2)} €)
          </p>
        </div>
      )}

      {/* --- Кнопка та Повідомлення --- */}
      <div className="text-center">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Wird gebucht..." : "Jetzt buchen"}
        </button>

        {status === "success" && (
          <p className="text-green-600 mt-4">
            Wunderbar! Ihr Zimmer wurde gebucht.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-4">Ein Fehler ist aufgetreten.</p>
        )}
      </div>
    </form>
  );
}
