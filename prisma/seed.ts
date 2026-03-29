import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Roles
  await prisma.roles.upsert({ where: { rol_id: 1 }, update: {}, create: { rol_id: 1, nombre: 'gerente' } })
  await prisma.roles.upsert({ where: { rol_id: 2 }, update: {}, create: { rol_id: 2, nombre: 'profesional' } })
  await prisma.roles.upsert({ where: { rol_id: 3 }, update: {}, create: { rol_id: 3, nombre: 'asistente' } })

  console.log('✓ Roles creados')

  // Usuario gerente inicial
  await prisma.usuarios.upsert({
    where: { email: 'admin@eitan.com' },
    update: {},
    create: {
      nombre: 'Admin',
      apellido: 'Eitan',
      email: 'admin@eitan.com',
      contrasena: 'admin123',
      rol_id: 1,
      estado: 'activo',
    },
  })

  console.log('✓ Usuario gerente creado: admin@eitan.com / admin123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
