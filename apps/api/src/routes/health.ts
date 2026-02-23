import { FastifyInstance } from 'fastify';

/**
 * Rota simples de health check
 * Não requer autenticação e serve para verificar se a API está funcionando
 */
export async function healthRoutes(fastify: FastifyInstance) {
  // Swagger schema para documentação
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Verifica se a API está funcionando',
        tags: ['Health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              uptime: { type: 'number' },
            },
          },
        },
      },
    },
    async (_request, _reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    }
  );
}
