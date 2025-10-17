import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { estado } = await req.json();
    const id = parseInt(params.id);

    if (!['activa', 'inactiva'].includes(estado)) {
      return NextResponse.json({ message: 'Estado inválido' }, { status: 400 });
    }

    const updated = await prisma.obras_sociales.update({
      where: { obra_social_id: id },
      data: { estado },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating obra social:', error);
    return NextResponse.json({ message: 'Error updating obra social' }, { status: 500 });
  }
}