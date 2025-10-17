import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');
    const obraSocial = searchParams.get('obraSocial');
    const busqueda = searchParams.get('busqueda');

    const where: any = {};
    if (estado && estado !== 'todos') where.estado = estado;
    if (obraSocial) where.obra_social_id = parseInt(obraSocial);

    let pacientes = await prisma.pacientes.findMany({
      where,
      include: { obras_sociales: true },
      orderBy: { paciente_id: 'desc' },
    });

    // Filtro de búsqueda unificado (nombre, apellido, DNI)
    if (busqueda && busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      pacientes = pacientes.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.apellido.toLowerCase().includes(termino) ||
      (p.documento && p.documento.includes(busqueda))
      );
    }

    return NextResponse.json(pacientes);
  } catch (error) {
    console.error('Error fetching pacientes:', error);
    return NextResponse.json({ message: 'Error fetching pacientes' }, { status: 500 });
  }
}