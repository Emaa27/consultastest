// components/turnos/FiltrosModal.tsx
"use client";

import React from "react";
import { Profesional } from "@/types/turnos";

type ObraSocial = {
  obra_social_id: number;
  nombre: string;
};

type Filtros = {
  profesional_id: number | null;
  obra_social_id: number | null;
  mostrarHistorico: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filtros: Filtros;
  onFiltrosChange: (filtros: Filtros) => void;
  profesionales: Profesional[];
  obrasSociales: ObraSocial[];
};

export default function FiltrosModal({
  open,
  onOpenChange,
  filtros,
  onFiltrosChange,
  profesionales,
  obrasSociales,
}: Props) {
  const [localFiltros, setLocalFiltros] = React.useState<Filtros>(filtros);

  React.useEffect(() => {
    if (open) {
      setLocalFiltros(filtros);
    }
  }, [open, filtros]);

  const handleAplicar = () => {
    onFiltrosChange(localFiltros);
    onOpenChange(false);
  };

  const handleLimpiar = () => {
    const filtrosVacios: Filtros = {
      profesional_id: null,
      obra_social_id: null,
      mostrarHistorico: false,
    };
    setLocalFiltros(filtrosVacios);
    onFiltrosChange(filtrosVacios);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div
        className="relative w-[min(500px,92vw)] rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Filtros de turnos</h3>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md px-2 py-1 text-sm hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Filtro por Profesional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profesional
            </label>
            <select
              value={localFiltros.profesional_id ?? ""}
              onChange={(e) =>
                setLocalFiltros({
                  ...localFiltros,
                  profesional_id: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los profesionales</option>
              {profesionales.map((prof) => (
                <option key={prof.profesional_id} value={prof.profesional_id}>
                  Dr. {prof.usuarios.apellido}, {prof.usuarios.nombre} - {prof.profesiones.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Obra Social */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Obra Social
            </label>
            <select
              value={localFiltros.obra_social_id ?? ""}
              onChange={(e) =>
                setLocalFiltros({
                  ...localFiltros,
                  obra_social_id: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las obras sociales</option>
              {obrasSociales.map((os) => (
                <option key={os.obra_social_id} value={os.obra_social_id}>
                  {os.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox Mostrar Histórico */}
          <div className="flex items-center gap-2">
            <input
              id="filtroHistorico"
              type="checkbox"
              checked={localFiltros.mostrarHistorico}
              onChange={(e) =>
                setLocalFiltros({
                  ...localFiltros,
                  mostrarHistorico: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="filtroHistorico"
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              Mostrar turnos históricos
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleLimpiar}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpiar filtros
          </button>
          <button
            onClick={handleAplicar}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] rounded-lg hover:from-[#2e75d4] hover:to-[#8ddee1] transition-all shadow-md"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
