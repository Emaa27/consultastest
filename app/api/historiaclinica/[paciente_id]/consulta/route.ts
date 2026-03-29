import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
    params: Promise<{ paciente_id: string }>;
};

interface Medicamento {
    droga: string;
    via_administracion: string;
    dosis: string;
    frecuencia?: string;
}

interface NuevaConsultaBody {
    historia_id: number;
    profesional_id: number;
    motivo_consulta: string;
    enfermedad_actual?: string | null;
    pa_sistolica?: number | null;
    pa_diastolica?: number | null;
    temperatura?: number | null;
    juicio_clinico: string;
    diagnostico_presuntivo?: string | null;
    indicacion_terapeutica?: string | null;
    notas_evolucion?: string | null;
    requiere_derivacion?: boolean;
    especialidad_derivacion?: string | null;
    medicamentos?: Medicamento[];
}

export async function POST(request: NextRequest, context: RouteContext) {
    const params = await context.params;
    const pacienteId = parseInt(params.paciente_id, 10);

    if (isNaN(pacienteId)) {
        return NextResponse.json(
            { error: 'ID de paciente inválido' },
            { status: 400 }
        );
    }

    try {
        const body: NuevaConsultaBody = await request.json();

        // Validaciones básicas
        if (!body.historia_id || !body.profesional_id) {
            return NextResponse.json(
                { error: 'Faltan datos obligatorios: historia_id o profesional_id' },
                { status: 400 }
            );
        }

        if (!body.motivo_consulta || !body.juicio_clinico) {
            return NextResponse.json(
                { error: 'El motivo de consulta y el juicio clínico son obligatorios' },
                { status: 400 }
            );
        }

        // Verificar historia clínica
        const historiaClinica = await prisma.historias_clinicas.findFirst({
            where: {
                historia_id: body.historia_id,
                paciente_id: pacienteId,
            },
            select: { historia_id: true }
        });

        if (!historiaClinica) {
            return NextResponse.json(
                { error: 'Historia Clínica no encontrada para este paciente' },
                { status: 404 }
            );
        }

        // Verificar profesional
        const profesional = await prisma.profesionales.findUnique({
            where: { profesional_id: body.profesional_id },
            select: { profesional_id: true }
        });

        if (!profesional) {
            return NextResponse.json(
                { error: 'Profesional no encontrado' },
                { status: 404 }
            );
        }

        // Transacción para crear consulta, diagnóstico y medicamentos
        const nuevaConsulta = await prisma.$transaction(async (tx: any) => {
            // 1. Crear la consulta
            const consulta = await tx.consultas.create({
                data: {
                    historia_id: body.historia_id,
                    profesional_id: body.profesional_id,
                    fecha_consulta: new Date(),
                    motivo_consulta: body.motivo_consulta,
                    enfermedad_actual: body.enfermedad_actual || null,
                    pa_sistolica: body.pa_sistolica || null,
                    pa_diastolica: body.pa_diastolica || null,
                    temperatura: body.temperatura || null,
                    notas_evolucion: body.notas_evolucion || null,
                },
            });

            // 2. Crear el diagnóstico
            const diagnostico = await tx.diagnosticos.create({
                data: {
                    consulta_id: consulta.consulta_id,
                    juicio_clinico: body.juicio_clinico,
                    diagnostico_presuntivo: body.diagnostico_presuntivo || null,
                    indicacion_terapeutica: body.indicacion_terapeutica || null,
                    requiere_derivacion: body.requiere_derivacion || false,
                    especialidad_derivacion: body.especialidad_derivacion || null,
                },
            });

            // 3. Crear medicamentos si existen
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let medicamentosCreados: any[] = [];
            if (body.medicamentos && body.medicamentos.length > 0) {
                medicamentosCreados = await Promise.all(
                    body.medicamentos.map((med: Medicamento) =>
                        tx.medicamentos.create({
                            data: {
                                diagnostico_id: diagnostico.diagnostico_id,
                                droga: med.droga,
                                via_administracion: med.via_administracion,
                                dosis: med.dosis,
                                frecuencia: med.frecuencia || null,
                            },
                        })
                    )
                );
            }

            return {
                consulta,
                diagnostico,
                medicamentos: medicamentosCreados,
            };
        });

        return NextResponse.json(
            {
                message: 'Diagnóstico/Prácticas médicas registrada exitosamente',
                data: nuevaConsulta,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error al crear la consulta:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al registrar la consulta' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest, context: RouteContext) {
    const params = await context.params;
    const pacienteId = parseInt(params.paciente_id, 10);

    if (isNaN(pacienteId)) {
        return NextResponse.json(
            { error: 'ID de paciente inválido' },
            { status: 400 }
        );
    }

    try {
        const historiaClinica = await prisma.historias_clinicas.findUnique({
            where: { paciente_id: pacienteId },
            select: { historia_id: true }
        });

        if (!historiaClinica) {
            return NextResponse.json(
                { error: 'Historia Clínica no encontrada para este paciente' },
                { status: 404 }
            );
        }

        const consultas = await prisma.consultas.findMany({
            where: { historia_id: historiaClinica.historia_id },
            orderBy: { fecha_consulta: 'desc' },
            include: {
                diagnosticos: {
                    include: {
                        medicamentos: true, // ⭐ Incluir medicamentos
                    },
                },
                profesionales: {
                    select: {
                        profesional_id: true,
                        usuarios: {
                            select: {
                                nombre: true,
                                apellido: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({
            count: consultas.length,
            consultas,
        });

    } catch (error) {
        console.error('Error al obtener las Diagnóstico/Prácticas médicas:', error);
        return NextResponse.json(
            { error: 'Error al obtener las Diagnóstico/Prácticas médicas' },
            { status: 500 }
        );
    }
}