import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma: PrismaClient =
  (global.prisma as PrismaClient) ??
  (new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient)

global.prisma = prisma
