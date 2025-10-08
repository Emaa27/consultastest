// app/api/gerencia/kpis/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get("fecha"); // YYYY-MM-DD (opcional, por defecto hoy)
    const fechaInicio = searchParams.get("fechaInicio"); // YYYY-MM-DD (opcional)
    const fechaFin = searchParams.get("fechaFin"); // YYYY-MM-DD (opcional)

    // Determinar el rango de fechas
    let startOfDay: Date;
    let endOfDay: Date;

    if (fechaInicio && fechaFin) {
      // Si se especifica rango personalizado
      startOfDay = new Date(fechaInicio);
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date(fechaFin);
      endOfDay.setHours(23, 59, 59, 999);
    } else if (fecha) {
      // Si se especifica una fecha específica
      const targetDate = new Date(fecha);
      startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
    } else {
      // Por defecto: hoy
      const targetDate = new Date();
      startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
    }

    // Inicio del mes actual para contar nuevos pacientes
    const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // 1. Citas agendadas hoy (todos los estados excepto cancelado)
    const citasAgendadas = await prisma.turnos.count({
      where: {
        inicio: {
          gte: startOfDay,
          lte: endOfDay,
        },
        estado: {
          not: "cancelado",
        },
      },
    });

    // 2. Citas atendidas hoy
    const citasAtendidas = await prisma.turnos.count({
      where: {
        inicio: {
          gte: startOfDay,
          lte: endOfDay,
        },
        estado: "atendido",
      },
    });

    // 3. Nuevos pacientes este mes
    const nuevosPacientes = await prisma.pacientes.count({
      where: {
        fecha_registro: {
          gte: startOfMonth,
        },
        estado: "activo",
      },
    });

    // 4. Cancelaciones hoy
    const cancelaciones = await prisma.turnos.count({
      where: {
        inicio: {
          gte: startOfDay,
          lte: endOfDay,
        },
        estado: "cancelado",
      },
    });

    return NextResponse.json({
      citasAgendadas,
      citasAtendidas,
      nuevosPacientes,
      cancelaciones,
      fechaInicio: startOfDay.toISOString().split("T")[0],
      fechaFin: endOfDay.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error obteniendo KPIs:", error);
    return NextResponse.json(
      { error: "Error al obtener KPIs" },
      { status: 500 }
    );
  }
}
