/**
 * Minimal monthly calendar
 *
 * Shows the current month and allows basic navigation between months. Kept
 * simple on purpose so designers can iterate. We can later extract this into a
 * reusable date component with range selection, events, etc.
 */
import { useState } from "react";

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };
  
  const days = getDaysInMonth(currentDate);
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const isToday = (day: number | null) => {
    return day === today && 
           currentDate.getMonth() === currentMonth && 
           currentDate.getFullYear() === currentYear;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="text-purple-200 hover:text-white"
          >
            ‹
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="text-purple-200 hover:text-white"
          >
            ›
          </button>
        </div>
      </div>
      
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-purple-200 text-xs font-medium py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              h-8 flex items-center justify-center text-sm rounded-lg
              ${day ? 'hover:bg-white/10 cursor-pointer' : ''}
              ${isToday(day) ? 'bg-pink-400 text-white font-bold' : 'text-purple-200'}
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
} 