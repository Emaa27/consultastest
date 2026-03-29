import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    const count = await prisma.profesionales.count({
      where: { profesion_id: id },
    });

    if (count > 0) {
      return NextResponse.json(
        { message: 'No se puede eliminar una profesión que tiene profesionales asignados' },
        { status: 400 }
      );
    }

    await prisma.profesiones.delete({
      where: { profesion_id: id },
    });

    return NextResponse.json({ message: 'Profesión eliminada' });
  } catch (error: any) {
    console.error('Error deleting profesión:', error);
    return NextResponse.json({ message: error.message || 'Error deleting profesión' }, { status: 500 });
  }
}