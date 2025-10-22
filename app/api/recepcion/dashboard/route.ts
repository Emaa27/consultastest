// app/api/recepcion/dashboard/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Asegúrate que la ruta a tu cliente Prisma sea correcta
import { turnos_estado } from "@prisma/client";

// --- Funciones de Ayuda ---

// Convierte milisegundos a "MM:SS"
function formatMSS(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Formatea la hora como "HH:MM"
function formatTime(date: Date): string {
  // Asegúrate de usar la zona horaria correcta para tu ubicación
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires'
  });
}

// Formatea el estado "en_consulta" a "En Consulta"
function formatEstado(estado: string): string {
  if (!estado) return ''; // Maneja casos donde el estado podría ser nulo o indefinido
  return estado
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Mapeo de colores para los estados de turno
const ESTADO_COLORS: { [key in turnos_estado]: string } = {
  reservado: "#0088FE",
  confirmado: "#FFBB28",
  en_consulta: "#E11D48", // Rojo para destacar
  atendido: "#00C49F",    // Verde
  ausente: "#FF8042",     // Naranja
  cancelado: "#9CA3AF",   // Gris
};
// --- FIN Funciones de Ayuda ---

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get("fecha") || new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD

    // Define el inicio y fin del día considerando la zona horaria local (-03:00 para Argentina)
    const startOfDay = new Date(`${fecha}T00:00:00-03:00`);
    const endOfDay = new Date(`${fecha}T23:59:59.999-03:00`); // Incluir milisegundos

    // --- Consulta Única de Turnos ---
    // Seleccionamos todos los campos necesarios para evitar múltiples consultas
    const turnosDelDia = await prisma.turnos.findMany({
      where: {
        inicio: { gte: startOfDay, lte: endOfDay },
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

    // --- Consulta Pacientes Nuevos ---
    const pacientesNuevosHoy = await prisma.pacientes.count({
      where: {
        // Asegúrate que tu modelo 'pacientes' tenga 'fecha_registro'
        fecha_registro: { gte: startOfDay, lte: endOfDay }
      }
    });

    // --- Inicialización de Métricas ---
    let ausencias = 0;
    let totalWaitTimeMs = 0;
    let turnosConEspera = 0;
    let pacientesEnEspera = 0;
    let turnosPendientes = 0;
    const actividades: any[] = [];
    const horas = Array.from({ length: 13 }, (_, i) => i + 8); // Rango de horas (8 AM a 8 PM)
    const flujoPorHora = horas.map(hora => ({ name: `${String(hora).padStart(2, '0')}:00`, Agendados: 0, Atendidos: 0 }));
    const estadoCounts: { [key in turnos_estado]?: number } = {};
    const cargaProfesionalCounts: { [key: number]: { count: number; name: string } } = {};

    // --- Procesamiento de Datos ---
    for (const turno of turnosDelDia) {
      // Conteo para gráfico de torta (Estados)
      estadoCounts[turno.estado] = (estadoCounts[turno.estado] || 0) + 1;

      // Cálculo Carga Profesional (contar turnos no cancelados)
      if (turno.estado !== 'cancelado') {
        const profId = turno.profesional_id;
        // Solo guardamos el nombre la primera vez que vemos al profesional
        if (!cargaProfesionalCounts[profId]) {
          const nombreCompleto = `${turno.profesionales.usuarios.nombre} ${turno.profesionales.usuarios.apellido}`;
          cargaProfesionalCounts[profId] = { count: 0, name: nombreCompleto };
        }
        cargaProfesionalCounts[profId].count++; // Incrementamos el contador de turnos
      }

      // Cálculo Flujo por Hora (contar turnos no cancelados)
      if (turno.estado !== 'cancelado') {
        // Obtenemos la hora local del turno
        const horaTurno = new Date(turno.inicio).getHours();
        const slot = flujoPorHora.find(h => h.name === `${String(horaTurno).padStart(2, '0')}:00`);
        if (slot) {
          slot.Agendados += 1; // Sumamos a Agendados
          if (turno.estado === 'atendido') {
            slot.Atendidos += 1; // Sumamos a Atendidos si corresponde
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
        // Solo contamos esperas positivas
        if (esperaMs > 0) {
          totalWaitTimeMs += esperaMs;
          turnosConEspera++;
        }
      }

      // Log de Actividad Reciente (solo si fue confirmado)
      if (turno.fecha_confirmacion) {
        const paciente = `${turno.pacientes.nombre} ${turno.pacientes.apellido}`;
        const profesional = `${turno.profesionales.usuarios.nombre} ${turno.profesionales.usuarios.apellido}`;
        actividades.push({
          timestamp: turno.fecha_confirmacion.getTime(),
          time: formatTime(turno.fecha_confirmacion),
          description: `**${paciente}** ha sido **confirmado** para su turno con **${profesional}**.`,
        });
      }
    }

    // --- Ensamblaje de Respuesta ---
    const kpis = {
      turnosPendientes,
      pacientesEnEspera,
      promedioEspera: formatMSS(turnosConEspera > 0 ? (totalWaitTimeMs / turnosConEspera) : 0),
      pacientesNuevosHoy,
      // Guardamos estos por si los necesitas en el futuro, pero no se muestran en los KPIs principales
      _ausencias: ausencias,
      _turnosTotales: turnosDelDia.length,
      _turnosAtendidos: estadoCounts['atendido'] || 0,
    };

    // Datos para el gráfico de torta de estados
    const pieEstadoTurnos = Object.entries(estadoCounts).map(([name, value]) => ({
      name: formatEstado(name),
      value: value || 0,
      color: ESTADO_COLORS[name as turnos_estado] || '#CCCCCC', // Asigna color o gris por defecto
    }));

    // Datos para el gráfico de barras de carga profesional
    const cargaProfesionalData = Object.values(cargaProfesionalCounts)
      .map(prof => ({ name: prof.name, Turnos: prof.count }))
      .sort((a, b) => b.Turnos - a.Turnos); // Ordena de mayor a menor carga

    // Datos para el log de actividad (los 5 más recientes)
    const actividadReciente = actividades
      .sort((a, b) => b.timestamp - a.timestamp) // Ordena por timestamp descendente
      .slice(0, 5); // Toma solo los primeros 5

    // --- Respuesta JSON Final ---
    // Enviamos todos los datos necesarios para el dashboard
    return NextResponse.json({
      kpis,
      flujoPorHora,         // Para el gráfico de líneas
      pieEstadoTurnos,      // Para el gráfico de torta
      actividadReciente,    // Para el log de actividad
      cargaProfesionalData  // Para el nuevo gráfico de barras
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