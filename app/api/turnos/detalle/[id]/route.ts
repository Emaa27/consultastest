// app/api/turnos/detalle/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Parámetro id inválido" }, { status: 400 });
    }

    const turno = await prisma.turnos.findUnique({
      where: { turno_id: id },
      include: {
        pacientes: { include: { obras_sociales: true } },
        profesionales: { include: { usuarios: true, profesiones: true } },
      },
    });

    if (!turno) {
      return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
    }

    const inicio = new Date(turno.inicio);
    const fin = turno.fin ?? new Date(inicio.getTime() + (turno.duracion_min ?? 0) * 60_000);

    return NextResponse.json({ ...turno, fin }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("GET /api/turnos/detalle/[id] error:", e);
    return NextResponse.json({ error: "No se pudo obtener el detalle" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Parámetro id inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { estado } = body;

    // Validar que el estado sea uno de los permitidos
    if (!estado || !["recepcionado", "ausente", "cancelado"].includes(estado)) {
      return NextResponse.json(
        { error: "Estado inválido. Solo se permite 'recepcionado', 'ausente' o 'cancelado'" },
        { status: 400 }
      );
    }

    // Actualizar el turno
    const turno = await prisma.turnos.update({
      where: { turno_id: id },
      data: { estado },
      include: {
        pacientes: { include: { obras_sociales: true } },
        profesionales: { include: { usuarios: true, profesiones: true } },
      },
    });

    const inicio = new Date(turno.inicio);
    const fin = turno.fin ?? new Date(inicio.getTime() + (turno.duracion_min ?? 0) * 60_000);

    return NextResponse.json({ ...turno, fin }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    console.error("PATCH /api/turnos/detalle/[id] error:", e);
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "No se pudo actualizar el turno" }, { status: 500 });
  }
}
