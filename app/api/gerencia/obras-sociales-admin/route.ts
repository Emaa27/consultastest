import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');

    const where: any = {};
    if (estado && estado !== 'todos') where.estado = estado;

    const obrasSociales = await prisma.obras_sociales.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(obrasSociales);
  } catch (error) {
    console.error('Error fetching obras sociales:', error);
    return NextResponse.json({ message: 'Error fetching obras sociales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json();

    if (!nombre || nombre.trim().length === 0) {
      return NextResponse.json({ message: 'El nombre es requerido' }, { status: 400 });
    }

    // Verificar si ya existe
    const existente = await prisma.obras_sociales.findFirst({
      where: { nombre: nombre.trim() },
    });

    if (existente) {
      return NextResponse.json({ message: 'Ya existe una obra social con ese nombre' }, { status: 400 });
    }

    const newObraSocial = await prisma.obras_sociales.create({
      data: {
        nombre: nombre.trim(),
        estado: 'activa',
      },
    });

    return NextResponse.json(newObraSocial, { status: 201 });
  } catch (error: any) {
    console.error('Error creating obra social:', error);
    return NextResponse.json({ message: error.message || 'Error creating obra social' }, { status: 500 });
  }
}