import { AuthService, JWTPayload } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Estende a interface do Fastify para incluir o usuário autenticado
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona o usuário à requisição
 */
export async function authMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply
) {
  try {
    // Extrai o token do header Authorization
    const token = AuthService.extractTokenFromHeader(
      request.headers.authorization
    );

    if (!token) {
      throw new UnauthorizedError('Token de acesso não fornecido');
    }

    // Verifica e decodifica o token
    const payload = AuthService.verifyToken(token);

    // Adiciona o usuário à requisição para uso nas rotas
    request.user = payload;
  } catch (error) {
    throw new UnauthorizedError(
      error instanceof Error ? error.message : 'Token inválido'
    );
  }
}
