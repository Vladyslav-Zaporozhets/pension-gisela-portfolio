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
import { useRouter } from "next/navigation"; // 1. Імпортуємо useRouter

registerLocale("de", de);

export default function BookingForm({ room, bookings }) {
  const router = useRouter(); // 2. Ініціалізуємо роутер

  // --- States для дат та форми ---
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestStreet, setGuestStreet] = useState("");
  const [guestZip, setGuestZip] = useState("");
  const [guestCity, setGuestCity] = useState("");

  const [status, setStatus] = useState(""); // "submitting", "success", "error"

  // --- Логіка блокування дат (без змін) ---
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

  // --- 3. Логіка розрахунку ціни (НОВА) ---
  const { numNights, totalPrice } = useMemo(() => {
    if (!startDate || !endDate) {
      return { numNights: 0, totalPrice: 0 };
    }
    const nights = differenceInCalendarDays(endDate, startDate);
    if (nights <= 0) {
      return { numNights: 0, totalPrice: 0 };
    }
    // Використовуємо логіку цін з бази даних
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

  // --- 4. Функція відправки (ОНОВЛЕНА) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    // --- Валідація ---
    if (!startDate || !endDate || numNights <= 0) {
      alert("Bitte wählen Sie gültige Reisedaten.");
      setStatus("");
      return;
    }
    if (!guestName || !guestEmail || !guestStreet || !guestZip || !guestCity) {
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

    // --- Об'єкт для Supabase (з усіма полями) ---
    const newBooking = {
      room_id: room.id,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      num_adults: numAdults,
      num_children: numChildren,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      guest_street: guestStreet,
      guest_zip: guestZip,
      guest_city: guestCity,
      total_price: totalPrice,
      status: "confirmed",
      kurtaxe_price: 0, // (Поки що залишаємо 0)
    };

    // --- Відправка ---
    const { error } = await supabase.from("bookings").insert(newBooking);

    if (error) {
      console.error("Error creating booking:", error);
      setStatus("error");
    } else {
      setStatus("success");
      // 5. Оновлюємо сторінку через 3 сек, щоб "скинути" форму
      // і показати нові заблоковані дати (якщо ми на повній сторінці)
      setTimeout(() => {
        router.refresh(); // Оновлює дані на сторінці
        setStatus("");
        setStartDate(null);
        setEndDate(null);
      }, 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 py-8 px-6 rounded-lg shadow-inner"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Zimmer buchen</h2>

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

      {/* --- 6. Нові поля (Адреса, Діти) --- */}
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
            Voller Name *
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
        <div>
          <label
            htmlFor="guestStreet"
            className="block text-sm font-medium text-gray-700"
          >
            Straße & Nr. *
          </label>
          <input
            type="text"
            id="guestStreet"
            value={guestStreet}
            onChange={(e) => setGuestStreet(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="guestZip"
              className="block text-sm font-medium text-gray-700"
            >
              PLZ *
            </label>
            <input
              type="text"
              id="guestZip"
              value={guestZip}
              onChange={(e) => setGuestZip(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <div>
            <label
              htmlFor="guestCity"
              className="block text-sm font-medium text-gray-700"
            >
              Ort *
            </label>
            <input
              type="text"
              id="guestCity"
              value={guestCity}
              onChange={(e) => setGuestCity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            />
          </div>
        </div>
      </div>

      {/* --- Розрахунок ціни (НОВИЙ) --- */}
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
            Wunderbar! Ihr Zimmer wurde erfolgreich gebucht.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-4">
            Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
          </p>
        )}
      </div>
    </form>
  );
}
