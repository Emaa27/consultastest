// utils/turnos.ts

export const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 dom, 1 lun, ..., 6 sáb
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // llevar a lunes
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export type EstadoTurno =
  | "reservado"
  | "recepcionado"
  | "en_consulta"
  | "atendido"
  | "ausente"
  | "cancelado";

const estadoGradients: Record<EstadoTurno | "default", string> = {
  reservado:    "from-sky-400 to-sky-500",
  recepcionado: "from-indigo-400 to-indigo-500",
  en_consulta:  "from-amber-400 to-orange-500",
  atendido:     "from-emerald-400 to-green-500",
  ausente:      "from-slate-400 to-gray-500",
  cancelado:    "from-rose-400 to-red-500",
  default:      "from-gray-300 to-gray-400",
};

export const getColorByStatus = (estado?: string) =>
  estadoGradients[(estado as EstadoTurno) ?? "default"] ?? estadoGradients.default;

export const formatWeekRangeLabel = (daysOfWeek: Date[]) => {
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
};

export const getCurrentLocalDate = () => {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};