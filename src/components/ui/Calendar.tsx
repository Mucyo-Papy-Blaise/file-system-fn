"use client";

import { useMemo } from "react";

interface CalendarProps {
  selected?: string | null; // ISO yyyy-mm-dd
  onSelect: (isoDate: string) => void;
  year?: number;
  month?: number; // 0-11
}

function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function Calendar({ selected = null, onSelect, year, month }: CalendarProps) {
  const today = new Date();
  const base = useMemo(() => {
    if (typeof year === "number" && typeof month === "number") {
      return new Date(year, month, 1);
    }
    return startOfMonth(today);
  }, [year, month]);

  const monthStart = startOfMonth(base);
  const monthEnd = endOfMonth(base);

  const weeks = useMemo(() => {
    const startDay = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();
    const totalCells = startDay + daysInMonth;
    const rows = Math.ceil(totalCells / 7);
    const grid: Array<Array<number | null>> = [];
    let day = 1;

    for (let r = 0; r < rows; r++) {
      const row: Array<number | null> = [];
      for (let c = 0; c < 7; c++) {
        const cellIndex = r * 7 + c;
        const cellDay = cellIndex - startDay + 1;
        if (cellDay > 0 && cellDay <= daysInMonth) {
          row.push(cellDay);
        } else {
          row.push(null);
        }
      }
      grid.push(row);
    }

    return grid;
  }, [monthStart, monthEnd]);

  const monthLabel = monthStart.toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="w-72 rounded-md border border-default bg-surface p-3 shadow-sm">
      <div className="mb-2 text-center text-sm font-medium text-foreground">{monthLabel}</div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-secondary">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
        {weeks.map((row, r) =>
          row.map((day, c) => {
            if (!day) {
              return <div key={`${r}-${c}`} className="h-8" />;
            }

            const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
            const iso = toIso(date);
            const isToday = iso === toIso(today);
            const isSelected = selected === iso;

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => onSelect(iso)}
                className={`h-8 w-full rounded-md transition disabled:opacity-60 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : isToday
                    ? 'ring-1 ring-primary/30'
                    : 'hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                {day}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}

export default Calendar;
