// Це файл: src/components/AvailabilitySearch.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerLocale } from "react-datepicker";
import { de } from "date-fns/locale/de";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from "date-fns";

registerLocale("de", de);

export default function AvailabilitySearch() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numGuests, setNumGuests] = useState(1);

  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Bitte wählen Sie An- und Abreisedatum.");
      return;
    }

    const formattedStart = format(startDate, "yyyy-MM-dd");
    const formattedEnd = format(endDate, "yyyy-MM-dd");
    const totalGuests = numGuests;

    const queryString = new URLSearchParams({
      start: formattedStart,
      end: formattedEnd,
      guests: totalGuests,
    }).toString();

    router.push(`/search?${queryString}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      // Фон форми, як і раніше, білий
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* --- ПОЛЕ 1: "ANREISE" (ЗАЇЗД) --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anreise
          </label>
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            locale="de"
            // 1. ВИПРАВЛЕННЯ: Додаємо 'text-gray-900' (темний текст)
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
            placeholderText="Wählen Sie das Datum"
            dateFormat="dd.MM.yyyy"
            autoComplete="off"
          />
        </div>

        {/* --- ПОЛЕ 2: "ABREISE" (ВИЇЗД) --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Abreise
          </label>
          <ReactDatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ? addDays(startDate, 1) : new Date()}
            locale="de"
            // 2. ВИПРАВЛЕННЯ: Додаємо 'text-gray-900'
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
            placeholderText="Wählen Sie das Datum"
            dateFormat="dd.MM.yyyy"
            autoComplete="off"
            disabled={!startDate}
          />
        </div>

        {/* --- ПОЛЕ 3: "GÄSTE" (ГОСТІ) --- */}
        <div>
          <label
            htmlFor="numGuests"
            className="block text-sm font-medium text-gray-700"
          >
            Gäste
          </label>
          <input
            type="number"
            id="numGuests"
            value={numGuests}
            onChange={(e) => setNumGuests(parseInt(e.target.value, 10))}
            min="1"
            // 3. ВИПРАВЛЕННЯ: Додаємо 'text-gray-900'
            className="w-full p-2 border border-gray-300 rounded-md mt-1 text-gray-900"
          />
        </div>
      </div>

      {/* --- Кнопка Пошуку (без змін) --- */}
      <div className="text-center mt-6">
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-blue-700"
        >
          Verfügbarkeit prüfen
        </button>
      </div>
    </form>
  );
}
