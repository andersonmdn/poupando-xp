import { ApiError } from '@poupando-xp/shared';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

/**
 * Handler global para erros da aplicação
 * Converte diferentes tipos de erro em respostas HTTP padronizadas
 */
export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  // Erro de validação Zod
  if (error instanceof ZodError) {
    const apiError: ApiError = {
      type: 'https://httpstatuses.io/400',
      title: 'Dados de entrada inválidos',
      status: 400,
      detail: error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', '),
      instance: request.url,
    };

    return reply.status(400).send(apiError);
  }

  // Erro do Fastify (ex: 404, route not found)
  if ('statusCode' in error) {
    const apiError: ApiError = {
      type: `https://httpstatuses.io/${error.statusCode}`,
      title: error.message,
      status: error.statusCode!,
      instance: request.url,
    };

    return reply.status(error.statusCode!).send(apiError);
  }

  // Erros personalizados da aplicação
  if (error.message.includes('Token')) {
    const apiError: ApiError = {
      type: 'https://httpstatuses.io/401',
      title: 'Não autorizado',
      status: 401,
      detail: error.message,
      instance: request.url,
    };

    return reply.status(401).send(apiError);
  }

  if (
    error.message.includes('não encontrado') ||
    error.message.includes('not found')
  ) {
    const apiError: ApiError = {
      type: 'https://httpstatuses.io/404',
      title: 'Recurso não encontrado',
      status: 404,
      detail: error.message,
      instance: request.url,
    };

    return reply.status(404).send(apiError);
  }

  if (
    error.message.includes('já existe') ||
    error.message.includes('already exists')
  ) {
    const apiError: ApiError = {
      type: 'https://httpstatuses.io/409',
      title: 'Conflito',
      status: 409,
      detail: error.message,
      instance: request.url,
    };

    return reply.status(409).send(apiError);
  }

  // Erro interno do servidor (500)
  const apiError: ApiError = {
    type: 'https://httpstatuses.io/500',
    title: 'Erro interno do servidor',
    status: 500,
    detail: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
    instance: request.url,
  };

  return reply.status(500).send(apiError);
}

/**
 * Classe base para erros personalizados da aplicação
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Erro para recursos não encontrados
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Erro para conflitos (ex: email já cadastrado)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Conflito detectado') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * Erro para dados inválidos
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Dados inválidos') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

/**
 * Erro para autenticação/autorização
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}
