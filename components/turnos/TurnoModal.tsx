// components/turnos/TurnoModal.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, User, Stethoscope, X, Plus } from "@/components/turnos/icons";
import SearchableCombo from "@/components/turnos/SearchableCombo";
import { Paciente, Profesional, Agenda, ComboItem } from "@/types/turnos";
import { getCurrentLocalDate } from "@/utils/turnos";

// Helpers fecha
const toDateStr = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ===== Helpers robustos para hora/fecha =====
const pad2 = (n: number) => String(n).padStart(2, "0");

/** "HH:MM" para mostrar slots en la UI */
export function formatHM(d: Date) {
  if (isNaN(d.getTime())) return "INVALID_TIME";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** "HH:MM:SS" para armar payloads "YYYY-MM-DD HH:MM:SS" */
export function formatHMS(d: Date) {
  if (isNaN(d.getTime())) return "INVALID_DATE";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * Devuelve "HH:MM:SS" desde:
 *  - ISO con Z (ej: "1970-01-01T11:00:00.000Z") → usa UTC para no desplazar la hora
 *  - Date → usa hora local
 *  - "HH:MM" o "HH:MM:SS" → la normaliza
 */
export function hmsFromAny(v: unknown): string {
  if (!v) return "";

  // String ISO con "T" (posible Z): interpretamos en UTC
  if (typeof v === "string" && v.includes("T")) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`;
    }
  }

  // Date: usamos hora local
  if (v instanceof Date) {
    const d = v as Date; // <-- faltaba esta 'd'
    if (!isNaN(d.getTime())) {
      return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
    }
  }

  // Fallback: "HH:MM" o "HH:MM:SS"
  if (typeof v === "string") {
    const m = v.match(/\b(\d{2}):(\d{2})(?::(\d{2}))?\b/);
    if (m) return `${m[1]}:${m[2]}:${m[3] ?? "00"}`;
  }

  return "";
}

/** Crea Date local desde "YYYY-MM-DD" + "HH:MM:SS" (sin TZ) */
export function buildLocalDate(dateStr: string, hms: string) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [hh, mm, ss] = hms.split(":").map(Number);
  return new Date(y, (mo ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, ss ?? 0);
}

export function fmtHM(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/* ===== Helpers opcionales/legacy (úsalos solo si ya los referenciás en otro lado) ===== */

/** Asegura "HH:MM:SS" desde "HH:MM" o "HH:MM:SS" (no sirve para ISO completo) */
export function ensureHMS(timeStr: string | null | undefined): string {
  if (!timeStr || typeof timeStr !== "string") return "";
  const parts = timeStr.split(":");
  if (parts.length === 2) return `${parts[0]}:${parts[1]}:00`;
  if (parts.length === 3) return timeStr;
  return ""; // formato desconocido
}

/** Crea Date local "YYYY-MM-DD" + hora (usa ensureHMS). Para strings simples, no ISO. */
export function buildDate(dateStr: string, timeStr: string) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [hh, mm, ss] = ensureHMS(timeStr).split(":").map(Number);
  return new Date(y, (mo ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, ss ?? 0);
}

// Convertir día JS (0=Dom, 1=Lun...6=Sab) a día semana (1=Lun...5=Vie)
const getDiaSemana = (date: Date): number => {
  const jsDay = date.getDay(); // 0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab
  if (jsDay === 0) return 0; // Domingo no es laboral
  if (jsDay === 6) return 0; // Sábado no es laboral
  return jsDay; // 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie
};

const isWeekend = (d: Date) => {
  const day = d.getDay();
  return day === 0 || day === 6;
};

const nextBusinessDay = (d: Date) => {
  const x = new Date(d);
  while (isWeekend(x)) x.setDate(x.getDate() + 1);
  return x;
};

/* =============== Mini calendario mensual (Lu..Do) =============== */
function CalendarMonth({
  value,
  onChange,
  minDate,
  disabledWeekends = true,
}: {
  value: string;                // YYYY-MM-DD
  onChange: (v: string) => void;
  minDate?: string;             // YYYY-MM-DD
  disabledWeekends?: boolean;
}) {
  const selected = new Date(`${value}T00:00:00`);
  const [cursor, setCursor] = useState<Date>(new Date(selected));

  useEffect(() => {
    setCursor(new Date(`${value}T00:00:00`));
  }, [value]);

  const y = cursor.getFullYear();
  const m = cursor.getMonth();

  const startMonth = new Date(y, m, 1);
  const endMonth = new Date(y, m + 1, 0);
  const startDow = (startMonth.getDay() + 6) % 7; // 0=Lu..6=Do
  const daysInMonth = endMonth.getDate();

  const todayStr = toDateStr(new Date());
  const min = minDate ? new Date(`${minDate}T00:00:00`) : null;

  const weeks: Array<Array<Date | null>> = [];
  let currentRow: Array<Date | null> = Array.from({ length: startDow }, () => null);

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(y, m, d);
    currentRow.push(dt);
    if (currentRow.length === 7) {
      weeks.push(currentRow);
      currentRow = [];
    }
  }
  if (currentRow.length) {
    while (currentRow.length < 7) currentRow.push(null);
    weeks.push(currentRow);
  }

  const canPick = (d: Date) => {
    if (disabledWeekends && isWeekend(d)) return false;
    if (min && d < min) return false;
    return true;
  };

  const weekLabels = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  // Logs de calendario
  console.log("[CalendarMonth] render", {
    value,
    cursor: cursor.toISOString(),
    minDate,
    disabledWeekends,
    startDow,
    daysInMonth,
  });

  return (
    <div className="w-full">
      {/* header mes/año */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => {
            console.log("[CalendarMonth] prev month click");
            setCursor(new Date(y, m - 1, 1));
          }}
          className="px-2 py-1 rounded hover:bg-gray-100"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <div className="font-semibold text-gray-700">
          {cursor.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
        </div>
        <button
          type="button"
          onClick={() => {
            console.log("[CalendarMonth] next month click");
            setCursor(new Date(y, m + 1, 1));
          }}
          className="px-2 py-1 rounded hover:bg-gray-100"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      {/* etiquetas semana */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {weekLabels.map((l) => (
          <div key={l} className="py-1">{l}</div>
        ))}
      </div>

      {/* grilla días */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((row, i) =>
          row.map((d, j) => {
            if (!d) return <div key={`${i}-${j}`} className="h-8" />;
            const ds = toDateStr(d);
            const selectedDay = ds === value;
            const isToday = ds === todayStr;
            const disabled = !canPick(d);

            return (
              <button
                key={`${i}-${j}`}
                type="button"
                onClick={() => {
                  if (!disabled) {
                    console.log("[CalendarMonth] pick date", { picked: ds });
                    onChange(ds);
                  } else {
                    console.log("[CalendarMonth] blocked date", { blocked: ds });
                  }
                }}
                disabled={disabled}
                className={[
                  "h-8 rounded text-sm transition-colors",
                  disabled
                    ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                    : "hover:bg-blue-50",
                  selectedDay ? "bg-blue-100 text-blue-700 font-semibold" : "",
                  isToday && !selectedDay ? "ring-1 ring-blue-300" : "",
                ].join(" ")}
              >
                {d.getDate()}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

/* =============== Lista de horarios disponibles =============== */
function SlotsList({
  slots,
  value,
  onChange,
}: {
  slots: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  console.log("[SlotsList] render", { totalSlots: slots.length, selected: value, sample: slots.slice(0, 5) });
  return (
    <div className="border rounded-lg h-64 overflow-auto">
      {slots.length === 0 ? (
        <div className="h-full flex items-center justify-center text-sm text-gray-500">
          Sin horarios disponibles
        </div>
      ) : (
        <ul>
          {slots.map((h) => {
            const active = h === value;
            return (
              <li key={h}>
                <button
                  type="button"
                  onClick={() => {
                    console.log("[SlotsList] select hour", { hour: h });
                    onChange(h);
                  }}
                  className={[
                    "w-full text-left px-3 py-2 text-sm",
                    active
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-50 text-gray-700",
                  ].join(" ")}
                >
                  {h}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface TurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  profesionales: Profesional[];
  onTurnoGuardado: () => void;
}

export default function TurnoModal({
  isOpen,
  onClose,
  pacientes,
  profesionales,
  onTurnoGuardado,
}: TurnoModalProps) {
  const [pacienteId, setPacienteId] = useState("");
  const [profesionalId, setProfesionalId] = useState("");

  const hoy = nextBusinessDay(new Date());
  const fechaInicial = toDateStr(hoy);
  const [fecha, setFecha] = useState(fechaInicial);
  const [slotMinAgenda, setSlotMinAgenda] = useState<number>(30);

  const [horarios, setHorarios] = useState<string[]>([]);
  const [hora, setHora] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHorarios, setIsLoadingHorarios] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Logs de props iniciales
  console.log("[TurnoModal] props", {
    isOpen,
    pacientesCount: pacientes?.length ?? 0,
    profesionalesCount: profesionales?.length ?? 0,
  });

  // === CARGA DE HORARIOS (agenda + filtro ocupados) ===
  useEffect(() => {
    const cargarHorarios = async () => {
        console.log("[TurnoModal] cargarHorarios:start", { profesionalId, fecha });
        if (!profesionalId || !fecha) {
        console.log("[TurnoModal] faltarían profesionalId/fecha → limpiar horarios");
        setHorarios([]);
        setHora("");
        return;
        }

        const dateObj = new Date(`${fecha}T00:00:00`);
        const dia_semana = getDiaSemana(dateObj);
        console.log("[TurnoModal] cálculo dia_semana", { fecha, jsDay: dateObj.getDay(), dia_semana });

        if (dia_semana < 1 || dia_semana > 5) {
        console.warn("[TurnoModal] fin de semana, no hay horarios");
        setHorarios([]);
        setHora("");
        return;
        }

        setIsLoadingHorarios(true);
        console.time("[TurnoModal] tiempos:carga");

        try {
        // --- 1) Fetch agenda ---
const urlAgenda = `/api/agenda_recep?profesional_id=${profesionalId}&dia_semana=${dia_semana}`;
const rAgenda = await fetch(urlAgenda, { cache: "no-store" });
if (!rAgenda.ok) {
  console.error("[Agenda] error status", rAgenda.status);
  setHorarios([]); setHora("");
  return;
}

const rawAgenda = await rAgenda.json();
console.log("[Agenda] payload(raw)", rawAgenda);

// --- 2) Desanidar formatos comunes ---
const unwrapList = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (!v || typeof v !== "object") return [];
  if (Array.isArray(v.data)) return v.data;
  if (Array.isArray(v.items)) return v.items;
  if (Array.isArray(v.result)) return v.result;
  if (Array.isArray(v.rows)) return v.rows;
  if (Array.isArray(v.agendas)) return v.agendas;
  // si vino 1 objeto simple, lo tratamos como una sola fila
  return [v];
};

const agendas: Agenda[] = unwrapList(rawAgenda);
console.log("[Agenda] filas detectadas:", agendas.length, agendas);

// --- 3) Generar slots de TODAS las filas ---
const allSlots: string[] = [];
let anySlotMin: number | null = null;

for (const ag of agendas) {
  const hIni = hmsFromAny(ag.hora_inicio);
  const hFin = hmsFromAny(ag.hora_fin);
  if (!hIni || !hFin) continue;

  const inicio = buildLocalDate(fecha, hIni);
  const fin = buildLocalDate(fecha, hFin);
  if (!(inicio < fin)) continue;

  const slotMin = Number(ag.slot_min);
  if (!Number.isFinite(slotMin) || slotMin <= 0) continue;

  anySlotMin = anySlotMin ?? slotMin;

  let cur = new Date(inicio);
  let guard = 0;
  while (cur < fin) {
    allSlots.push(fmtHM(cur));
    cur = new Date(cur.getTime() + slotMin * 60000);
    if (++guard > 2000) break;
  }
}

const slotsUnicosOrdenados = Array.from(new Set(allSlots)).sort((a, b) => {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return ah * 60 + am - (bh * 60 + bm);
});

if (slotsUnicosOrdenados.length === 0) {
  setHorarios([]); setHora(""); setIsLoadingHorarios(false);
  return;
}

setSlotMinAgenda(anySlotMin ?? 30);

// --- 4) Filtrar ocupados (igual que ya lo tienes) ---
const urlOcupados = `/api/turnos?profesional_id=${profesionalId}&fecha=${fecha}`;
const rOcupados = await fetch(urlOcupados, { cache: "no-store" });
if (!rOcupados.ok) {
  setHorarios(slotsUnicosOrdenados);
  setHora(slotsUnicosOrdenados[0] || "");
  return;
}
const turnosOcupados = await rOcupados.json();
const horasOcupadas = new Set<string>();
// Solo marcar como ocupados los turnos que NO están cancelados ni ausentes
(turnosOcupados || []).forEach((t: any) => {
  // Ignorar turnos cancelados y ausentes - esos slots quedan disponibles
  if (t?.estado === 'cancelado' || t?.estado === 'ausente') {
    return;
  }

  const d = new Date(t?.inicio);
  if (!isNaN(d.getTime())) {
    horasOcupadas.add(formatHM(d));
  } else if (typeof t?.inicio === "string") {
    const m = t.inicio.match(/\b(\d{2}):(\d{2})(?::\d{2})?\b/);
    if (m) horasOcupadas.add(`${m[1]}:${m[2]}`);
  }
});

// Filtrar horarios pasados si es el día de hoy
const ahora = new Date();
const hoyStr = toDateStr(ahora);
const esHoy = fecha === hoyStr;

let slotsDisponibles = slotsUnicosOrdenados.filter(s => !horasOcupadas.has(s));

if (esHoy) {
  const horaActual = ahora.getHours();
  const minutoActual = ahora.getMinutes();
  const minutosActuales = horaActual * 60 + minutoActual;
  
  slotsDisponibles = slotsDisponibles.filter(slot => {
    const [h, m] = slot.split(':').map(Number);
    const minutosSlot = h * 60 + m;
    return minutosSlot > minutosActuales;
  });
}

setHorarios(slotsDisponibles);
setHora(slotsDisponibles[0] || "");
        } catch (error) {
        console.error("[TurnoModal] error cargando horarios", error);
        setHorarios([]);
        setHora("");
        } finally {
        setIsLoadingHorarios(false);
        console.timeEnd("[TurnoModal] tiempos:carga");
        }
    };

    cargarHorarios();
    }, [profesionalId, fecha]);


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Submit] intento", { profesionalId, pacienteId, fecha, hora });

    if (!profesionalId || !pacienteId || !fecha || !hora) {
        alert("Por favor complete todos los campos");
        return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    // NO usar Date/TZ: armamos strings exactos
    const inicioStr = `${fecha} ${hora}:00`;          // "YYYY-MM-DD HH:MM:SS"
    // sumar slotMinAgenda minutos a "hora"
    const [hh, mm] = hora.split(":").map(Number);
    const base = new Date(2000, 0, 1, hh, mm, 0);     // sólo para sumar minutos, no para enviar
    base.setMinutes(base.getMinutes() + (slotMinAgenda || 30));
    const finStr = `${fecha} ${String(base.getHours()).padStart(2, "0")}:${String(base.getMinutes()).padStart(2, "0")}:00`;

    const nuevoTurno = {
        profesional_id: Number(profesionalId),
        paciente_id: Number(pacienteId),
        inicio: inicioStr,                // <-- string exacto
        fin: finStr,                      // <-- string exacto
        duracion_min: slotMinAgenda || 30,
        estado: "reservado",               // si querés que ya quede atendido// si tu schema lo requiere
    };

    console.log("[Submit] payload (raw)", nuevoTurno);

    try {
        const res = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoTurno),
        });

        console.log("[Submit] response", res.status, res.statusText);
        if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Error al guardar el turno");
        }

        const data = await res.json();
        console.log("[Submit] ok", data);
        setSuccessMessage("Turno guardado correctamente");

        // Reset
        setPacienteId("");
        setProfesionalId("");
        setFecha(fecha);
        setHora("");

        await onTurnoGuardado();
        setTimeout(() => {
        onClose();
        setSuccessMessage("");
        }, 1200);
    } catch (error) {
        console.error("[Submit] catch error", error);
        alert(error instanceof Error ? error.message : "No se pudo guardar el turno");
    } finally {
        setIsLoading(false);
    }
    };

  const profesionalItems: ComboItem[] = useMemo(
    () =>
      profesionales.map((pr) => ({
        value: String(pr.profesional_id),
        label: `Dr. ${pr.usuarios.apellido} ${pr.usuarios.nombre} — ${pr.profesiones.nombre}`,
        keywords: `${pr.usuarios.nombre} ${pr.usuarios.apellido} ${pr.profesiones.nombre} ${pr.matricula}`,
      })),
    [profesionales]
  );

  const pacienteItems: ComboItem[] = useMemo(
    () =>
      pacientes.map((p) => ({
        value: String(p.paciente_id),
        label: `${p.apellido} ${p.nombre} — DNI: ${p.documento}`,
        keywords: `${p.nombre} ${p.apellido} ${p.documento}`,
      })),
    [pacientes]
  );

  // Logs de cambios de selección
  useEffect(() => {
    console.log("[TurnoModal] selección profesional", { profesionalId });
  }, [profesionalId]);

  useEffect(() => {
    console.log("[TurnoModal] selección paciente", { pacienteId });
  }, [pacienteId]);

  useEffect(() => {
    console.log("[TurnoModal] selección fecha", { fecha });
  }, [fecha]);

  useEffect(() => {
    console.log("[TurnoModal] selección hora", { hora });
  }, [hora]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#6596d8]" />
            Nuevo Turno
          </h2>
          <button
            onClick={() => {
              console.log("[TurnoModal] cerrar modal");
              onClose();
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profesional / Paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#6596d8]" />
                Profesional
              </label>
              <SearchableCombo
                items={profesionalItems}
                value={profesionalId}
                onChange={(v) => {
                  console.log("[UI] setProfesionalId", v);
                  setProfesionalId(v);
                }}
                placeholder="Escribí nombre, apellido, profesión o matrícula…"
                emptyText="No se encontraron profesionales"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-[#6596d8]" />
                Paciente
              </label>
              <SearchableCombo
                items={pacienteItems}
                value={pacienteId}
                onChange={(v) => {
                  console.log("[UI] setPacienteId", v);
                  setPacienteId(v);
                }}
                placeholder="Escribí nombre, apellido o DNI…"
                emptyText="No se encontraron pacientes"
              />
            </div>
          </div>

          {/* Calendario + Slots */}
          {profesionalId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#6596d8]" />
                  Fecha
                </label>
                <CalendarMonth
                  value={fecha}
                  onChange={(ds) => {
                    console.log("[UI] setFecha", ds);
                    setFecha(ds);
                  }}
                  minDate={getCurrentLocalDate()}
                  disabledWeekends={true}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#6596d8]" />
                  Hora (disponibles)
                  {isLoadingHorarios && (
                    <span className="text-xs text-gray-500">(cargando...)</span>
                  )}
                </label>
                <SlotsList
                  slots={horarios}
                  value={hora}
                  onChange={(h) => {
                    console.log("[UI] setHora", h);
                    setHora(h);
                  }}
                />
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">✓ {successMessage}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                console.log("[TurnoModal] cancelar click");
                onClose();
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !profesionalId || !pacienteId || !fecha || !hora}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] text-white rounded-lg hover:from-[#2e75d4] hover:to-[#8ddee1] disabled:opacity-50 font-semibold flex items-center justify-center gap-2 transition"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Guardar Turno
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
