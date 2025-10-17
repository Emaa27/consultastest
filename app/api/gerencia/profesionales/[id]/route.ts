import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { estado } = await req.json();
    const id = parseInt(params.id);

    const updated = await prisma.profesionales.update({
      where: { profesional_id: id },
      data: { estado },
      include: {
        usuarios: true,
        profesiones: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating profesional:', error);
    return NextResponse.json({ message: 'Error updating profesional' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { usuario, profesional } = await req.json();
    const id = parseInt(params.id);

    // Obtener el profesional con su usuario
    const profesionalActual = await prisma.profesionales.findUnique({
      where: { profesional_id: id },
      include: { usuarios: true },
    });

    if (!profesionalActual) {
      return NextResponse.json({ message: 'Profesional no encontrado' }, { status: 404 });
    }

    // Validar email único (excepto el actual)
    if (usuario.email !== profesionalActual.usuarios.email) {
      const existingEmail = await prisma.usuarios.findUnique({
        where: { email: usuario.email },
      });

      if (existingEmail) {
        return NextResponse.json({ message: 'El email ya está registrado' }, { status: 400 });
      }
    }

    // Validar matrícula única (excepto la actual)
    if (profesional.matricula !== profesionalActual.matricula) {
      const existingMatricula = await prisma.profesionales.findFirst({
        where: { 
          matricula: profesional.matricula,
          profesional_id: { not: id }
        },
      });

      if (existingMatricula) {
        return NextResponse.json({ message: 'La matrícula ya está registrada' }, { status: 400 });
      }
    }

    // Actualizar usuario
    await prisma.usuarios.update({
      where: { usuario_id: profesionalActual.usuario_id },
      data: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
      },
    });

    // Actualizar profesional
    const updated = await prisma.profesionales.update({
      where: { profesional_id: id },
      data: {
        matricula: profesional.matricula,
        profesion_id: profesional.profesion_id,
      },
      include: {
        usuarios: true,
        profesiones: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating profesional:', error);
    return NextResponse.json({ message: 'Error updating profesional' }, { status: 500 });
  }
}
