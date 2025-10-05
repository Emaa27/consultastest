"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

/* ===================== Íconos ===================== */
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);



const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Stethoscope = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H2a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2H7a.3.3 0 1 0 .2.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

/* ===================== Tipos ===================== */
type Turno = {
  turno_id: number;
  profesionales: {
    matricula: string;
    usuarios: { nombre: string; apellido: string };
    profesiones: { nombre: string };
  };
  pacientes: { nombre: string; apellido: string; documento: string };
  inicio: string;
  fin: string;
};

type Paciente = {
  paciente_id: number;
  nombre: string;
  apellido: string;
  documento: string;
};

type Profesional = {
  profesional_id: number;
  matricula: string;
  usuarios: { nombre: string; apellido: string };
  profesiones: { nombre: string };
};

type Agenda = {
  profesional_id: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  slot_min: number;
}

/* ===================== Utils ===================== */
const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 dom, 1 lun, ..., 6 sáb
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // llevar a lunes
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/* ===================== Searchable Combo (sin librerías) ===================== */
type ComboItem = { value: string; label: string; keywords?: string };

function SearchableCombo({
  items,
  value,
  onChange,
  placeholder = "Buscar…",
  emptyText = "Sin resultados",
}: {
  items: ComboItem[];
  value?: string | null;
  onChange: (v: string) => void;
  placeholder?: string;
  emptyText?: string;
}) {
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

/* ===================== Página ===================== */
export default function TurnosPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [pacienteId, setPacienteId] = useState("");     // guardamos como string para el combo
  const [profesionalId, setProfesionalId] = useState(""); // idem
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0"); // meses empiezan en 0
  const dd = String(hoy.getDate()).padStart(2, "0");

  const fechaLocal = `${yyyy}-${mm}-${dd}`;
  const [fecha, setFecha] = useState(fechaLocal);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [hora, setHora] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingTurnos, setIsLoadingTurnos] = useState(true);
  const [turnos, setTurnos] = useState<Turno[]>([]);

  // Semana visible
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getStartOfWeek(new Date()));
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const weekRangeLabel = (() => {
    const start = daysOfWeek[0];
    const end = daysOfWeek[6];
    const fmtDay = (d: Date) => d.getDate().toString();
    const fmtMonthShort = (d: Date) =>
      d.toLocaleDateString("es-AR", { month: "short" }).replace(".", "");
    const fmtYear = (d: Date) => d.getFullYear().toString();

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${fmtDay(start)}–${fmtDay(end)} ${fmtMonthShort(end)} ${fmtYear(end)}`;
    } else if (start.getFullYear() === end.getFullYear()) {
      return `${fmtDay(start)} ${fmtMonthShort(start)} – ${fmtDay(end)} ${fmtMonthShort(end)} ${fmtYear(end)}`;
    } else {
      return `${fmtDay(start)} ${fmtMonthShort(start)} ${fmtYear(start)} – ${fmtDay(end)} ${fmtMonthShort(end)} ${fmtYear(end)}`;
    }
  })();

  useEffect(() => {
    fetch("/api/pacientes").then((res) => res.json()).then(setPacientes);
    fetch("/api/profesionales").then((res) => res.json()).then(setProfesionales);
  }, []);

  useEffect(() => {
    const cargarHorarios = async () => {
      if (!profesionalId || !fecha) return;

      const profesional_id = profesionalId;
      const dia_semana = new Date(fecha).getDay(); // (Domingo-Sábado : 0-6)

      try {
        const res = await fetch(
          `/api/agenda_semanal?profesional_id=${profesional_id}&dia_semana=${dia_semana}`
        );
        const data: Agenda = await res.json();

        // Array para contener las opciones de horario
        const arrayHorarios: string[] = [];
        // Inicio y fin de la agenda para el profesional y día seleccionado
        let inicio = new Date(`${data.hora_inicio}`);
        let fin = new Date(`${data.hora_fin}`);

        // Este while es para ir aumentando la variable inicio en "slot_min" minutos
        while (inicio < fin) {
          // console.log(inicio);
          arrayHorarios.push(
            inicio.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
          );
          inicio.setMinutes(inicio.getMinutes() + data.slot_min);
        }

        // console.log("Horario:", arrayHorarios)

        setHorarios(arrayHorarios);
        setHora(arrayHorarios[0]);
        
      } catch (error) {
        console.error("Error cargando horarios:", error);
      }
    };

    cargarHorarios();
  }, [profesionalId, fecha]) // Esto lo hago para que se ejecute todo esta sección de código cuando cambian los estados "profesionalId" ó "fecha"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    const nuevoTurno = {
      profesional_id: profesionalId, // si la API espera número, casteá en backend o hacé Number(profesionalId)
      paciente_id: pacienteId,
      fecha,
      hora,
    };

    try {
      const res = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoTurno),
      });
      if (!res.ok) throw new Error("Error al guardar el turno");

      await res.json();
      setSuccessMessage("Turno guardado correctamente");

      setPacienteId("");
      setProfesionalId("");
      setFecha(fechaLocal);
      setHora("");

      await cargarTurnos();

      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar el turno");
    } finally {
      setIsLoading(false);
    }
  };

  const cargarTurnos = async () => {
    setIsLoadingTurnos(true);
    try {
      const res = await fetch("/api/turnos");
      const data: Turno[] = await res.json();

      data.sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
      setTurnos(data);
    } catch (error) {
      console.error("Error cargando turnos", error);
      alert("Error al cargar los turnos");
    } finally {
      setIsLoadingTurnos(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const turnosPorDia = (day: Date) => {
    const ahora = new Date();
    return turnos
      .filter((t) => {
        const inicio = new Date(t.inicio);

        // Filtrar por día
        const mismoDia =
          inicio.getFullYear() === day.getFullYear() &&
          inicio.getMonth() === day.getMonth() &&
          inicio.getDate() === day.getDate();

        if (!mismoDia) return false;

        // Si NO se muestra histórico → solo turnos de hoy en adelante
        if (!mostrarHistorico && day.toDateString() === ahora.toDateString()) {
          return inicio >= ahora;
        }

        return true; // muestra todo lo demás
      })
      .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
  };

  const getColorByProfession = (profesion: string) => {
    const colors: { [key: string]: string } = {
      Clínico: "from-blue-400 to-blue-500",
      Odontólogo: "from-purple-400 to-purple-500",
      Psicólogo: "from-pink-400 to-pink-500",
      Nutricionista: "from-yellow-400 to-yellow-500",
      default: "from-orange-400 to-yellow-400",
    };
    return colors[profesion] || colors["default"];
  };

  const goPrevWeek = () => setCurrentWeekStart((d) => addDays(d, -7));
  const goNextWeek = () => setCurrentWeekStart((d) => addDays(d, +7));
  const goTodayWeek = () => setCurrentWeekStart(getStartOfWeek(new Date()));

  // ===== Items para combos =====
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

  return (
    //cambio aquí 
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2e75d4] to-[#8ddee1] bg-clip-text text-transparent mb-3">Calendario de turnos</h1>
        <p className="text-gray-600 text-lg">Visualización de los turnos médicos del consultorio</p>
      </div>

      {/* Barra de navegación semanal */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrevWeek}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition"
            aria-label="Semana anterior"
            title="Semana anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goTodayWeek}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition text-sm font-medium"
            title="Volver a la semana actual"
          >
            Hoy
          </button>

          <button
            onClick={goNextWeek}
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

      {/* Botón agregar turno */}
      <button
        className="px-6 py-3 bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] text-white rounded-lg 
               hover:from-[#2e75d4] hover:to-[#8ddee1] shadow-lg transform transition-all duration-200 
               hover:scale-[1.02] active:scale-[0.98] font-semibold flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="w-5 h-5" />
        Agregar Nuevo Turno
      </button>
      
      {/* Checkbox Mostrar Histórico */}
      <div
        className="inline-flex items-center gap-2 px-3 py-2 mb-6 
                  bg-gradient-to-r from-[#f8fafc] to-[#eef6fb] 
                  border border-gray-200 rounded-lg shadow-sm 
                  hover:shadow-md transition-all duration-200"
      >
        <input
          id="mostrarHistorico"
          type="checkbox"
          checked={mostrarHistorico}
          onChange={(e) => setMostrarHistorico(e.target.checked)}
          className="h-4 w-4 text-[#6596d8] border-gray-300 rounded focus:ring-[#6596d8] cursor-pointer"
        />
        <label
          htmlFor="mostrarHistorico"
          className="text-sm font-semibold text-gray-700 cursor-pointer select-none"
        >
          Histórico
        </label>
      </div>


      {/* Calendario */}
      {isLoadingTurnos ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6596d8] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando turnos...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {daysOfWeek.map((day, idx) => {
            const isToday = new Date().toDateString() === day.toDateString();
            const turnosDelDia = turnosPorDia(day);

            return (
              <div
                key={idx}
                className={`border rounded-xl p-3 transition-all duration-200 ${
                  isToday
                    ? "bg-gradient-to-br from-[#6596d8]/10 to-[#b5e4e6]/10 border-[#6596d8] shadow-lg"
                    : "bg-white hover:shadow-md border-gray-200"
                }`}
              >
                <div className="mb-3 text-center">
                  <h3 className={`font-bold ${isToday ? "text-[#6596d8]" : "text-gray-700"}`}>
                    {day.toLocaleDateString("es-AR", { weekday: "short" })}
                  </h3>
                  <p className={`text-2xl font-bold ${isToday ? "text-[#6596d8]" : "text-gray-800"}`}>
                    {day.getDate()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {day.toLocaleDateString("es-AR", { month: "short" })}
                  </p>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {turnosDelDia.length === 0 ? (
                    <p className="text-gray-400 text-xs text-center py-4">Sin turnos</p>
                  ) : (
                    turnosDelDia.map((t) => {
                      const inicio = new Date(t.inicio);
                      const fin = new Date(t.fin);
                      const colorGradient = getColorByProfession(t.profesionales.profesiones.nombre);

                      return (
                        <div
                          key={t.turno_id}
                          className={`p-2 rounded-lg bg-gradient-to-r ${colorGradient} text-white shadow-sm 
                                      hover:shadow-md transform transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            <p className="text-xs font-semibold">
                              {inicio.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" - "}
                              {fin.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>

                          <p className="text-xs font-bold truncate">Dr. {t.profesionales.usuarios.apellido}</p>

                          <div className="flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" />
                            <p className="text-xs truncate opacity-90">
                              {t.pacientes.apellido} {t.pacientes.nombre}
                            </p>
                          </div>

                          <p className="text-xs opacity-75 mt-1">{t.profesionales.profesiones.nombre}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            {/* Header del modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#6596d8]" />
                Nuevo Turno
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profesional (Combo) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#6596d8]" />
                  Profesional
                </label>
                <SearchableCombo
                  items={profesionalItems}
                  value={profesionalId}
                  onChange={(v) => setProfesionalId(v)}
                  placeholder="Escribí nombre, apellido, profesión o matrícula…"
                  emptyText="No se encontraron profesionales"
                />
              </div>

              {/* Paciente (Combo) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#6596d8]" />
                  Paciente
                </label>
                <SearchableCombo
                  items={pacienteItems}
                  value={pacienteId}
                  onChange={(v) => setPacienteId(v)}
                  placeholder="Escribí nombre, apellido o DNI…"
                  emptyText="No se encontraron pacientes"
                />
              </div>

              {/* Fecha y Hora (sólo se muestra si es que tengo seleccionado un profesional) */}
              { profesionalId && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#6596d8]" />
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={fecha}
                      min={fechaLocal}
                      onChange={(e) => setFecha(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 
                                focus:text-[#6596d8] focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#6596d8]" />
                      Hora
                    </label>
                    <select
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6596d8] focus:border-transparent transition-all duration-200"
                      required
                    >
                      {horarios.map((h, i) => (
                        <option key={i} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="text-sm font-medium">✓ {successMessage}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                             disabled:opacity-50 font-semibold transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] text-white 
                             rounded-lg hover:from-[#2e75d4] hover:to-[#8ddee1] disabled:opacity-50 
                             font-semibold flex items-center justify-center gap-2 transform transition-all 
                             duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
      )}
    </div>
  );
}
