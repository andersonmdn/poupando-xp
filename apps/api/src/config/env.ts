import { config as dotenvConfig } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// Node.js não tem __dirname e __filename por padrão em módulos ES, então precisamos criar manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente
dotenvConfig({ path: path.resolve(__dirname, '../../../..', '.env') });

/**
 * Schema de validação para as variáveis de ambiente
 * Garante que todas as configurações necessárias estejam presentes
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  API_PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  API_HTTPS_ENABLED: z
    .enum(['true', 'false'])
    .default('false')
    .transform(value => value === 'true'),
  API_HTTPS_CERT: z.string().optional(),
  API_HTTPS_KEY: z.string().optional(),
  API_HTTPS_CERT_PATH: z.string().default('/certs/server.crt'),
  API_HTTPS_KEY_PATH: z.string().default('/certs/server.key'),
});

type Env = z.infer<typeof envSchema>;

/**
 * Valida e exporta as configurações da aplicação
 */
function validateEnv(): Env {
  console.log('🔍 Validando variáveis de ambiente...');
  console.log(
    '📋 Carregando .env de:',
    path.resolve(__dirname, '../../../..', '.env')
  );
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Erro nas variáveis de ambiente:', error);
    process.exit(1);
  }
}

export const env = validateEnv();

/**
 * Configurações da aplicação organizadas por domínio
 */
export const config = {
  app: {
    port: env.API_PORT,
    env: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    https: {
      enabled: env.API_HTTPS_ENABLED,
      cert: env.API_HTTPS_CERT,
      key: env.API_HTTPS_KEY,
      certPath: env.API_HTTPS_CERT_PATH,
      keyPath: env.API_HTTPS_KEY_PATH,
    },
  },

  database: {
    url: env.DATABASE_URL,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },

  cors: {
    origin: env.CORS_ORIGIN,
  },

  logging: {
    level: env.LOG_LEVEL,
    // Em desenvolvimento, usar pretty print para logs mais legíveis
    prettyPrint: env.NODE_ENV === 'development',
  },
} as const;
