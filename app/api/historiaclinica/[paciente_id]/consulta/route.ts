import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
    params: { paciente_id: string };
};

interface NuevaConsultaBody {
    historia_id: number;
    profesional_id: number;
    motivo_consulta: string;
    enfermedad_actual?: string | null;
    pa_sistolica?: number | null;
    pa_diastolica?: number | null;
    temperatura?: number | null;
    peso?: number | null;
    altura?: number | null;
    juicio_clinico: string;
    diagnostico_presuntivo?: string | null;
    indicacion_terapeutica?: string | null;
    notas_evolucion?: string | null;
}

export async function POST(request: NextRequest, context: RouteContext) {
    const pacienteId = parseInt(context.params.paciente_id, 10);

    if (isNaN(pacienteId)) {
        return NextResponse.json(
            { error: 'ID de paciente inválido' },
            { status: 400 }
        );
    }

    try {
        const body: NuevaConsultaBody = await request.json();

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

        const historiaClinica = await prisma.historiaClinica.findFirst({
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

        const nuevaConsulta = await prisma.$transaction(async (tx: any) => {
            const consultaData: any = {
                historia_id: body.historia_id,
                profesional_id: body.profesional_id,
                fecha_consulta: new Date(),
                motivo_consulta: body.motivo_consulta,
            };

            if (body.enfermedad_actual !== null && body.enfermedad_actual !== undefined) {
                consultaData.enfermedad_actual = body.enfermedad_actual;
            }
            if (body.pa_sistolica !== null && body.pa_sistolica !== undefined) {
                consultaData.pa_sistolica = body.pa_sistolica;
            }
            if (body.pa_diastolica !== null && body.pa_diastolica !== undefined) {
                consultaData.pa_diastolica = body.pa_diastolica;
            }
            if (body.temperatura !== null && body.temperatura !== undefined) {
                consultaData.temperatura = body.temperatura;
            }
            if (body.peso !== null && body.peso !== undefined) {
                consultaData.peso = body.peso;
            }
            if (body.altura !== null && body.altura !== undefined) {
                consultaData.altura = body.altura;
            }
            if (body.notas_evolucion !== null && body.notas_evolucion !== undefined) {
                consultaData.notas_evolucion = body.notas_evolucion;
            }

            const consulta = await tx.consulta.create({
                data: consultaData,
            });

            const diagnosticoData: any = {
                consulta_id: consulta.consulta_id,
                juicio_clinico: body.juicio_clinico,
            };

            if (body.diagnostico_presuntivo !== null && body.diagnostico_presuntivo !== undefined) {
                diagnosticoData.diagnostico_presuntivo = body.diagnostico_presuntivo;
            }
            if (body.indicacion_terapeutica !== null && body.indicacion_terapeutica !== undefined) {
                diagnosticoData.indicacion_terapeutica = body.indicacion_terapeutica;
            }

            const diagnostico = await tx.diagnostico.create({
                data: diagnosticoData,
            });

            return {
                ...consulta,
                diagnostico,
            };
        });

        return NextResponse.json(
            {
                message: 'Consulta registrada exitosamente',
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
    const pacienteId = parseInt(context.params.paciente_id, 10);

    if (isNaN(pacienteId)) {
        return NextResponse.json(
            { error: 'ID de paciente inválido' },
            { status: 400 }
        );
    }

    try {
        const historiaClinica = await prisma.historiaClinica.findUnique({
            where: { paciente_id: pacienteId },
            select: { historia_id: true }
        });

        if (!historiaClinica) {
            return NextResponse.json(
                { error: 'Historia Clínica no encontrada para este paciente' },
                { status: 404 }
            );
        }

        const consultas = await prisma.consulta.findMany({
            where: { historia_id: historiaClinica.historia_id },
            orderBy: { fecha_consulta: 'desc' },
            include: {
                diagnosticos: true,
                profesional: {
                    select: {
                        profesional_id: true,
                        usuarios: {
                            select: {
                                nombre: true,
                                apellido: true,
                            }
                        }
                    }
                }
            },
        });

        return NextResponse.json({
            count: consultas.length,
            consultas,
        });

    } catch (error) {
        console.error('Error al obtener las consultas:', error);
        return NextResponse.json(
            { error: 'Error al obtener las consultas' },
            { status: 500 }
        );
    }
}