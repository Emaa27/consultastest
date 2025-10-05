import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const obras_sociales = await prisma.obras_sociales.findMany();
  return NextResponse.json(obras_sociales);
}