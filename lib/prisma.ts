import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = global as unknown as { prisma: ReturnType<typeof make> }

const make = () => new PrismaClient().$extends(withAccelerate())

export const prisma = globalForPrisma.prisma ?? make()
globalForPrisma.prisma = prisma
