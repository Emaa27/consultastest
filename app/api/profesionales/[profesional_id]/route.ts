import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
    params: Promise<{ profesional_id: string }>;
};

/**
 * GET - Obtiene información detallada de un profesional
 */
export async function GET(request: NextRequest, context: RouteContext) {
    const { profesional_id } = await context.params;
    const profesionalId = parseInt(profesional_id, 10);

    if (isNaN(profesionalId)) {
        return NextResponse.json(
            { error: 'ID de profesional inválido' },
            { status: 400 }
        );
    }

    try {
        const profesional = await prisma.profesionales.findUnique({
            where: { profesional_id: profesionalId },
            include: {
                usuarios: {
                    select: {
                        nombre: true,
                        apellido: true,
                        email: true,
                        telefono: true
                    }
                },
                profesiones: {
                    select: {
                        nombre: true
                    }
                }
            }
        });

        if (!profesional) {
            return NextResponse.json(
                { error: 'Profesional no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            profesional_id: profesional.profesional_id,
            matricula: profesional.matricula,
            estado: profesional.estado,
            profesion: profesional.profesiones.nombre,
            usuario: profesional.usuarios
        });

    } catch (error) {
        console.error('Error al obtener profesional:', error);
        return NextResponse.json(
            { error: 'Error al obtener información del profesional' },
            { status: 500 }
        );
    }
}