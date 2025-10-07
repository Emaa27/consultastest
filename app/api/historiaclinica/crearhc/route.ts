import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { paciente_id } = body;

        // 🧩 Validación del ID del paciente
        if (typeof paciente_id !== 'number' || isNaN(paciente_id)) {
            return NextResponse.json(
                { error: 'ID de paciente inválido o faltante.' },
                { status: 400 }
            );
        }

        // 🩺 Verificar si ya existe historia clínica para ese paciente
        const existeHC = await prisma.historias_clinicas.findUnique({
            where: { paciente_id },
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

        // 👨‍⚕️ Buscar un profesional activo con la profesión "Clínico"
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
                        historias_clinicas: true // ✅ campo real en tu modelo
                    }
                }
            },
            orderBy: {
                historias_clinicas: {
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

        // 🆕 Crear la nueva historia clínica
        const nuevaHC = await prisma.historias_clinicas.create({
            data: {
                paciente_id,
                medico_cabecera_id: clinicoDisponible.profesional_id
            },
            include: {
                profesionales: { // ✅ relación correcta según tu schema
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

        return NextResponse.json(
            {
                message: 'Historia Clínica creada correctamente.',
                data: nuevaHC,
                medico_asignado: clinicoDisponible.usuarios
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error al crear HC:', error);
        return NextResponse.json(
            { error: 'Error al crear la Historia Clínica.' },
            { status: 500 }
        );
    }
}
