import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { estado } = await req.json();
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (!['activo', 'inactivo'].includes(estado)) {
      return NextResponse.json({ message: 'Estado inválido' }, { status: 400 });
    }

    const updated = await prisma.usuarios.update({
      where: { usuario_id: id },
      data: { estado },
      include: { roles: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating usuario:', error);
    return NextResponse.json({ message: 'Error updating usuario' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { nombre, apellido, email, telefono, dni, rol_id } = await req.json();
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    // Validaciones
    if (!nombre || !apellido || !email || !telefono || !dni || !rol_id) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    if (!dni.match(/^\d{7,8}$/)) {
      return NextResponse.json({ message: 'DNI inválido (debe tener 7 u 8 dígitos)' }, { status: 400 });
    }

    // Obtener usuario actual
    const usuarioActual = await prisma.usuarios.findUnique({
      where: { usuario_id: id },
    });

    if (!usuarioActual) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Validar email único (excepto el actual)
    if (email !== usuarioActual.email) {
      const existingEmail = await prisma.usuarios.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return NextResponse.json({ message: 'El email ya está registrado' }, { status: 400 });
      }
    }

    // Validar DNI único (excepto el actual)
    if (dni !== usuarioActual.dni) {
      const existingDni = await prisma.usuarios.findFirst({
        where: { 
          dni,
          usuario_id: { not: id }
        },
      });

      if (existingDni) {
        return NextResponse.json({ message: 'El DNI ya está registrado' }, { status: 400 });
      }
    }

    // Actualizar usuario
    const updated = await prisma.usuarios.update({
      where: { usuario_id: id },
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        dni: dni.trim(),
        rol_id,
      },
      include: { roles: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating usuario:', error);
    return NextResponse.json({ message: 'Error updating usuario' }, { status: 500 });
  }
}