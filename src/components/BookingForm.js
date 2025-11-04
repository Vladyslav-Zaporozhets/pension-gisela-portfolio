"use client"; // Це КлієNTський Компонент

import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Ми передамо 'room' сюди зі сторінки
export default function BookingForm({ room }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold mb-4 text-center">Забронювати</h2>

      <div className="flex justify-center mb-4">
        <ReactDatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()} // Блокуємо минулі дати
          selectsRange // Дозволяємо обрати діапазон
          inline // Показуємо календар одразу
        />
      </div>

      {/* Тут буде решта форми (Ім'я, Email, Кнопка) */}
      <div className="text-center">
        <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
          Забронювати зараз
        </button>
      </div>
    </div>
  );
}
