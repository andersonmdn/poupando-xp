import { prisma } from '@/lib/database';
import { authMiddleware } from '@/middlewares/auth';
import { User } from '@financial-notes/shared';
import { FastifyInstance } from 'fastify';

/**
 * Rotas para informações do usuário autenticado
 */
export async function userRoutes(fastify: FastifyInstance) {
  // Aplica middleware de autenticação
  fastify.addHook('preHandler', authMiddleware);

  // Buscar informações do usuário logado
  fastify.get(
    '/me',
    {
      schema: {
        description: 'Retorna informações do usuário autenticado',
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, _reply) => {
      const userId = request.user!.sub;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const response: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };

      return response;
    }
  );
}
