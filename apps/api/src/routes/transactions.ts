import { prisma } from '@/lib/database';
import { NotFoundError } from '@/lib/errors';
import { authMiddleware } from '@/middlewares/auth';
import {
  createTransactionSchema,
  PaginatedResponse,
  Transaction,
  transactionQuerySchema,
  updateTransactionSchema,
} from '@financial-notes/shared';
import { FastifyInstance } from 'fastify';

/**
 * Rotas para gerenciamento de transações
 * Todas requerem autenticação JWT
 */
export async function transactionRoutes(fastify: FastifyInstance) {
  // Aplica middleware de autenticação para todas as rotas deste plugin
  fastify.addHook('preHandler', authMiddleware);

  // Listar transações com filtros e paginação
  fastify.get(
    '/transactions',
    {
      schema: {
        description: 'Lista transações do usuário com filtros opcionais',
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            from: {
              type: 'string',
              format: 'date',
              description: 'Data inicial (YYYY-MM-DD)',
            },
            to: {
              type: 'string',
              format: 'date',
              description: 'Data final (YYYY-MM-DD)',
            },
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
              description: 'Tipo da transação',
            },
            category: { type: 'string', description: 'Categoria da transação' },
            page: {
              type: 'number',
              minimum: 1,
              default: 1,
              description: 'Número da página',
            },
            pageSize: {
              type: 'number',
              minimum: 1,
              maximum: 100,
              default: 20,
              description: 'Itens por página',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                    amount: { type: 'number' },
                    description: { type: 'string' },
                    category: { type: 'string' },
                    occurredAt: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  pageSize: { type: 'number' },
                  total: { type: 'number' },
                  totalPages: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    async (request, _reply) => {
      const userId = request.user!.sub;

      // Valida parâmetros de query
      const { from, to, type, category, page, pageSize } =
        transactionQuerySchema.parse(request.query);

      // Constrói filtros dinâmicos
      const where: any = { userId };

      if (from || to) {
        where.occurredAt = {};
        if (from) where.occurredAt.gte = new Date(from);
        if (to) where.occurredAt.lte = new Date(to);
      }

      if (type) where.type = type;
      if (category) where.category = category;

      // Busca dados paginados
      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          orderBy: { occurredAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.transaction.count({ where }),
      ]);

      const response: PaginatedResponse<Transaction> = {
        data: transactions.map((t: any) => ({
          id: t.id,
          userId: t.userId,
          type: t.type as any,
          amount: Number(t.amount),
          description: t.description,
          category: t.category as any,
          occurredAt: t.occurredAt.toISOString().split('T')[0], // YYYY-MM-DD
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        })),
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };

      return response;
    }
  );

  // Criar nova transação
  fastify.post(
    '/transactions',
    {
      schema: {
        description: 'Cria uma nova transação',
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            amount: { type: 'number', minimum: 0.01 },
            description: { type: 'string', minLength: 1, maxLength: 255 },
            category: { type: 'string', minLength: 1, maxLength: 50 },
            occurredAt: { type: 'string', format: 'date-time' },
          },
          required: ['type', 'amount', 'description', 'category', 'occurredAt'],
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              type: { type: 'string' },
              amount: { type: 'number' },
              description: { type: 'string' },
              category: { type: 'string' },
              occurredAt: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.sub;

      // Valida dados de entrada
      const data = createTransactionSchema.parse(request.body);

      // Cria a transação
      const transaction = await prisma.transaction.create({
        data: {
          ...data,
          userId,
          occurredAt: new Date(data.occurredAt),
        },
      });

      const response: Transaction = {
        id: transaction.id,
        userId: transaction.userId,
        type: transaction.type as any,
        amount: Number(transaction.amount),
        description: transaction.description,
        category: transaction.category as any,
        occurredAt: transaction.occurredAt.toISOString().split('T')[0],
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString(),
      };

      return reply.status(201).send(response);
    }
  );

  // Buscar transação por ID
  fastify.get(
    '/transactions/:id',
    {
      schema: {
        description: 'Busca uma transação específica por ID',
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              type: { type: 'string' },
              amount: { type: 'number' },
              description: { type: 'string' },
              category: { type: 'string' },
              occurredAt: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              title: { type: 'string' },
              status: { type: 'number' },
            },
          },
        },
      },
    },
    async (request, _reply) => {
      const userId = request.user!.sub;
      const { id } = request.params as { id: string };

      const transaction = await prisma.transaction.findFirst({
        where: { id, userId },
      });

      if (!transaction) {
        throw new NotFoundError('Transação não encontrada');
      }

      const response: Transaction = {
        id: transaction.id,
        userId: transaction.userId,
        type: transaction.type as any,
        amount: Number(transaction.amount),
        description: transaction.description,
        category: transaction.category as any,
        occurredAt: transaction.occurredAt.toISOString().split('T')[0],
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString(),
      };

      return response;
    }
  );

  // Atualizar transação
  fastify.put(
    '/transactions/:id',
    {
      schema: {
        description: 'Atualiza uma transação existente',
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            amount: { type: 'number', minimum: 0.01 },
            description: { type: 'string', minLength: 1, maxLength: 255 },
            category: { type: 'string', minLength: 1, maxLength: 50 },
            occurredAt: { type: 'string', format: 'date-time' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              type: { type: 'string' },
              amount: { type: 'number' },
              description: { type: 'string' },
              category: { type: 'string' },
              occurredAt: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              title: { type: 'string' },
              status: { type: 'number' },
            },
          },
        },
      },
    },
    async (request, _reply) => {
      const userId = request.user!.sub;
      const { id } = request.params as { id: string };

      // Valida dados de entrada (campos opcionais para update)
      const updateData = updateTransactionSchema.parse(request.body);

      // Verifica se a transação existe e pertence ao usuário
      const existingTransaction = await prisma.transaction.findFirst({
        where: { id, userId },
      });

      if (!existingTransaction) {
        throw new NotFoundError('Transação não encontrada');
      }

      // Atualiza a transação
      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          ...updateData,
          occurredAt: updateData.occurredAt
            ? new Date(updateData.occurredAt)
            : undefined,
        },
      });

      const response: Transaction = {
        id: transaction.id,
        userId: transaction.userId,
        type: transaction.type as any,
        amount: Number(transaction.amount),
        description: transaction.description,
        category: transaction.category as any,
        occurredAt: transaction.occurredAt.toISOString().split('T')[0],
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString(),
      };

      return response;
    }
  );

  // Deletar transação
  fastify.delete(
    '/transactions/:id',
    {
      schema: {
        description: 'Deleta uma transação',
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          204: {
            description: 'Transação deletada com sucesso',
            type: 'null',
          },
          404: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              title: { type: 'string' },
              status: { type: 'number' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.sub;
      const { id } = request.params as { id: string };

      // Verifica se a transação existe e pertence ao usuário
      const existingTransaction = await prisma.transaction.findFirst({
        where: { id, userId },
      });

      if (!existingTransaction) {
        throw new NotFoundError('Transação não encontrada');
      }

      // Deleta a transação
      await prisma.transaction.delete({
        where: { id },
      });

      return reply.status(204).send();
    }
  );
}
