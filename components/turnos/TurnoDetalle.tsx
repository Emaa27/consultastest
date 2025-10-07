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
// Ícono (puedes ponerlo junto a tus otros SVGs)
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

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"} `}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog */}
      <div
        className={`absolute left-1/2 top-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-xl transition-transform ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold">Detalle del turno</h3>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md px-2 py-1 text-sm hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        {loading && <p className="text-sm text-neutral-600">Cargando…</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}

        {!loading && !err && data && (
          <div className="space-y-3 text-sm">
            <section className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-neutral-500">Estado</p>
                {!editingEstado ? (
                  <div className="flex items-center gap-2">
                    <p className="font-medium capitalize">
                        {data.estado.replace("_", " ")}
                    </p>

                    <button
                        onClick={() => {
                        setEditingEstado(true);
                        setNuevoEstado(data.estado);
                        }}
                        className="p-1 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        aria-label="Editar estado"
                        title="Editar estado"
                        type="button"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    </div>

                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      value={nuevoEstado}
                      onChange={(e) => setNuevoEstado(e.target.value)}
                      className="text-sm border border-neutral-300 rounded px-2 py-1"
                    >
                      <option value="recepcionado">Recepcionado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    <button
                      onClick={() => setEditingEstado(false)}
                      className="text-xs text-neutral-600 hover:text-neutral-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div>
                <p className="text-neutral-500">Profesional</p>
                <p className="font-medium">
                  Dr. {data.profesionales.usuarios.apellido}, {data.profesionales.usuarios.nombre}
                </p>
                <p className="text-neutral-600">{data.profesionales.profesiones.nombre}</p>
              </div>
              <div>
                <p className="text-neutral-500">Inicio</p>
                <p className="font-medium">
                  {new Date(data.inicio).toLocaleString([], { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-neutral-500">Fin</p>
                <p className="font-medium">
                  {data.fin
                    ? new Date(data.fin).toLocaleString([], { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })
                    : "—"}
                </p>
              </div>
            </section>

            <hr className="border-neutral-200" />

            <section className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <p className="text-neutral-500">Paciente</p>
                <p className="font-medium">
                  {data.pacientes.apellido} {data.pacientes.nombre}
                </p>
              </div>
              <div>
                <p className="text-neutral-500">DNI</p>
                <p className="font-medium">{data.pacientes.documento ?? "—"}</p>
              </div>
              <div>
                <p className="text-neutral-500">Teléfono</p>
                <p className="font-medium">{data.pacientes.telefono ?? "—"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-neutral-500">Obra social</p>
                <p className="font-medium">
                  {data.pacientes.obras_sociales?.nombre ?? "Sin obra social"}
                </p>
              </div>
            </section>

            <div className="pt-2 flex gap-2 justify-end">
              {editingEstado && (
                <button
                  onClick={async () => {
                    if (!turnoId || nuevoEstado === data.estado) {
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
                  }}
                  disabled={updating}
                  className="rounded-lg px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? "Guardando..." : "Guardar"}
                </button>
              )}
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200"
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
