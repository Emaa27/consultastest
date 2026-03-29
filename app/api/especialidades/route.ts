import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/* Obtener todas las especialidades */
export async function GET() {
  try {
    const especialidades = await prisma.profesiones.findMany({
      orderBy: { nombre: 'asc' },
    });
    return NextResponse.json(especialidades);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener especialidades' }, { status: 500 });
  }
}

/* Crear nueva especialidad */
export async function POST(req: Request) {
  try {
    const { nombre, descripcion } = await req.json();

    if (!nombre || nombre.trim() === '') {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const nueva = await prisma.profesiones.create({
      data: { nombre },
    });

    return NextResponse.json(nueva);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una especialidad con ese nombre' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al registrar especialidad' }, { status: 500 });
  }
}

/* Actualizar estado (activar/desactivar) */
export async function PUT(req: Request) {
  try {
    const { id, active } = await req.json();

    if (!id || (active !== 'activo' && active !== 'inactivo')) {
      return NextResponse.json({ error: 'Valor de estado inválido' }, { status: 400 });
    }

    const updated = await prisma.profesiones.update({
      where: { profesion_id: Number(id) },
      data: {},
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 });
  }
}
