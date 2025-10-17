// app/api/gerencia/obras-sociales/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mes = searchParams.get("mes");

    // Si viene con parámetro "mes", devuelve análisis
    if (mes) {
      // Tu código existente de análisis...
      const targetDate = new Date(`${mes}-01`);
      const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

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

      const agrupados: Record<string, number> = {};
      turnosConObraSocial.forEach((turno) => {
        const obraSocial = turno.pacientes.obras_sociales?.nombre || "Particular";
        agrupados[obraSocial] = (agrupados[obraSocial] || 0) + 1;
      });

      const coloresObrasSociales: Record<string, string> = {
        Particular: "#FCD34D",
        OSDE: "#3B82F6",
        PAMI: "#16a34a",
        Galeno: "#EF4444",
        "Swiss Medical": "#C084FC",
      };

      const data = Object.entries(agrupados)
        .map(([name, value]) => ({
          name,
          value,
          color: coloresObrasSociales[name] || "#6B7280",
        }))
        .sort((a, b) => b.value - a.value);

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
        periodo: {
          mes: `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}`,
        },
        total: turnosConObraSocial.length,
      });
    }

    // Si NO viene con "mes", devuelve lista simple de obras sociales activas
    const obras = await prisma.obras_sociales.findMany({
      where: { estado: "activa" },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(obras);
  } catch (error) {
    console.error("Error en obras sociales:", error);
    return NextResponse.json(
      { error: "Error al obtener obras sociales" },
      { status: 500 }
    );
  }
}