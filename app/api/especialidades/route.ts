import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

// ✅ GET - Listar especialidades
export async function GET() {
  try {
    const especialidades = await prisma.profesiones.findMany({
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(especialidades);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener las especialidades" },
      { status: 500 }
    );
  }
}

// ✅ POST - Registrar nueva especialidad
export async function POST(request: Request) {
  try {
    const { nombre, descripcion } = await request.json();

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre de la especialidad es obligatorio" },
        { status: 400 }
      );
    }

    const existente = await prisma.profesiones.findFirst({
      where: { nombre: nombre.trim() },
    });
    if (existente) {
      return NextResponse.json(
        { error: "La Especialidad que intenta registrar ya existe" },
        { status: 400 }
      );
    }

    const nueva = await prisma.profesiones.create({
      data: { nombre: nombre.trim(), descripcion },
    });

    return NextResponse.json(nueva);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo registrar la especialidad" },
      { status: 500 }
    );
  }
}
