import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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

    // Buscar usuario con su rol e (idealmente) su profesional vinculado
    const usuario = await prisma.usuarios.findFirst({
      where: { email, estado: 'activo' },
      include: {
        roles: true,
        // Si tu relación desde usuarios → profesionales es 1:1 pero el nombre es plural,
        // igual podés usar select para traer solo la PK.
        profesionales: { select: { profesional_id: true, usuario_id: true } }
      }
    });

    console.log(usuario);

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // Verificar contraseña (en producción usar bcrypt.compare)
    const valid = password === usuario.contrasena;
    // const valid = await bcrypt.compare(password, usuario.contrasena);

    if (!valid) {
      return NextResponse.json(
        { success: false, message: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Rol → redirección
    const roleName = usuario.roles.nombre.toLowerCase();
    let redirectPath = '/';
    if (roleName === 'asistente') {
      redirectPath = '/turnos';
    } else if (roleName === 'profesional') {
      redirectPath = '/agendadiaria';
    } else {
      redirectPath = '/gerente';
    }

    // Resolver profesional_id si es profesional
    let profesionalId: number | null = null;
    if (roleName === 'Profesional') {
      // Si el include vino con algo, úsalo
      const inc = Array.isArray(usuario.profesionales) ? usuario.profesionales[0] : null;
      profesionalId = inc?.profesional_id ?? null;

      // Fallback: por si el include vino vacío o la relación no está poblada
      if (!profesionalId) {
        const profesional = await prisma.profesionales.findFirst({
          where: { usuario_id: usuario.usuario_id },
          select: { profesional_id: true }
        });
        profesionalId = profesional?.profesional_id ?? null;
      }
    }

    // Armar respuesta
    const payload = {
      success: true,
      message: 'Login exitoso',
      user: {
        id: usuario.usuario_id,
        nombre: `${usuario.nombre} ${usuario.apellido}`,
        email: usuario.email,
        rol: usuario.roles.nombre,
        profesionalId // null si no corresponde
      },
      redirectPath
    };

    // Si querés "guardar" en el server-side, setear cookie httpOnly:
    const res = NextResponse.json(payload);
    if (profesionalId) {
      res.cookies.set('profesionalId', String(profesionalId), {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/'
        // opcional: maxAge: 60 * 60 * 24 // 1 día
      });
    }

    // También podrías setear una cookie de rol/usuario si te sirve:
    res.cookies.set('rol', roleName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/'
    });

    return res;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
