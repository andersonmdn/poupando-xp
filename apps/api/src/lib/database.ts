import { config } from '@/config/env';
import { PrismaClient } from '@prisma/client';

/**
 * Instância global do Prisma Client
 * Em desenvolvimento, reutiliza a conexão para evitar muitas conexões abertas
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.app.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });

if (config.app.isDevelopment) globalForPrisma.prisma = prisma;

/**
 * Função para desconectar do banco (útil para testes e shutdown graceful)
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
}
