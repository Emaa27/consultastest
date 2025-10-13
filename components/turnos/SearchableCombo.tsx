// components/turnos/SearchableCombo.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { ComboItem } from "@/types/turnos";
import { norm } from "@/utils/turnos";

interface SearchableComboProps {
  items: ComboItem[];
  value?: string | null;
  onChange: (v: string) => void;
  placeholder?: string;
  emptyText?: string;
}

export default function SearchableCombo({
  items,
  value,
  onChange,
  placeholder = "Buscar…",
  emptyText = "Sin resultados",
}: SearchableComboProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => items.find((i) => i.value === value) ?? null,
    [items, value]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = norm(query);
    return items.filter((i) =>
      norm(`${i.label} ${i.keywords ?? ""}`).includes(q)
    );
  }, [items, query]);

  // cerrar por click afuera
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    setHighlight((h) =>
      filtered.length === 0 ? 0 : Math.min(h, filtered.length - 1)
    );
  }, [open, filtered.length]);

  function commitChoice(idx: number) {
    const item = filtered[idx];
    if (!item) return;
    onChange(item.value);
    // mostrar inmediatamente el label elegido
    setQuery(item.label);
    // cerrar y sacar el foco para que no se reabra
    setOpen(false);
    requestAnimationFrame(() => {
      inputRef.current?.blur();
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <div
        className="flex items-center gap-2 rounded-lg border border-gray-300
          focus-within:ring-2 focus-within:ring-[#6596d8] focus-within:border-transparent
          transition-all duration-200 bg-white"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          className="w-full p-3 rounded-lg outline-none text-gray-700 bg-transparent"
          placeholder={placeholder}
          value={open || query ? query : selected?.label ?? ""}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (open) commitChoice(highlight);
            } else if (e.key === "Escape") {
              setOpen(false);
              setQuery("");
            }
          }}
        />
        <svg
          className={`w-5 h-5 mr-3 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">{emptyText}</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.value}
                type="button"
                role="option"
                aria-selected={value === item.value}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commitChoice(idx)}
                className={`w-full text-left px-3 py-2 text-sm
                  ${idx === highlight ? "bg-orange-50" : ""}
                  ${value === item.value ? "font-semibold text-gray-900" : "text-gray-700"}
                  hover:bg-orange-50`}
              >
                {item.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}