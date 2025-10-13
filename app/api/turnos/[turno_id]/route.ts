import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ turno_id: string }>;
};

/**
 * [PATCH] Actualiza el estado de un turno
 * URL: /api/turnos/[turno_id]
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { turno_id } = await context.params;
  const turnoId = parseInt(turno_id, 10);

  if (isNaN(turnoId)) {
    return NextResponse.json({ error: 'ID de turno inválido' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { estado } = body;

    if (!estado) {
      return NextResponse.json({ error: 'El campo estado es requerido' }, { status: 400 });
    }

    // Validar que el estado sea válido
    const estadosValidos = ['disponible', 'reservado', 'confirmado', 'confirmado', 'en_consulta', 'atendido', 'cancelado', 'ausente'];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json(
        { error: `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}` },
        { status: 400 }
      );
    }

    // Verificar que el turno existe
    const turnoExistente = await prisma.turnos.findUnique({
      where: { turno_id: turnoId },
    });

    if (!turnoExistente) {
      return NextResponse.json({ error: 'Turno no encontrado' }, { status: 404 });
    }

    // Actualizar el estado del turno
    const turnoActualizado = await prisma.turnos.update({
      where: { turno_id: turnoId },
      data: { estado },
      include: {
        pacientes: true,
        profesionales: {
          include: {
            usuarios: true,
            profesiones: true,
          },
        },
      },
    });

    return NextResponse.json(turnoActualizado);
  } catch (error) {
    console.error('Error actualizando turno:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el turno' },
      { status: 500 }
    );
  }
}

/**
 * [GET] Obtiene un turno específico por ID
 * URL: /api/turnos/[turno_id]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { turno_id } = await context.params;
  const turnoId = parseInt(turno_id, 10);

  if (isNaN(turnoId)) {
    return NextResponse.json({ error: 'ID de turno inválido' }, { status: 400 });
  }

  try {
    const turno = await prisma.turnos.findUnique({
      where: { turno_id: turnoId },
      include: {
        pacientes: true,
        profesionales: {
          include: {
            usuarios: true,
            profesiones: true,
          },
        },
      },
    });

    if (!turno) {
      return NextResponse.json({ error: 'Turno no encontrado' }, { status: 404 });
    }

    return NextResponse.json(turno);
  } catch (error) {
    console.error('Error obteniendo turno:', error);
    return NextResponse.json(
      { error: 'Error al obtener el turno' },
      { status: 500 }
    );
  }
}
