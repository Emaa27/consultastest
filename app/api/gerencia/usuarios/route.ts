import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');
    const rol = searchParams.get('rol');
    const busqueda = searchParams.get('busqueda');

    const where: any = {};
    if (estado && estado !== 'todos') where.estado = estado;
    if (rol) where.rol_id = parseInt(rol);

    let usuarios = await prisma.usuarios.findMany({
      where,
      include: { roles: true },
      orderBy: { usuario_id: 'desc' },
    });

    // Filtro de búsqueda unificado (nombre, apellido, DNI)
    if (busqueda && busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      usuarios = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(termino) ||
        u.apellido.toLowerCase().includes(termino) ||
        (u.dni && u.dni.includes(busqueda))
      );
    }

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    return NextResponse.json({ message: 'Error fetching usuarios' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, apellido, email, telefono, dni, contrasena, rol_id } = await req.json();

    if (!nombre || !apellido || !email || !telefono || !dni || !contrasena || !rol_id) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    if (!dni.match(/^\d{7,8}$/)) {
      return NextResponse.json({ message: 'DNI inválido (debe tener 7 u 8 dígitos)' }, { status: 400 });
    }

    const existingUser = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'El email ya está registrado' }, { status: 400 });
    }

    const existingDni = await prisma.usuarios.findFirst({
      where: { dni },
    });

    if (existingDni) {
      return NextResponse.json({ message: 'El DNI ya está registrado' }, { status: 400 });
    }

    const newUser = await prisma.usuarios.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        dni: dni.trim(),
        contrasena,
        rol_id,
        estado: 'activo',
      },
      include: { roles: true },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Error creating usuario:', error);
    return NextResponse.json({ message: error.message || 'Error creating usuario' }, { status: 500 });
  }
}