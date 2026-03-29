// app/api/gerencia/actividad-reciente/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limite = parseInt(searchParams.get("limite") || "10");

    // Obtener turnos recientes del día con cambios de estado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const finHoy = new Date();
    finHoy.setHours(23, 59, 59, 999);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const turnosRecientes: any[] = await prisma.turnos.findMany({
      where: {
        inicio: {
          gte: hoy,
          lte: finHoy,
        },
      },
      include: {
        pacientes: true,
        profesionales: {
          include: {
            usuarios: true,
          },
        },
      },
      orderBy: {
        inicio: "desc",
      },
      take: limite,
    });

    // Obtener pacientes nuevos del día
    const pacientesNuevos = await prisma.pacientes.findMany({
      where: {
        fecha_registro: {
          gte: hoy,
          lte: finHoy,
        },
      },
      orderBy: {
        fecha_registro: "desc",
      },
      take: 5,
    });

    // Formatear actividades
    const actividades: Array<{
      time: string;
      description: string;
      tipo: string;
    }> = [];

    // Agregar turnos
    turnosRecientes.forEach((turno: typeof turnosRecientes[number]) => {
      const hora = new Date(turno.inicio).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const paciente = `${turno.pacientes.nombre} ${turno.pacientes.apellido}`;
      const profesional = `${turno.profesionales.usuarios.nombre} ${turno.profesionales.usuarios.apellido}`;
      const horaInicio = new Date(turno.inicio).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      let descripcion = "";
      let tipo = "";

      switch (turno.estado) {
        case "atendido":
          descripcion = `Paciente **${paciente}** marcado como **Atendido**.`;
          tipo = "atendido";
          break;
        case "cancelado":
          descripcion = `El turno de **${paciente}** **fue cancelado**.`;
          tipo = "cancelado";
          break;
        case "reservado":
        case "confirmado":
          descripcion = `Se **agendó** turno para **${paciente}** con ${profesional} (${horaInicio}).`;
          tipo = "agendado";
          break;
        case "ausente":
          descripcion = `Paciente **${paciente}** marcado como **Ausente**.`;
          tipo = "ausente";
          break;
        default:
          descripcion = `Turno de **${paciente}** - Estado: ${turno.estado}.`;
          tipo = "otro";
      }

      actividades.push({
        time: hora,
        description: descripcion,
        tipo,
      });
    });

    // Agregar pacientes nuevos
    pacientesNuevos.forEach((paciente: typeof pacientesNuevos[number]) => {
      const hora = paciente.fecha_registro
        ? new Date(paciente.fecha_registro).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";
      const nombre = `${paciente.nombre} ${paciente.apellido}`;

      actividades.push({
        time: hora,
        description: `Se **registró** al nuevo paciente **${nombre}**.`,
        tipo: "nuevo_paciente",
      });
    });

    // Ordenar por hora (más reciente primero)
    actividades.sort((a, b) => {
      const [horaA, minA] = a.time.split(":").map(Number);
      const [horaB, minB] = b.time.split(":").map(Number);
      return horaB * 60 + minB - (horaA * 60 + minA);
    });

    return NextResponse.json({
      actividades: actividades.slice(0, limite),
      total: actividades.length,
    });
  } catch (error) {
    console.error("Error obteniendo actividad reciente:", error);
    return NextResponse.json(
      { error: "Error al obtener actividad reciente" },
      { status: 500 }
    );
  }
}
