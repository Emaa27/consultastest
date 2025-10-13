// app/api/gerencia/obras-sociales/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mes = searchParams.get("mes"); // YYYY-MM (opcional, por defecto mes actual)

    // Determinar el rango del mes
    const targetDate = mes ? new Date(`${mes}-01`) : new Date();
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Obtener turnos del mes agrupados por obra social (todos los estados)
    const turnosConObraSocial = await prisma.turnos.findMany({
      where: {
        inicio: {
          gte: startOfMonth,
          lte: endOfMonth,
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

    // Colores predefinidos para obras sociales comunes
    const coloresObrasSociales: Record<string, string> = {
      Particular: "#FCD34D",
      OSDE: "#3B82F6",
      PAMI: "#16a34a",
      Galeno: "#EF4444",
      "Swiss Medical": "#C084FC",
    };

    // Convertir a formato de array y ordenar por cantidad (descendente)
    const data = Object.entries(agrupados)
      .map(([name, value]) => ({
        name,
        value,
        color: coloresObrasSociales[name] || "#6B7280",
      }))
      .sort((a, b) => b.value - a.value);

    // Si hay muchas obras sociales, agrupar las menores en "Otras"
    const umbral = 5; // Mostrar las top 5 y agrupar el resto
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
      periodo: {
        mes: `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}`,
      },
      total: turnosConObraSocial.length,
    });
  } catch (error) {
    console.error("Error obteniendo distribución por obra social:", error);
    return NextResponse.json(
      { error: "Error al obtener distribución por obra social" },
      { status: 500 }
    );
  }
}
