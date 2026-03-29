import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Traemos el usuario + su rol y, si aplica, su profesional con la profesión
    const usuario = await prisma.usuarios.findFirst({
      where: { email, estado: 'activo' },
      include: {
        roles: true,
        profesionales: {
          select: {
            profesional_id: true,
            usuario_id: true,
            profesiones: { select: { nombre: true } }, // ← profesión del profesional
          },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // ⚠️ En prod, usar bcrypt.compare (acá lo dejo como opción)
    const valid = password === usuario.contrasena;
    // const valid = await bcrypt.compare(password, usuario.contrasena);

    if (!valid) {
      return NextResponse.json(
        { success: false, message: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Rol del usuario → redirección
    const roleName = usuario.roles.nombre.toLowerCase();
    let redirectPath = '/';
    if (roleName === 'asistente') redirectPath = '/turnos';
    else if (roleName === 'profesional') redirectPath = '/agendadiaria';
    else redirectPath = '/metricas';

    // Resolver profesionalId y profesión (si el usuario es profesional)
    let profesionalId: number | null = null;
    let profesionNombre: string | null = null;

    if (roleName === 'profesional') {
      const inc = Array.isArray(usuario.profesionales) ? usuario.profesionales[0] : usuario.profesionales ?? null;

      if (inc) {
        profesionalId = inc.profesional_id ?? null;
        profesionNombre = inc.profesiones?.nombre ?? null;
      }

      // Fallback por si no vino poblado (poco probable con el include anterior)
      if (!profesionalId || !profesionNombre) {
        const profesional = await prisma.profesionales.findFirst({
          where: { usuario_id: usuario.usuario_id },
          select: { profesional_id: true, profesiones: { select: { nombre: true } } },
        });
        profesionalId = profesional?.profesional_id ?? profesionalId;
        profesionNombre = profesional?.profesiones?.nombre ?? profesionNombre;
      }
    }

    // Payload hacia el cliente
    const payload = {
      success: true,
      message: 'Login exitoso',
      user: {
        id: usuario.usuario_id,
        nombre: `${usuario.nombre} ${usuario.apellido}`,
        email: usuario.email,
        rol: usuario.roles.nombre,             // rol del usuario (asistente/profesional/gerente)
        profesionalId,                         // null si no corresponde
        profesionNombre,                       // p. ej. “Odontólogo” (null si no es profesional)
      },
      redirectPath,
    };

    // Respuesta + cookies httpOnly
    const res = NextResponse.json(payload);

    // Guardamos profesionalId si existe
    if (profesionalId) {
      res.cookies.set('profesionalId', String(profesionalId), {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
      });
    }

    // Cookie con el rol del usuario (ya la tenías)
    res.cookies.set('rol', roleName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });

    // NUEVO: cookie con la profesión del profesional (nombre “humano”)
    if (profesionNombre) {
      res.cookies.set('profesion', profesionNombre, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
      });
    }

    return res;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
