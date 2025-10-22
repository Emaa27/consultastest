"use client";

import React from "react";
import DayColumn from "@/components/turnos/DayColumn";
import { Turno } from "@/types/turnos";

type Filtros = {
  profesional_id: number | null;
  obra_social_id: number | null;
  mostrarHistorico: boolean;
};

interface CalendarGridProps {
  daysOfWeek: Date[];
  turnos: Turno[];
  filtros: Filtros;
  busqueda?: string;
  onUpdate?: () => void;
}

export default function CalendarGrid({
  daysOfWeek,
  turnos,
  filtros,
  busqueda = "",
  onUpdate,
}: CalendarGridProps) {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const toDate = (d: string | Date) => new Date(d);

  const turnosPorDia = (day: Date) =>
    turnos
      .filter((t) => {
        const inicio = new Date(t.inicio as any);

        // 1) pertenece al día
        const matchesDay =
          inicio.getFullYear() === day.getFullYear() &&
          inicio.getMonth() === day.getMonth() &&
          inicio.getDate() === day.getDate();

        // 2) profesional
        const matchesProfesional =
          !filtros.profesional_id || t.profesional_id === filtros.profesional_id;

        // 3) obra social (usa la del turno y si no, la del paciente)
        const osTurno =
          t.obra_social_id ??
          (t.pacientes && "obra_social_id" in t.pacientes
            ? t.pacientes.obra_social_id ?? null
            : null);
        const matchesOS =
          !filtros.obra_social_id || osTurno === filtros.obra_social_id;

        // 4) histórico
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const withinHistoric =
          filtros.mostrarHistorico ||
          ( // si no mostramos histórico: hoy desde ahora; futuro todo; pasado nada
            (day.getFullYear() === now.getFullYear() &&
              day.getMonth() === now.getMonth() &&
              day.getDate() === now.getDate()
              ? inicio >= now
              : day > startOfToday)
          );

        // 5) buscador (paciente o profesional, sin acentos)
        const norm = (s: string) =>
          s
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

        const q = norm(busqueda || "");

        const pacienteNombre = norm(
          `${t.pacientes?.nombre ?? ""} ${t.pacientes?.apellido ?? ""}`
        );
        const profesionalNombre = norm(
          `${t.profesionales?.usuarios?.nombre ?? ""} ${t.profesionales?.usuarios?.apellido ?? ""}`
        );

        const matchesSearch = !q || pacienteNombre.includes(q) || profesionalNombre.includes(q);
        return (
          matchesDay &&
          matchesProfesional &&
          matchesOS &&
          withinHistoric &&
          matchesSearch
        );
      })
      .sort(
        (a, b) =>
          new Date(a.inicio as any).getTime() -
          new Date(b.inicio as any).getTime()
      );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
      {daysOfWeek.map((day, idx) => {
        const isToday = sameDay(new Date(), day);
        const turnosDelDia = turnosPorDia(day);

        return (
          <DayColumn
            key={idx}
            day={day}
            turnos={turnosDelDia}
            isToday={isToday}
            onUpdate={onUpdate}
          />
        );
      })}
    </div>
  );
}