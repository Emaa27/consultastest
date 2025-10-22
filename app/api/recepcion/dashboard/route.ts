// app/api/recepcion/dashboard/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- Funciones de Ayuda ---

// Convierte milisegundos a "MM:SS"
function formatMSS(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// --- FIN Funciones de Ayuda ---

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");

    // Si no se especifican fechas, usar últimos 30 días
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    const desde = fechaDesde || hace30Dias.toLocaleDateString('sv-SE');
    const hasta = fechaHasta || hoy.toLocaleDateString('sv-SE');

    // Define el rango de fechas considerando la zona horaria local (-03:00 para Argentina)
    const startOfRange = new Date(`${desde}T00:00:00-03:00`);
    const endOfRange = new Date(`${hasta}T23:59:59.999-03:00`);

    // --- Consulta Única de Turnos ---
    // Seleccionamos todos los campos necesarios para evitar múltiples consultas
    const turnosDelRango = await prisma.turnos.findMany({
      where: {
        inicio: { gte: startOfRange, lte: endOfRange },
      },
      select: {
        estado: true,
        fecha_confirmacion: true,
        fecha_en_consulta: true,
        // fecha_atendido: true, // No lo usamos directamente en este dashboard
        inicio: true,
        profesional_id: true,
        pacientes: { select: { nombre: true, apellido: true } },
        profesionales: { include: { usuarios: { select: { nombre: true, apellido: true } } } },
      }
    });

    // --- Consulta Pacientes Nuevos en el rango ---
    const pacientesNuevosRango = await prisma.pacientes.count({
      where: {
        fecha_registro: { gte: startOfRange, lte: endOfRange }
      }
    });

    // --- Inicialización de Métricas ---
    let ausencias = 0;
    let totalWaitTimeMs = 0;
    let turnosConEspera = 0;
    let pacientesEnEspera = 0;
    let turnosPendientes = 0;
    const horas = Array.from({ length: 13 }, (_, i) => i + 8); // Rango de horas (8 AM a 8 PM)
    const flujoPorHora = horas.map(hora => ({ name: `${String(hora).padStart(2, '0')}:00`, Agendados: 0, Atendidos: 0 }));
    const cargaProfesionalCounts: { [key: number]: { count: number; name: string } } = {};

    // --- Procesamiento de Datos ---
    for (const turno of turnosDelRango) {
      // Cálculo Carga Profesional (contar turnos no cancelados)
      if (turno.estado !== 'cancelado') {
        const profId = turno.profesional_id;
        if (!cargaProfesionalCounts[profId]) {
          const nombreCompleto = `${turno.profesionales.usuarios.nombre} ${turno.profesionales.usuarios.apellido}`;
          cargaProfesionalCounts[profId] = { count: 0, name: nombreCompleto };
        }
        cargaProfesionalCounts[profId].count++;
      }

      // Cálculo Flujo por Hora (contar turnos no cancelados)
      if (turno.estado !== 'cancelado') {
        const horaTurno = new Date(turno.inicio).getHours();
        const slot = flujoPorHora.find(h => h.name === `${String(horaTurno).padStart(2, '0')}:00`);
        if (slot) {
          slot.Agendados += 1;
          if (turno.estado === 'atendido') {
            slot.Atendidos += 1;
          }
        }
      }

      // Conteo para KPIs
      if (turno.estado === 'ausente') ausencias++;
      if (turno.estado === 'confirmado') pacientesEnEspera++;
      if (turno.estado === 'reservado' || turno.estado === 'confirmado') turnosPendientes++;

      // Cálculo Tiempo de Espera
      if (turno.fecha_confirmacion && turno.fecha_en_consulta) {
        const esperaMs = turno.fecha_en_consulta.getTime() - turno.fecha_confirmacion.getTime();
        if (esperaMs > 0) {
          totalWaitTimeMs += esperaMs;
          turnosConEspera++;
        }
      }
    }

    // --- Ensamblaje de Respuesta ---
    const kpis = {
      turnosPendientes,
      pacientesEnEspera,
      promedioEspera: formatMSS(turnosConEspera > 0 ? (totalWaitTimeMs / turnosConEspera) : 0),
      pacientesNuevosHoy: pacientesNuevosRango,
    };

    // Datos para el gráfico de barras de carga profesional
    const cargaProfesionalData = Object.values(cargaProfesionalCounts)
      .map(prof => ({ name: prof.name, Turnos: prof.count }))
      .sort((a, b) => b.Turnos - a.Turnos);

    // --- Respuesta JSON Final ---
    return NextResponse.json({
      kpis,
      flujoPorHora,         // Para el gráfico de líneas
      cargaProfesionalData  // Para el gráfico de barras
    });

  } catch (error) {
    let errorMessage = "Error al obtener datos del dashboard";
    if (error instanceof Error) {
        errorMessage = error.message; // Captura el mensaje específico si es un Error
    }
    console.error("Error en API Dashboard Recepción:", error); // Loguea el error completo en el servidor
    return NextResponse.json(
      // Devuelve un mensaje de error genérico al cliente
      { error: "Ocurrió un error al procesar la solicitud." },
      { status: 500 } // Código de estado 500 para error interno
    );
  }
}