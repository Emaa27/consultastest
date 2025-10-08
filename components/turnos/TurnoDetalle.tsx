// components/turnos/TurnoDetalleModal.tsx
"use client";

import * as React from "react";

type TurnoDetalle = {
  id: number;
  estado: string;
  inicio: string | Date;
  fin: string | Date | null;
  duracion_min: number | null;
  profesionales: {
    usuarios: { nombre: string; apellido: string };
    profesiones: { nombre: string };
  };
  pacientes: {
    nombre: string;
    apellido: string;
    documento?: string | null;
    telefono?: string | null;
    obras_sociales?: { nombre: string } | null;
  };
};

type Props = {
  turnoId: number | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpdate?: () => void;
};

// Íconos
const Pencil = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 20H5a1 1 0 0 1-1-1v-7" />
    <path d="m16.5 3.5 4 4L9 19l-5 1 1-5 11.5-11.5Z" />
  </svg>
);

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20,6 9,17 4,12" strokeWidth="2"></polyline>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2"></line>
    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2"></line>
  </svg>
);

// Opciones de estados con colores
const estadosOpciones = [
  { value: "reservado", label: "Reservado", color: "bg-sky-100 text-sky-700 border-sky-300" },
  { value: "recepcionado", label: "Recepcionado", color: "bg-indigo-100 text-indigo-700 border-indigo-300" },
  { value: "en_consulta", label: "En consulta", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "atendido", label: "Atendido", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "ausente", label: "No asistió", color: "bg-gray-100 text-gray-700 border-gray-300" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-700 border-red-300" },
];

export default function TurnoDetalleModal({ turnoId, open, onOpenChange, onUpdate }: Props) {
  const [data, setData] = React.useState<TurnoDetalle | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [updating, setUpdating] = React.useState(false);
  const [editingEstado, setEditingEstado] = React.useState(false);
  const [nuevoEstado, setNuevoEstado] = React.useState<string>("");

  React.useEffect(() => {
    let active = true;
    async function load() {
      if (!turnoId || !open) return;
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/turnos/detalle/${turnoId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (active) setData(json);
      } catch (e: any) {
        if (active) setErr("No se pudo cargar el detalle del turno");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [turnoId, open]);

  const getEstadoInfo = (estado: string) => {
    return estadosOpciones.find(e => e.value === estado) || estadosOpciones[0];
  };

  const handleGuardarEstado = async () => {
    if (!turnoId || nuevoEstado === data?.estado) {
      setEditingEstado(false);
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/turnos/detalle/${turnoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      const updated = await res.json();
      setData(updated);
      setEditingEstado(false);
      onUpdate?.();
    } catch (e) {
      setErr("No se pudo actualizar el estado");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"} `}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div
        className={`absolute left-1/2 top-1/2 w-[min(540px,92vw)] -translate-x-1/2 -translate-y-1/2 
                    rounded-xl bg-white p-6 shadow-2xl transition-all duration-200 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Detalle del Turno</h3>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 
                     transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-sm text-gray-600">Cargando…</p>
          </div>
        )}
        
        {err && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-600">{err}</p>
          </div>
        )}

        {!loading && !err && data && (
          <div className="space-y-4">
            {/* Estado - Sección destacada */}
            <section className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Estado del Turno
              </p>
              
              {!editingEstado ? (
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm 
                              font-medium border ${getEstadoInfo(data.estado).color}`}
                  >
                    {getEstadoInfo(data.estado).label}
                  </span>
                  <button
                    onClick={() => {
                      setEditingEstado(true);
                      setNuevoEstado(data.estado);
                    }}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 
                             transition-colors focus:outline-none focus:ring-2 
                             focus:ring-blue-300"
                    aria-label="Editar estado"
                    title="Cambiar estado"
                    type="button"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Selector de estados mejorado */}
                  <div className="grid grid-cols-2 gap-2">
                    {estadosOpciones.map((opcion) => (
                      <button
                        key={opcion.value}
                        onClick={() => setNuevoEstado(opcion.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border-2 
                                  transition-all duration-150 text-left ${
                          nuevoEstado === opcion.value
                            ? `${opcion.color} ring-2 ring-offset-1 ring-blue-400`
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {opcion.label}
                      </button>
                    ))}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleGuardarEstado}
                      disabled={updating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                               bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                               disabled:opacity-50 disabled:cursor-not-allowed 
                               transition-colors font-medium text-sm"
                    >
                      <Check className="w-4 h-4" />
                      {updating ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      onClick={() => setEditingEstado(false)}
                      disabled={updating}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                               hover:bg-gray-50 disabled:opacity-50 transition-colors 
                               font-medium text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Información del profesional y horarios */}
            <section className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Profesional
                </p>
                <p className="font-semibold text-gray-800">
                  Dr. {data.profesionales.usuarios.apellido}
                </p>
                <p className="text-sm text-gray-600">
                  {data.profesionales.usuarios.nombre}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {data.profesionales.profesiones.nombre}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Inicio
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(data.inicio).toLocaleString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Fin
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {data.fin
                      ? new Date(data.fin).toLocaleString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Información del paciente */}
            <section className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Información del Paciente
              </p>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-semibold text-gray-800 text-base">
                  {data.pacientes.apellido}, {data.pacientes.nombre}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">DNI</p>
                  <p className="text-sm font-medium text-gray-800">
                    {data.pacientes.documento || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Teléfono</p>
                  <p className="text-sm font-medium text-gray-800">
                    {data.pacientes.telefono || "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Obra Social</p>
                <p className="text-sm font-medium text-gray-800">
                  {data.pacientes.obras_sociales?.nombre || "Sin obra social"}
                </p>
              </div>
            </section>

            {/* Botón cerrar */}
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => onOpenChange(false)}
                className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg 
                         hover:bg-gray-200 transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

