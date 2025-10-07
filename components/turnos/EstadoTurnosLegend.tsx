// components/turnos/EstadosTurnosLegend.tsx
"use client";
import React from "react";

type Item = { id: string; label: string; dotClass: string };

const ITEMS: Item[] = [
  { id: "reservado",     label: "Reservado",     dotClass: "from-sky-500 to-sky-600" },
  { id: "recepcionado",  label: "Recepcionado",  dotClass: "from-indigo-500 to-indigo-600" },
  { id: "en-consulta",   label: "En consulta",   dotClass: "from-amber-500 to-orange-600" },
  { id: "atendido",      label: "Atendido",      dotClass: "from-emerald-500 to-green-600" },
  { id: "ausente",       label: "Ausente",       dotClass: "from-red-400 to-red-600" },
  { id: "cancelado",     label: "Cancelado",     dotClass: "from-gray-500 to-gray-600" },
];

export default function EstadosTurnosLegend() {
  return (
    <div className="mb-4 flex items-center gap-4 flex-wrap">
      <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Estados de turnos
      </div>

      {ITEMS.map((it) => (
        <div key={it.id} className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${it.dotClass}`} />
          <span className="text-sm text-gray-700 font-medium whitespace-nowrap">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
