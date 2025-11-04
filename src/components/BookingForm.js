"use client";

import { useState, useMemo } from "react";
// 1. Імпортуємо 'registerLocale' та німецьку локаль
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

// 2. Реєструємо німецьку локаль для календаря
registerLocale("de", de);

export default function BookingForm({ room, bookings }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 3. Додаємо state для телефону
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState(""); // <-- НОВЕ ПОЛЕ
  const [numGuests, setNumGuests] = useState(1);

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

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    // ----- A. Валідація -----
    if (!startDate || !endDate) {
      alert("Bitte wählen Sie An- und Abreisedatum."); // Будь ласка, оберіть дати...
      setStatus("");
      return;
    }
    if (!guestName || !guestEmail) {
      alert("Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse ein."); // Введіть ім'я та email
      setStatus("");
      return;
    }

    // 4. Нова валідація Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      alert("Bitte geben Sie eine gültige E-Mail-Adresse ein."); // Введіть коректний email
      setStatus("");
      return;
    }

    if (numGuests > room.max_guests) {
      alert(
        `Die maximale Gästeanzahl für dieses Zimmer beträgt: ${room.max_guests}`
      ); // Макс. гостей...
      setStatus("");
      return;
    }

    // ----- B. Розрахунок -----
    const numNights = differenceInCalendarDays(endDate, startDate);
    if (numNights <= 0) {
      alert("Das Abreisedatum muss nach dem Anreisedatum liegen."); // Дата виїзду...
      setStatus("");
      return;
    }
    const totalPrice = numNights * room.price_per_night;

    // ----- C. Створення об'єкту для Supabase -----
    const newBooking = {
      room_id: room.id,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone, // <-- 5. Додаємо телефон в об'єкт
      num_guests: numGuests,
      total_price: totalPrice,
      status: "confirmed",
    };

    // ----- D. Відправка в Supabase -----
    const { error } = await supabase.from("bookings").insert(newBooking);

    if (error) {
      console.error("Error creating booking:", error);
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 py-10 px-6 rounded-lg shadow-inner"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Zimmer buchen</h2>

      {/* --- Календар (тепер німецькою) --- */}
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
          locale="de" // <-- 6. Вмикаємо німецьку мову
        />
      </div>

      {/* --- 7. Нові поля форми (німецькою) --- */}
      <div className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="guestName"
            className="block text-sm font-medium text-gray-700"
          >
            Name
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
            E-Mail
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
        {/* 8. Нове поле "Телефон" */}
        <div>
          <label
            htmlFor="guestPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Telefon (Optional)
          </label>
          <input
            type="tel"
            id="guestPhone"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="numGuests"
            className="block text-sm font-medium text-gray-700"
          >
            Anzahl der Gäste
          </label>
          <input
            type="number"
            id="numGuests"
            value={numGuests}
            onChange={(e) => setNumGuests(parseInt(e.target.value, 10))}
            min="1"
            max={room.max_guests}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            required
          />
        </div>
      </div>

      {/* --- 9. Кнопка та Повідомлення (німецькою) --- */}
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
