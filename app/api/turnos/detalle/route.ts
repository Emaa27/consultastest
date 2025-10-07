// app/api/turnos/detalle/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Parámetro id requerido" }, { status: 400 });
    }

    const turno = await prisma.turnos.findUnique({
      where: { turno_id: id },
      include: {
        pacientes: { include: { obras_sociales: true } }, // <- ajusta nombre si difiere
        profesionales: { include: { usuarios: true, profesiones: true } },
      },
    });

    if (!turno) return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });

    const inicio = new Date(turno.inicio);
    const fin = turno.fin ?? new Date(inicio.getTime() + (turno.duracion_min ?? 0) * 60_000);

    return NextResponse.json({ ...turno, fin }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("GET /api/turnos/detalle error:", e);
    return NextResponse.json({ error: "No se pudo obtener el detalle" }, { status: 500 });
  }
}
