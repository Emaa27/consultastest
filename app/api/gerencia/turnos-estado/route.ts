// app/api/gerencia/turnos-estado/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dias = parseInt(searchParams.get("dias") || "7"); // Por defecto últimos 7 días

    // Calcular rango de fechas
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dias);
    startDate.setHours(0, 0, 0, 0);

    // Obtener conteo de turnos por estado
    const turnos = await prisma.turnos.groupBy({
      by: ["estado"],
      where: {
        inicio: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        turno_id: true,
      },
    });

    // Mapear los estados a un formato más amigable para el gráfico
    const estadoMap: Record<string, { name: string; color: string }> = {
      atendido: { name: "Atendidos", color: "#16a34a" },
      reservado: { name: "Pendientes", color: "#86efac" },
      recepcionado: { name: "Pendientes", color: "#86efac" },
      en_consulta: { name: "Pendientes", color: "#86efac" },
      cancelado: { name: "Cancelados", color: "#EF4444" },
      ausente: { name: "Ausentes", color: "#FCD34D" },
    };

    // Agrupar estados similares y formatear para el gráfico
    const agrupados: Record<string, number> = {};
    turnos.forEach((turno) => {
      const mapped = estadoMap[turno.estado] || { name: turno.estado, color: "#6B7280" };
      agrupados[mapped.name] = (agrupados[mapped.name] || 0) + turno._count.turno_id;
    });

    // Convertir a formato de array para el gráfico
    const data = Object.entries(agrupados).map(([name, value]) => {
      const colorEntry = Object.values(estadoMap).find((e) => e.name === name);
      return {
        name,
        value,
        color: colorEntry?.color || "#6B7280",
      };
    });

    return NextResponse.json({
      data,
      periodo: {
        inicio: startDate.toISOString().split("T")[0],
        fin: endDate.toISOString().split("T")[0],
        dias,
      },
    });
  } catch (error) {
    console.error("Error obteniendo métricas de turnos:", error);
    return NextResponse.json(
      { error: "Error al obtener métricas de turnos" },
      { status: 500 }
    );
  }
}
