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
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(apiRoot, '../..');

function resolveFilePathCandidates(filePath: string): string[] {
  const trimmedPath = filePath.trim();
  const candidates = new Set<string>([trimmedPath]);

  if (!path.isAbsolute(trimmedPath)) {
    candidates.add(path.resolve(process.cwd(), trimmedPath));
    candidates.add(path.resolve(apiRoot, trimmedPath));
  }

  if (trimmedPath.startsWith('/apps/api/')) {
    candidates.add(path.resolve(workspaceRoot, `.${trimmedPath}`));
  }

  return Array.from(candidates);
}

function readPemFile(filePath: string): Buffer {
  const candidates = resolveFilePathCandidates(filePath);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate);
    }
  }

  throw new Error(
    `Arquivo não encontrado para path=${filePath}. Tentativas: ${candidates.join(', ')}`
  );
}

function getHttpsOptions() {
  if (!config.app.https.enabled) {
    return undefined;
  }

  const certFromEnv = config.app.https.cert;
  const keyFromEnv = config.app.https.key;

  if ((certFromEnv && !keyFromEnv) || (!certFromEnv && keyFromEnv)) {
    throw new Error(
      'HTTPS habilitado, mas API_HTTPS_CERT e API_HTTPS_KEY devem ser informados juntos.'
    );
  }

  if (certFromEnv && keyFromEnv) {
    return {
      cert: certFromEnv,
      key: keyFromEnv,
    };
  }

  try {
    return {
      cert: readPemFile(config.app.https.certPath),
      key: readPemFile(config.app.https.keyPath),
    };
  } catch (error) {
    throw new Error(
      `HTTPS habilitado, mas não foi possível ler os arquivos de certificado/chave em \nCertPath=${config.app.https.certPath}\nKeyPath=${config.app.https.keyPath}\nErro: ${error}`
    );
  }
}

/**
 * Cria e configura a instância do Fastify
 */
async function createApp() {
  const httpsOptions = getHttpsOptions();
  const protocol = httpsOptions ? 'https' : 'http';

  const logger = {
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
  } as any; // Temporary fix for type issues

  const fastify = Fastify({
    ...(httpsOptions ? { https: httpsOptions } : {}),
    logger,
  } as any);

  // Configurar CORS para WSL (aceita Windows + WSL)
  await fastify.register(cors, {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      /^http:\/\/.*:3000$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  // Configurar Swagger para documentação da API
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'Poupando XP API',
        description: 'API REST para sistema de controle financeiro pessoal',
        version: '1.0.0',
        contact: {
          name: 'Desenvolvedor',
          email: 'dev@example.com',
        },
      },
      servers: [
        { url: `${protocol}://localhost:${config.app.port}` },
        { url: `${protocol}://127.0.0.1:${config.app.port}` },
      ],
      tags: [
        { name: 'Health', description: 'Endpoints de saúde da API' },
        { name: 'Auth', description: 'Endpoints de autenticação' },
        {
          name: 'Transactions',
          description: 'Endpoints de transações financeiras',
        },
        { name: 'User', description: 'Endpoints do usuário' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Token JWT no formato: Bearer {token}',
          },
        },
      },
      security: [],
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
    fastify.log.info(
      `🔐 HTTPS: ${config.app.https.enabled ? 'habilitado' : 'desabilitado'}`
    );
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
