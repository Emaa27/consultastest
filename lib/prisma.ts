import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

function createClient() {
  return new PrismaClient()
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createClient()
}

export const resetPrisma = () => {
  try { globalForPrisma.prisma?.$disconnect() } catch {}
  globalForPrisma.prisma = createClient()
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createClient()
    }
    const value = (globalForPrisma.prisma as any)[prop]
    return typeof value === 'function' ? value.bind(globalForPrisma.prisma) : value
  }
})
