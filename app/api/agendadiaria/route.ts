import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { error } from "console";

export async function GET(req: Request) {
  try {
    // Obtener parámetros de la URL
    const { searchParams } = new URL(req.url);
    const profesionalId = searchParams.get("profesional_id");
    const fecha = searchParams.get("fecha"); // YYYY-MM-DD

    // Validar profesional_id
    if (!profesionalId) {
      return NextResponse.json(
        { error: "Debe especificar un profesional_id" },
        { status: 400 }
      );
    }

    // Filtro base (por profesional)
    const where: any = { profesional_id: Number(profesionalId) };

    // Si se pasa fecha, se construye el rango de ese día [00:00 → 23:59]
    if (fecha) {
      const inicio = new Date(`${fecha}T00:00:00`);
      const fin = new Date(`${fecha}T23:59:59.999`);
      where.inicio = { gte: inicio, lte: fin };
    } else {
      return NextResponse.json(
        { error: "Debe especificar una fecha" },
        { status: 400 }
      )
    }

    // Consulta a la base de datos con Prisma
    const turnos = await prisma.turnos.findMany({
      where,
      include: {
        pacientes: { include: { obras_sociales: true } }, // datos del paciente (con obra social)
        profesionales: { include: { usuarios: true, profesiones: true } }, // datos del profesional y su usuario
      },
      orderBy: { inicio: "asc" }, // ordenar cronológicamente
    });

    const dia_semana = new Date(`${fecha}T00:00:00`).getDay(); // (Domingo-Sábado : 0-6)
    const agenda = await prisma.agenda_semanal.findMany({
      where: {
        profesional_id: Number(profesionalId),
        dia_semana: dia_semana,
      },
    });

    // Respuesta exitosa
    return NextResponse.json({"turnos": turnos, "agenda": agenda});
  } catch (error) {
    console.error("Error obteniendo turnos:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}
