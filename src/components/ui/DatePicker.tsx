"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import Calendar from "./Calendar";

interface DatePickerProps {
  value?: string | null; // ISO yyyy-mm-dd
  onChange?: (iso: string | null) => void;
  placeholder?: string;
  id?: string;
  name?: string;
}

export function DatePicker({ value = null, onChange, placeholder, id, name }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<string | null>(value ?? null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setInternal(value ?? null), [value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (e.target instanceof Node && wrapperRef.current.contains(e.target)) return;
      setOpen(false);
    }

    window.addEventListener("mousedown", onDoc);
    return () => window.removeEventListener("mousedown", onDoc);
  }, []);

  const handleSelect = (iso: string) => {
    setInternal(iso);
    onChange?.(iso);
    setOpen(false);
  };

  return (
    <div className="relative inline-block w-full" ref={wrapperRef}>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="date"
          value={internal ?? ""}
          onChange={(e) => {
            const v = e.target.value || null;
            setInternal(v);
            onChange?.(v);
          }}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-default bg-surface pr-11 pl-4 py-2 text-foreground placeholder-secondary focus:border-primary focus:outline-none appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-clear-button]:hidden"
        />

        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-secondary hover:bg-[var(--color-bg-secondary)]"
          aria-label="Toggle calendar"
        >
          <CalendarIcon className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="absolute right-0 z-50 mt-2">
          <Calendar selected={internal} onSelect={handleSelect} />
        </div>
      ) : null}
    </div>
  );
}

export default DatePicker;
