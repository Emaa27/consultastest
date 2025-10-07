// /app/api/agenda_semanal/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Por ahora es obligatorio pasar como parámetro dos parámentros: profesional_id y dia_semana
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const profesional_id = Number(searchParams.get("profesional_id"));
  const dia_semana = Number(searchParams.get("dia_semana"));

  const agenda = await prisma.agenda_semanal.findFirst({
    where: { profesional_id, dia_semana },
  });

  if (!agenda) {
    return NextResponse.json(null, { status: 200 }); // o {status:404}
  }
  return NextResponse.json(agenda);
}
