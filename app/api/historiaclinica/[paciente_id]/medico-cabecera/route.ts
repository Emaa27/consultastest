import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
    params: Promise<{ paciente_id: string }>;
};

interface CambiarMedicoBody {
    nuevo_medico_id: number;
    // TODO: agregar profesional_actual_id cuando implementes autenticación
}

/**
 * [PUT] Cambia el médico de cabecera de un paciente
 * Solo accesible por: Admin, Recepción, o el médico de cabecera actual
 */
export async function PUT(request: NextRequest, context: RouteContext) {
    const { paciente_id } = await context.params;
    const pacienteId = parseInt(paciente_id, 10);

    if (isNaN(pacienteId)) {
        return NextResponse.json(
            { error: 'ID de paciente inválido' },
            { status: 400 }
        );
    }

    try {
        const body: CambiarMedicoBody = await request.json();
        const { nuevo_medico_id } = body;

        if (!nuevo_medico_id) {
            return NextResponse.json(
                { error: 'ID del nuevo médico es requerido' },
                { status: 400 }
            );
        }

        // Verificar que la HC existe
        const historiaClinica = await prisma.historiaClinica.findUnique({
            where: { paciente_id: pacienteId },
            select: { 
                historia_id: true,
                medico_cabecera_id: true
            }
        });

        if (!historiaClinica) {
            return NextResponse.json(
                { error: 'Historia Clínica no encontrada' },
                { status: 404 }
            );
        }

        // Verificar que el nuevo médico es clínico y está activo
        const nuevoMedico = await prisma.profesionales.findFirst({
            where: {
                profesional_id: nuevo_medico_id,
                estado: 'activo',
                profesiones: {
                    nombre: 'Clínico'
                }
            },
            include: {
                usuarios: {
                    select: {
                        nombre: true,
                        apellido: true
                    }
                }
            }
        });

        if (!nuevoMedico) {
            return NextResponse.json(
                { error: 'El médico seleccionado no es válido o no es clínico' },
                { status: 400 }
            );
        }

        // TODO: Validar permisos cuando implementes autenticación
        // - Verificar que el usuario actual es admin, recepción o el médico actual

        // Actualizar médico de cabecera
        const historiaActualizada = await prisma.historiaClinica.update({
            where: { historia_id: historiaClinica.historia_id },
            data: {
                medico_cabecera_id: nuevo_medico_id
            },
            include: {
                medico_cabecera: {
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
            message: 'Médico de cabecera actualizado correctamente',
            medico_anterior_id: historiaClinica.medico_cabecera_id,
            medico_nuevo: nuevoMedico.usuarios,
            data: historiaActualizada
        });

    } catch (error) {
        console.error('Error al cambiar médico de cabecera:', error);
        return NextResponse.json(
            { error: 'Error al cambiar el médico de cabecera' },
            { status: 500 }
        );
    }
}