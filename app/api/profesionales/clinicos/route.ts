import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET - Obtiene todos los médicos clínicos activos
 * Ordenados por cantidad de pacientes asignados (ascendente)
 */
export async function GET() {
    try {
        const clinicos = await prisma.profesionales.findMany({
            where: {
                estado: 'activo',
                profesiones: {
                    nombre: 'Clínico'
                }
            },
            include: {
                usuarios: {
                    select: {
                        nombre: true,
                        apellido: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        historias_clinicas: true
                    }
                }
            },
            orderBy: {
                historias_clinicas: {
                    _count: 'asc'
                }
            }
        });

        return NextResponse.json(clinicos);

    } catch (error) {
        console.error('Error al obtener clínicos:', error);
        return NextResponse.json(
            { error: 'Error al obtener médicos clínicos' },
            { status: 500 }
        );
    }
}