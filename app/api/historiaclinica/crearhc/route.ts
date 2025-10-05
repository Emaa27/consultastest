import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface HistoriaClinicaBase {
    paciente_id: number;
}

export async function POST(req: Request) { 
    try {
        const body: HistoriaClinicaBase = await req.json();
        const { paciente_id } = body;

        if (typeof paciente_id !== 'number' || isNaN(paciente_id)) {
            return NextResponse.json(
                { error: 'ID de paciente inválido o faltante.' }, 
                { status: 400 }
            );
        }

        const existeHC = await prisma.historiaClinica.findUnique({
            where: { paciente_id: paciente_id },
            select: { 
                historia_id: true,
                medico_cabecera_id: true
            }
        });

        if (existeHC) {
            return NextResponse.json(
                { 
                    message: 'La Historia Clínica ya existe.',
                    historia_id: existeHC.historia_id,
                    medico_cabecera_id: existeHC.medico_cabecera_id
                }, 
                { status: 200 } 
            );
        }
        
        const clinicoDisponible = await prisma.profesionales.findFirst({
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
                        apellido: true
                    }
                },
                _count: {
                    select: {
                        historias_como_cabecera: true
                    }
                }
            },
            orderBy: {
                historias_como_cabecera: {
                    _count: 'asc'
                }
            }
        });

        if (!clinicoDisponible) {
            return NextResponse.json(
                { error: 'No hay médicos clínicos disponibles en el sistema.' },
                { status: 400 }
            );
        }

        const nuevaHC = await prisma.historiaClinica.create({ 
            data: {
                paciente_id: paciente_id,
                medico_cabecera_id: clinicoDisponible.profesional_id
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
            message: 'Historia Clínica creada correctamente.',
            data: nuevaHC,
            medico_asignado: clinicoDisponible.usuarios
        }, { status: 201 });

    } catch (error) {
        console.error('Error al crear HC:', error);
        return NextResponse.json(
            { error: 'Error al crear la Historia Clínica.' }, 
            { status: 500 }
        );
    }
}