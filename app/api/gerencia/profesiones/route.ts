import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const busqueda = searchParams.get('busqueda');

    let profesiones = await prisma.profesiones.findMany({
      orderBy: { nombre: 'asc' },
    });

    if (busqueda && busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      profesiones = profesiones.filter(p =>
        p.nombre.toLowerCase().includes(termino)
      );
    }

    return NextResponse.json(profesiones);
  } catch (error) {
    console.error('Error fetching profesiones:', error);
    return NextResponse.json({ message: 'Error fetching profesiones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json();

    if (!nombre || nombre.trim().length === 0) {
      return NextResponse.json({ message: 'El nombre es requerido' }, { status: 400 });
    }

    const newProfesion = await prisma.profesiones.create({
      data: { nombre: nombre.trim() },
    });

    return NextResponse.json(newProfesion, { status: 201 });
  } catch (error: any) {
    console.error('Error creating profesión:', error);
    return NextResponse.json({ message: error.message || 'Error creating profesión' }, { status: 500 });
  }
}