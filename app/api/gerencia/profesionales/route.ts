import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');
    const busqueda = searchParams.get('busqueda');

    const where: any = {};
    if (estado && estado !== 'todos') where.estado = estado;

    let profesionales = await prisma.profesionales.findMany({
      where,
      include: {
        usuarios: true,
        profesiones: true,
      },
    });

    if (busqueda && busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      profesionales = profesionales.filter(p =>
        p.usuarios?.nombre.toLowerCase().includes(termino) ||
        p.usuarios?.apellido.toLowerCase().includes(termino) ||
        (p.matricula && p.matricula.toLowerCase().includes(termino))
      );
    }

    return NextResponse.json(profesionales);
  } catch (error) {
    console.error('Error fetching profesionales:', error);
    return NextResponse.json({ message: 'Error fetching profesionales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { usuario, profesional } = await req.json();

    if (!usuario.nombre || !usuario.apellido || !usuario.email || !usuario.telefono || !usuario.contrasena) {
      return NextResponse.json({ message: 'Todos los campos del usuario son obligatorios' }, { status: 400 });
    }

    if (!profesional.matricula || !profesional.profesion_id) {
      return NextResponse.json({ message: 'La matrícula y profesión son obligatorias' }, { status: 400 });
    }

    const existingEmail = await prisma.usuarios.findUnique({
      where: { email: usuario.email },
    });

    if (existingEmail) {
      return NextResponse.json({ message: 'El email ya está registrado' }, { status: 400 });
    }

    const existingMatricula = await prisma.profesionales.findFirst({
      where: { matricula: profesional.matricula },
    });

    if (existingMatricula) {
      return NextResponse.json({ message: 'La matrícula ya está registrada' }, { status: 400 });
    }

    const newUser = await prisma.usuarios.create({
      data: {
        nombre: usuario.nombre.trim(),
        apellido: usuario.apellido.trim(),
        email: usuario.email.trim(),
        telefono: usuario.telefono.trim(),
        contrasena: usuario.contrasena,
        rol_id: usuario.rol_id,
        estado: 'activo',
      },
    });

    const newProfesional = await prisma.profesionales.create({
      data: {
        usuario_id: newUser.usuario_id,
        profesion_id: profesional.profesion_id,
        matricula: profesional.matricula.trim(),
        estado: 'activo',
      },
      include: {
        usuarios: true,
        profesiones: true,
      },
    });

    return NextResponse.json(newProfesional, { status: 201 });
  } catch (error: any) {
    console.error('Error creating profesional:', error);
    return NextResponse.json({ message: error.message || 'Error creating profesional' }, { status: 500 });
  }
}