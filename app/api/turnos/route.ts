// /app/api/turnos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profesional_id = searchParams.get("profesional_id");
    const fecha = searchParams.get("fecha"); // YYYY-MM-DD

    // Filtro dinámico
    const where: any = {};
    if (profesional_id) where.profesional_id = Number(profesional_id);

    if (fecha) {
      const start = new Date(`${fecha}T00:00:00`);
      const end = new Date(`${fecha}T23:59:59.999`);
      where.inicio = { gte: start, lte: end };
    }

    const turnos = await prisma.turnos.findMany({
      where,
      include: !fecha && !profesional_id
        ? {
            pacientes: true,
            profesionales: { include: { usuarios: true, profesiones: true } },
          }
        : undefined, // para la búsqueda de ocupados no hace falta incluir relaciones
      orderBy: { inicio: "asc" },
    });

    // Normalizar fin cuando sea null (por compatibilidad)
    const conFin = turnos.map((t) => {
      const inicio = new Date(t.inicio);
      const fin = t.fin ?? new Date(inicio.getTime() + (t.duracion_min ?? 0) * 60_000);
      return { ...t, fin };
    });

    return NextResponse.json(conFin, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("GET /api/turnos error:", e);
    return NextResponse.json({ error: "No se pudo obtener turnos" }, { status: 500 });
  }
}

// Parse local "YYYY-MM-DD HH:MM:SS"
function localDateFromYmdHms(s: string) {
  if (!s || typeof s !== "string") return new Date(NaN);
  const clean = s.replace("T", " ").slice(0, 19);
  const [d, t] = clean.split(" ");
  if (!d || !t) return new Date(NaN);
  const [y, m, day] = d.split("-").map(Number);
  const [hh, mm, ss] = t.split(":").map(Number);
  return new Date(y, m - 1, day, hh ?? 0, mm ?? 0, ss ?? 0); // LOCAL
}
const addMinutes = (d: Date, mins: number) => new Date(d.getTime() + mins * 60000);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[POST /turnos] body RAW:", body);

    const profesional_id = Number(body.profesional_id);
    const paciente_id    = Number(body.paciente_id);
    const duracion_min   = Number(body.duracion_min ?? 30);
    const estado         = body.estado ?? "reservado";
    // const consultorio_id = body.consultorio_id != null ? Number(body.consultorio_id) : undefined; // <- QUITADO

    if (!profesional_id || !paciente_id) {
      return NextResponse.json({ error: "Faltan profesional_id o paciente_id" }, { status: 400 });
    }

    let inicioStr: string | undefined = body.inicio;
    let finStr: string | undefined    = body.fin;

    if (!inicioStr) {
      if (!body.fecha || !body.hora) {
        return NextResponse.json({ error: "Falta 'inicio' o ('fecha' y 'hora')" }, { status: 400 });
      }
      inicioStr = `${body.fecha} ${body.hora}:00`;
    }
    const inicio = localDateFromYmdHms(inicioStr);
    if (isNaN(inicio.getTime())) return NextResponse.json({ error: `inicio inválido: ${inicioStr}` }, { status: 400 });

    let fin: Date;
    if (finStr) {
      fin = localDateFromYmdHms(finStr);
      if (isNaN(fin.getTime())) return NextResponse.json({ error: `fin inválido: ${finStr}` }, { status: 400 });
    } else {
      fin = addMinutes(inicio, duracion_min);
    }

    if (!(inicio < fin)) {
      return NextResponse.json({ error: "inicio debe ser menor a fin" }, { status: 400 });
    }

    const data = {
      profesional_id,
      paciente_id,
      inicio,         // DATETIME local exacto
      fin,
      duracion_min,
      estado,
      // obra_social_id: body.obra_social_id ?? null,  // <-- sólo si existe en tu schema
      // turno_id: body.turno_id,                      // <-- sólo si existe en tu schema
    };

    console.log("[POST /turnos] data a insertar:", {
      ...data,
      inicio: inicio.toString(),
      fin: fin.toString(),
    });

    const nuevoTurno = await prisma.turnos.create({
      data,
      include: {
        pacientes: true,
        profesionales: { include: { usuarios: true, profesiones: true } },
      },
    });

    return NextResponse.json(nuevoTurno, { status: 201 });
  } catch (error: any) {
    console.error("Error creando turno (detalle):", error);
    return NextResponse.json({ error: error?.message ?? "Error al crear el turno" }, { status: 500 });
  }
}
