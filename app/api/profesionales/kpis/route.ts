// app/api/profesionales/kpis/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profesionalId = searchParams.get("profesional_id");
    const fechaInicio = searchParams.get("fechaInicio");
    const fechaFin = searchParams.get("fechaFin");

    if (!profesionalId) {
      return NextResponse.json({ error: "Falta profesional_id" }, { status: 400 });
    }

    // 🔹 Determinar rango de fechas
    const startOfRange = fechaInicio
      ? new Date(fechaInicio + "T00:00:00")
      : new Date();
    const endOfRange = fechaFin
      ? new Date(fechaFin + "T23:59:59")
      : new Date();

    // 🔹 Cantidad de días del rango
    const diffDays =
      Math.max(
        1,
        Math.ceil(
          (endOfRange.getTime() - startOfRange.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

    // 🔹 Obtener todos los turnos del profesional en el rango
    const turnos = await prisma.turnos.findMany({
      where: {
        profesional_id: Number(profesionalId),
        inicio: { gte: startOfRange, lte: endOfRange },
      },
      include: {
        pacientes: {
          include:{ obras_sociales: true }
        },
      },
    });

    const totalTurnos = turnos.length;

    // Promedio diario
    const promedioDiario = totalTurnos / diffDays;

    // Pacientes únicos
    const pacientesUnicos: number[] = [];
    turnos.forEach(t => {
      const idPaciente = t.paciente_id;
      if (!pacientesUnicos.includes(idPaciente)) pacientesUnicos.push(idPaciente);
    })
    
    // Tiempo promedio de espera
    const tiemposEspera = turnos
      .filter(t => t.fecha_confirmacion && t.fecha_en_consulta)
      .map(
        t =>
          new Date(t.fecha_en_consulta!).getTime() -
          new Date(t.fecha_confirmacion!).getTime()
      );

    const promedioEsperaMs =
      tiemposEspera.length > 0
        ? tiemposEspera.reduce((a, b) => a + b, 0) / tiemposEspera.length
        : 0;

    // Tiempo promedio de consulta
    const tiemposConsulta = turnos
      .filter(t => t.fecha_en_consulta && t.fecha_atendido)
      .map(
        t =>
          new Date(t.fecha_atendido!).getTime() -
          new Date(t.fecha_en_consulta!).getTime()
      );

    const promedioConsultaMs =
      tiemposConsulta.length > 0
        ? tiemposConsulta.reduce((a, b) => a + b, 0) / tiemposConsulta.length
        : 0;

    // Agrupar por obra social
    const totalPorObraSocial: Record<string, number> = {};
    turnos.forEach(t => {
      const nombreOS = t.pacientes?.obras_sociales?.nombre || "";
      totalPorObraSocial[nombreOS] = (totalPorObraSocial[nombreOS] || 0) + 1;
    });

    const obrasSociales = Object.entries(totalPorObraSocial).map(
      ([name, value]) => ({ name, value })
    );

    // Mapear los estados a un formato más amigable para el gráfico
    const getEstadoColor = (estado: string) => {
      const colors: Record<string, string> = {
        reservado: "#0ea5e9",
        confirmado: "#6366f1",
        en_consulta: "#f59e0b",
        atendido: "#10b981",
        ausente: "#f87171",
        cancelado: "#6b7280",
      };
      return colors[estado];
    };

    // Mapear los estados a un formato más amigable para el gráfico
    const getEstadoLabel = (estado: string) => {
      const labels: Record<string, string> = {
        reservado: "Reservado",
        confirmado: "Confirmado",
        en_consulta: "En consulta",
        atendido: "Atendido",
        ausente: "Ausente",
        cancelado: "Cancelado",
      };
      return labels[estado];
    };

    // Agrupar por estado del turno
    const totalPorEstado: Record<string, number> = {};
    turnos.forEach(t => {
      const estado = t.estado || "";
      totalPorEstado[estado] = (totalPorEstado[estado] || 0) + 1;
    });

    const estados = Object.entries(totalPorEstado).map(
      ([name, value]) => ({ 
        name: getEstadoLabel(name), 
        value,
        color: getEstadoColor(name),
      })
    );

    // Agrupar por fecha del turno
    function generarRangoFechas(fechaInicio: Date, fechaFin: Date): Record<string, number> {
      const fechas: Record<string, number> = {};

      // Generar fechas día por día
      for (let d = fechaInicio; d <= fechaFin; d.setDate(d.getDate() + 1)) {
        fechas[d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })] = 0;
      }
      return fechas;
    }

    const totalPorFecha: Record<string, number> = generarRangoFechas(startOfRange, endOfRange);
    console.log(totalPorFecha);
    turnos.forEach(t => {
      const fecha = t.inicio.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
      totalPorFecha[fecha] = (totalPorFecha[fecha] || 0) + 1;
    });

    const fechas = Object.entries(totalPorFecha).map(
      ([name, value]) => ({ 
        name: name, 
        value 
      })
    );

    // Convertir milisegundos a formato HH:mm:ss
    const msToTime = (ms: number) => {
      const totalSec = Math.floor(ms / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return NextResponse.json({
      rango: {
        fechaInicio: startOfRange.toISOString().split("T")[0],
        fechaFin: endOfRange.toISOString().split("T")[0],
        dias: diffDays,
      },
      indicadores: {
        promedioDiarioTurnos: promedioDiario.toFixed(2),
        pacientesUnicos: pacientesUnicos.length,
        tiempoPromedioEspera: msToTime(promedioEsperaMs),
        tiempoPromedioConsulta: msToTime(promedioConsultaMs),
      },
      obrasSociales,
      estados,
      fechas,
    });
  } catch (error) {
    console.error("Error obteniendo KPIs:", error);
    return NextResponse.json(
      { error: "Error al obtener KPIs" },
      { status: 500 }
    );
  }
}