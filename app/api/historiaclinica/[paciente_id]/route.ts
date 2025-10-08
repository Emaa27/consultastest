import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { historias_clinicas_actividad_fisica } from '@prisma/client';

type RouteContext = {
  params: Promise<{ paciente_id: string }>;
};

interface AntecedentesUpdateBody {
  sexo?: string | null;
  grupo_sanguineo?: string | null;
  estado_civil?: string | null;
  ocupacion?: string | null;
  enfermedades_infancia?: string | null;
  enfermedades_cronicas?: string | null;
  cirugias?: string | null;
  alergias?: string | null;
  medicamentos_actuales?: string | null;
  consume_tabaco?: boolean;
  consume_alcohol?: boolean;
  actividad_fisica?: historias_clinicas_actividad_fisica | null;
}

/**
 * [GET] Obtiene la Historia Clínica Base y el listado de Consultas
 * URL: /api/historiaclinica/[paciente_id]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { paciente_id } = await context.params;
  const pacienteId = parseInt(paciente_id, 10);

  if (isNaN(pacienteId)) {
    return NextResponse.json({ error: 'ID de paciente inválido' }, { status: 400 });
  }

  try {
    const historiaClinica = await prisma.historias_clinicas.findUnique({
      where: { paciente_id: pacienteId },
      include: {
        pacientes: {
          select: {
            nombre: true,
            apellido: true,
            documento: true,
            fecha_nacimiento: true,
            genero: true,
            email: true,
            telefono: true,
          },
        },
        profesionales: { // médico cabecera
          include: {
            usuarios: {
              select: {
                nombre: true,
                email: true,
              },
            },
          },
        },
        consultas: {
          orderBy: { fecha_consulta: 'desc' },
          include: {
            diagnosticos: true,
            historias_clinicas: { // relación correcta
              select: {
                paciente_id: true,
              },
            },
            profesionales: { // relación en Prisma (plural)
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
        },
      },
    });

    if (!historiaClinica) {
      return NextResponse.json(
        { error: 'Historia Clínica no encontrada para este paciente.' },
        { status: 404 }
      );
    }

    return NextResponse.json(historiaClinica);

  } catch (error) {
    console.error('Error en GET HC:', error);
    return NextResponse.json(
      { error: 'Error al obtener la Historia Clínica.' },
      { status: 500 }
    );
  }
}

/**
 * [PUT] Actualiza los datos de la Historia Clínica Base (Antecedentes)
 * SOLO puede ser modificado por el médico de cabecera del paciente
 * URL: /api/historiaclinica/[paciente_id]
 */
export async function PUT(request: NextRequest, context: RouteContext) {
    const { paciente_id } = await context.params;
    const pacienteId = parseInt(paciente_id, 10); 

    if (isNaN(pacienteId)) {
        return NextResponse.json({ error: 'ID de paciente inválido' }, { status: 400 });
    }

    try {
        const body: AntecedentesUpdateBody = await request.json(); 

        // TODO: Obtener profesional_id del usuario autenticado
        // Por ahora usamos un ID hardcodeado (TEMPORAL)
        const profesionalActual = 9; // CAMBIAR cuando tengas autenticación

        const historia = await prisma.historias_clinicas.findUnique({
            where: { paciente_id: pacienteId },
            select: { 
                historia_id: true,
                medico_cabecera_id: true
            }
        });

        if (!historia) {
             return NextResponse.json(
                { error: 'Historia Clínica no encontrada.' }, 
                { status: 404 }
            );
        }

        // VALIDACIÓN: Solo el médico de cabecera puede editar antecedentes
        if (historia.medico_cabecera_id !== profesionalActual) {
            return NextResponse.json(
                { error: 'Solo el médico de cabecera puede modificar los antecedentes del paciente.' },
                { status: 403 } // Forbidden
            );
        }

        const historiaActualizada = await prisma.historias_clinicas.update({
            where: { historia_id: historia.historia_id },
            data: {
                sexo: body.sexo,
                grupo_sanguineo: body.grupo_sanguineo,
                estado_civil: body.estado_civil,
                ocupacion: body.ocupacion,
                enfermedades_infancia: body.enfermedades_infancia,
                enfermedades_cronicas: body.enfermedades_cronicas,
                cirugias: body.cirugias,
                alergias: body.alergias,
                medicamentos_actuales: body.medicamentos_actuales,
                consume_tabaco: body.consume_tabaco, 
                consume_alcohol: body.consume_alcohol,
                actividad_fisica: body.actividad_fisica, 
            },
        });

        return NextResponse.json(historiaActualizada);

    } catch (error) {
        console.error('Error en PUT HC:', error);
        return NextResponse.json(
            { error: 'Error al actualizar la Historia Clínica.' }, 
            { status: 500 }
        );
    }
}