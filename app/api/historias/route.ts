import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const historias = await prisma.historias_clinicas.findMany({
      include: {
        pacientes: true,
        consultas: {
          include: {
            diagnosticos: true,
            pruebas_complementarias: true,
            profesionales: {
              include: { usuarios: true },
            },
          },
          orderBy: {
            fecha_consulta: 'desc', 
          },
        },
      },
      orderBy: {
        historia_id: 'asc', 
      },
    });

    return NextResponse.json(historias);
  } catch (error) {
    console.error('Error al obtener historias:', error);
    return NextResponse.json(
      { error: 'Error al cargar historias clínicas' },
      { status: 500 }
    );
  }
}
