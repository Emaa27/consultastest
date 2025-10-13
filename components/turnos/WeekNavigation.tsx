// components/turnos/WeekNavigation.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "@/components/turnos/icons";

interface WeekNavigationProps {
  weekRangeLabel: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onTodayWeek: () => void;
}

export default function WeekNavigation({
  weekRangeLabel,
  onPrevWeek,
  onNextWeek,
  onTodayWeek,
}: WeekNavigationProps) {
  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevWeek}
          className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition"
          aria-label="Semana anterior"
          title="Semana anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onTodayWeek}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition text-sm font-medium"
          title="Volver a la semana actual"
        >
          Hoy
        </button>

        <button
          onClick={onNextWeek}
          className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition"
          aria-label="Semana siguiente"
          title="Semana siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="text-sm md:text-base text-gray-700 font-semibold">
        Semana: <span className="text-[#6596d8]">{weekRangeLabel}</span>
      </div>
    </div>
  );
}