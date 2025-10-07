import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
    params: Promise<{ paciente_id: string; consulta_id: string }>;
};

interface ActualizarConsultaBody {
    notas_evolucion?: string | null;
    // Otros campos que el profesional puede editar en consultas posteriores
}

/**
 * [GET] Obtiene una consulta específica
 * Todos los profesionales pueden ver
 */
export async function GET(request: NextRequest, context: RouteContext) {
    const { paciente_id, consulta_id } = await context.params;
    const pacienteId = parseInt(paciente_id, 10);
    const consultaId = parseInt(consulta_id, 10);

    if (isNaN(pacienteId) || isNaN(consultaId)) {
        return NextResponse.json(
            { error: 'IDs inválidos' },
            { status: 400 }
        );
    }

    try {
        const consulta = await prisma.consulta.findFirst({
            where: {
                consulta_id: consultaId,
                historia: {
                    paciente_id: pacienteId
                }
            },
            include: {
                diagnosticos: true,
                profesional: {
                    include: {
                        usuarios: {
                            select: {
                                nombre: true,
                                apellido: true
                            }
                        }
                    }
                }
            }
        });

        if (!consulta) {
            return NextResponse.json(
                { error: 'Consulta no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(consulta);

    } catch (error) {
        console.error('Error al obtener consulta:', error);
        return NextResponse.json(
            { error: 'Error al obtener la consulta' },
            { status: 500 }
        );
    }
}

/**
 * [PUT] Actualiza las notas de evolución de una consulta
 * SOLO puede ser modificado por el profesional que creó la consulta
 */
export async function PUT(request: NextRequest, context: RouteContext) {
    const { paciente_id, consulta_id } = await context.params;
    const pacienteId = parseInt(paciente_id, 10);
    const consultaId = parseInt(consulta_id, 10);

    if (isNaN(pacienteId) || isNaN(consultaId)) {
        return NextResponse.json(
            { error: 'IDs inválidos' },
            { status: 400 }
        );
    }

    try {
        const body: ActualizarConsultaBody = await request.json();

        // TODO: Obtener profesional_id del usuario autenticado
        // Por ahora usamos un ID hardcodeado (TEMPORAL)
        const profesionalActual = 8; // CAMBIAR cuando tengas autenticación

        // Buscar la consulta y verificar permisos
        const consulta = await prisma.consulta.findFirst({
            where: {
                consulta_id: consultaId,
                historia: {
                    paciente_id: pacienteId
                }
            },
            select: {
                consulta_id: true,
                profesional_id: true
            }
        });

        if (!consulta) {
            return NextResponse.json(
                { error: 'Consulta no encontrada' },
                { status: 404 }
            );
        }

        // VALIDACIÓN: Solo el profesional que creó la consulta puede editarla
        if (consulta.profesional_id !== profesionalActual) {
            return NextResponse.json(
                { 
                    error: 'Solo el profesional que realizó la consulta puede modificar sus notas de evolución.',
                    profesional_creador: consulta.profesional_id,
                    profesional_actual: profesionalActual
                },
                { status: 403 }
            );
        }

        // Actualizar solo las notas de evolución
        const consultaActualizada = await prisma.consulta.update({
            where: { consulta_id: consultaId },
            data: {
                notas_evolucion: body.notas_evolucion
            },
            include: {
                diagnosticos: true,
                profesional: {
                    include: {
                        usuarios: {
                            select: {
                                nombre: true,
                                apellido: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            message: 'Notas de evolución actualizadas correctamente',
            data: consultaActualizada
        });

    } catch (error) {
        console.error('Error al actualizar consulta:', error);
        return NextResponse.json(
            { error: 'Error al actualizar la consulta' },
            { status: 500 }
        );
    }
}

/**
 * [DELETE] Elimina una consulta
 * SOLO puede ser eliminado por el profesional que la creó
 * (Opcional - implementar solo si lo necesitas)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
    const { paciente_id, consulta_id } = await context.params;
    const pacienteId = parseInt(paciente_id, 10);
    const consultaId = parseInt(consulta_id, 10);

    if (isNaN(pacienteId) || isNaN(consultaId)) {
        return NextResponse.json(
            { error: 'IDs inválidos' },
            { status: 400 }
        );
    }

    try {
        // TODO: Obtener profesional_id del usuario autenticado
        const profesionalActual = 8;

        const consulta = await prisma.consulta.findFirst({
            where: {
                consulta_id: consultaId,
                historia: {
                    paciente_id: pacienteId
                }
            },
            select: {
                consulta_id: true,
                profesional_id: true
            }
        });

        if (!consulta) {
            return NextResponse.json(
                { error: 'Consulta no encontrada' },
                { status: 404 }
            );
        }

        if (consulta.profesional_id !== profesionalActual) {
            return NextResponse.json(
                { error: 'Solo el profesional que realizó la consulta puede eliminarla' },
                { status: 403 }
            );
        }

        // Eliminar consulta (los diagnósticos se eliminan en cascada)
        await prisma.consulta.delete({
            where: { consulta_id: consultaId }
        });

        return NextResponse.json({
            message: 'Consulta eliminada correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar consulta:', error);
        return NextResponse.json(
            { error: 'Error al eliminar la consulta' },
            { status: 500 }
        );
    }
}