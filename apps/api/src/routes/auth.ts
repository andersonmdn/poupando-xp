import { AuthService } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { ConflictError, UnauthorizedError } from '@/lib/errors';
import { AuthResponse, loginSchema, registerSchema } from '@poupando-xp/shared';
import { FastifyInstance } from 'fastify';

/**
 * Rotas de autenticação (registro e login)
 * Não requerem autenticação JWT
 */
export async function authRoutes(fastify: FastifyInstance) {
  // Registro de usuário
  fastify.post(
    '/auth/register',
    {
      schema: {
        description: 'Registra um novo usuário',
        tags: ['Auth'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6, maxLength: 100 },
          },
          required: ['name', 'email', 'password'],
        },
        response: {
          201: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: {
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
          409: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              title: { type: 'string' },
              status: { type: 'number' },
              detail: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      // Valida os dados de entrada com Zod
      const { name, email, password } = registerSchema.parse(request.body);

      // Verifica se o email já está cadastrado
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictError('Email já está em uso');
      }

      // Gera hash da senha
      const passwordHash = await AuthService.hashPassword(password);

      // Cria o usuário no banco
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Gera token JWT
      const token = AuthService.generateToken({
        sub: user.id,
        email: user.email,
      });

      const response: AuthResponse = {
        token,
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };

      return reply.status(201).send(response);
    }
  );

  // Login de usuário
  fastify.post(
    '/auth/login',
    {
      schema: {
        description: 'Autentica um usuário e retorna token JWT',
        tags: ['Auth'],
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 1 },
          },
          required: ['email', 'password'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: {
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
          401: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              title: { type: 'string' },
              status: { type: 'number' },
              detail: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, _reply) => {
      // Valida os dados de entrada
      const { email, password } = loginSchema.parse(request.body);

      // Busca o usuário pelo email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedError('Email ou senha inválidos');
      }

      // Verifica a senha
      const isPasswordValid = await AuthService.comparePassword(
        password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new UnauthorizedError('Email ou senha inválidos');
      }

      // Gera token JWT
      const token = AuthService.generateToken({
        sub: user.id,
        email: user.email,
      });

      const response: AuthResponse = {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };

      return response;
    }
  );
}
