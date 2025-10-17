import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { estado } = await req.json();
    const id = parseInt(params.id);

    if (!['activo', 'inactivo'].includes(estado)) {
      return NextResponse.json({ message: 'Estado inválido' }, { status: 400 });
    }

    const updated = await prisma.pacientes.update({
      where: { paciente_id: id },
      data: { estado },
      include: { obras_sociales: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating paciente:', error);
    return NextResponse.json({ message: 'Error updating paciente' }, { status: 500 });
  }
}
