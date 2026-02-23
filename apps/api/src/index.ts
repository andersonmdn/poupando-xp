import { config } from '@/config/env';
import { errorHandler } from '@/lib/errors';
import { authRoutes } from '@/routes/auth';
import { healthRoutes } from '@/routes/health';
import { transactionRoutes } from '@/routes/transactions';
import { userRoutes } from '@/routes/user';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import Fastify from 'fastify';

/**
 * Cria e configura a instância do Fastify
 */
async function createApp() {
  const fastify = Fastify({
    logger: {
      level: config.logging.level,
      transport: config.logging.prettyPrint
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    } as any, // Temporary fix for type issues
  });

  // Configurar CORS para WSL (aceita Windows + WSL)
  await fastify.register(cors, {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      /^http:\/\/.*:3000$/, // Aceita qualquer IP na porta 3000
    ],
    credentials: true,
  });

  // Configurar Swagger para documentação da API
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Financial Notes API',
        description: 'API REST para sistema de anotações financeiras',
        version: '1.0.0',
        contact: {
          name: 'Desenvolvedor',
          email: 'dev@example.com',
        },
      },
      host: `localhost:${config.app.port}`,
      schemes: ['http'],
      servers: [
        {
          url: `http://localhost:${config.app.port}`,
          description: 'Desenvolvimento Local',
        },
        {
          url: `http://127.0.0.1:${config.app.port}`,
          description: 'Desenvolvimento WSL',
        },
      ],
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'Health', description: 'Endpoints de saúde da API' },
        { name: 'Auth', description: 'Endpoints de autenticação' },
        {
          name: 'Transactions',
          description: 'Endpoints de transações financeiras',
        },
        { name: 'User', description: 'Endpoints do usuário' },
      ],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Token JWT no formato: Bearer {token}',
        },
      },
    },
  });

  // Configurar Swagger UI
  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) {
        next();
      },
      preHandler: function (_request, _reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: header => header,
    transformSpecification: (swaggerObject, _request, _reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  // Configurar handler global de erros
  fastify.setErrorHandler(errorHandler as any); // Temporary fix for type issues

  // Registrar rotas
  await fastify.register(healthRoutes, { prefix: '/api/v1' });
  await fastify.register(authRoutes, { prefix: '/api/v1' });
  await fastify.register(transactionRoutes, { prefix: '/api/v1' });
  await fastify.register(userRoutes, { prefix: '/api/v1' });

  return fastify;
}

/**
 * Inicia o servidor
 */
async function start() {
  try {
    const fastify = await createApp();

    // Registra handlers para shutdown graceful
    process.on('SIGTERM', async () => {
      fastify.log.info('Recebido SIGTERM, iniciando shutdown graceful...');
      await fastify.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      fastify.log.info('Recebido SIGINT, iniciando shutdown graceful...');
      await fastify.close();
      process.exit(0);
    });

    // Inicia o servidor
    const address = await fastify.listen({
      port: config.app.port,
      host: '0.0.0.0',
    });

    fastify.log.info(`🚀 Servidor rodando em: ${address}`);
    fastify.log.info(`📚 Documentação disponível em: ${address}/docs`);
    fastify.log.info(`🔧 Ambiente: ${config.app.env}`);
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Inicia a aplicação se este arquivo for executado diretamente
if (require.main === module) {
  start();
}

export { createApp };
