// app/api/gerencia/obras-sociales-stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fechaInicio = searchParams.get("fechaInicio");
    const fechaFin = searchParams.get("fechaFin");

    let startDate: Date;
    let endDate: Date;

    if (fechaInicio && fechaFin) {
      // Usar las fechas proporcionadas
      startDate = new Date(fechaInicio);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(fechaFin);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Por defecto, usar el mes actual
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    // Obtener turnos con pacientes y sus obras sociales
    const turnosConObraSocial = await prisma.turnos.findMany({
      where: {
        inicio: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        pacientes: {
          include: {
            obras_sociales: true,
          },
        },
      },
    });

    // Agrupar por obra social
    const agrupados: Record<string, number> = {};
    turnosConObraSocial.forEach((turno) => {
      const obraSocial = turno.pacientes.obras_sociales?.nombre || "Particular";
      agrupados[obraSocial] = (agrupados[obraSocial] || 0) + 1;
    });

    // Colores para las obras sociales
    const coloresObrasSociales: Record<string, string> = {
      Particular: "#FCD34D",
      OSDE: "#3B82F6",
      PAMI: "#16a34a",
      Galeno: "#EF4444",
      "Swiss Medical": "#C084FC",
    };

    // Convertir a array y ordenar por cantidad
    const data = Object.entries(agrupados)
      .map(([name, value]) => ({
        name,
        value,
        color: coloresObrasSociales[name] || "#6B7280",
      }))
      .sort((a, b) => b.value - a.value);

    // Limitar a las 5 principales + "Otras"
    const umbral = 5;
    let dataFinal = data;
    if (data.length > umbral) {
      const principales = data.slice(0, umbral);
      const otras = data.slice(umbral);
      const totalOtras = otras.reduce((sum, item) => sum + item.value, 0);
      
      if (totalOtras > 0) {
        dataFinal = [
          ...principales,
          { name: "Otras", value: totalOtras, color: "#6B7280" },
        ];
      } else {
        dataFinal = principales;
      }
    }

    return NextResponse.json({
      data: dataFinal,
      total: turnosConObraSocial.length,
      periodo: {
        inicio: startDate.toISOString().split('T')[0],
        fin: endDate.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error("Error en obras sociales stats:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas de obras sociales" },
      { status: 500 }
    );
  }
}
