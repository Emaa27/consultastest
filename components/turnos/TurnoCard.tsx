// components/turnos/TurnoCard.tsx
"use client";

import React from "react";
import { Clock, User } from "@/components/turnos/icons";
import { Turno } from "@/types/turnos";
import { getColorByStatus } from "@/utils/turnos";
import TurnoDetalleModal from "./TurnoDetalle";

type Props = { 
  turno: Turno;
  onUpdate?: () => void;
};
const toDate = (d: string | Date | null) => (d ? new Date(d) : null);

export default function TurnoCard({ turno, onUpdate }: Props) {
  const inicio = toDate(turno.inicio)!;
  const fin = toDate(turno.fin) ?? new Date(inicio.getTime() + (turno.duracion_min ?? 0) * 60_000);
  const colorGradient = getColorByStatus(turno.estado);

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`p-2 rounded-lg bg-gradient-to-r ${colorGradient} text-white shadow-sm hover:shadow-md transform transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
        title="Ver detalle del turno"
      >
        <div className="flex items-center gap-1 mb-1">
          <Clock className="w-3 h-3" />
          <p className="text-xs font-semibold">
            {inicio.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" - "}
            {fin.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-white/20 capitalize">
            {turno.estado.replace("_", " ")}
          </span>
        </div>

        <p className="text-xs font-bold truncate">Dr. {turno.profesionales.usuarios.apellido}</p>

        <div className="flex items-center gap-1 mt-1">
          <User className="w-3 h-3" />
          <p className="text-xs truncate opacity-90">
            {turno.pacientes.apellido} {turno.pacientes.nombre}
          </p>
        </div>

        <p className="text-xs opacity-75 mt-1">{turno.profesionales.profesiones.nombre}</p>
      </div>

      {/* Modal */}
      <TurnoDetalleModal
        turnoId={Number(turno.turno_id)}
        open={open}
        onOpenChange={setOpen}
        onUpdate={onUpdate}
      />
    </>
  );
}
