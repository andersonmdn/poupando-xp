import { z } from 'zod';

/**
 * Enums e constantes compartilhados entre API e Web
 */

export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionCategory = {
  // Receitas
  SALARY: 'SALARY',
  FREELANCE: 'FREELANCE',
  INVESTMENT: 'INVESTMENT',
  BUSINESS: 'BUSINESS',
  OTHER_INCOME: 'OTHER_INCOME',

  // Despesas
  FOOD: 'FOOD',
  TRANSPORT: 'TRANSPORT',
  HEALTH: 'HEALTH',
  EDUCATION: 'EDUCATION',
  ENTERTAINMENT: 'ENTERTAINMENT',
  UTILITIES: 'UTILITIES',
  RENT: 'RENT',
  SHOPPING: 'SHOPPING',
  OTHER_EXPENSE: 'OTHER_EXPENSE',
} as const;

export type TransactionCategory =
  (typeof TransactionCategory)[keyof typeof TransactionCategory];

/**
 * Schemas Zod para validação de dados
 * Esses schemas são usados tanto na API (validação de entrada)
 * quanto no Web (validação de formulários)
 */

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Transaction schemas
export const createTransactionSchema = z.object({
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(255),
  category: z.enum(Object.values(TransactionCategory) as [string, ...string[]]),
  occurredAt: z.string().datetime('Data inválida'),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = z.object({
  from: z.string().date('Data inicial inválida').optional(),
  to: z.string().date('Data final inválida').optional(),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]).optional(),
  category: z
    .enum(Object.values(TransactionCategory) as [string, ...string[]])
    .optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

/**
 * Tipos TypeScript inferidos dos schemas
 * Use esses tipos em vez de criar interfaces manualmente
 */
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryParams = z.infer<typeof transactionQuerySchema>;

/**
 * Tipos de resposta da API
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: TransactionCategory;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
}

/**
 * Utilitários para categorias
 */
export const getIncomeCategories = () => [
  TransactionCategory.SALARY,
  TransactionCategory.FREELANCE,
  TransactionCategory.INVESTMENT,
  TransactionCategory.BUSINESS,
  TransactionCategory.OTHER_INCOME,
];

export const getExpenseCategories = () => [
  TransactionCategory.FOOD,
  TransactionCategory.TRANSPORT,
  TransactionCategory.HEALTH,
  TransactionCategory.EDUCATION,
  TransactionCategory.ENTERTAINMENT,
  TransactionCategory.UTILITIES,
  TransactionCategory.RENT,
  TransactionCategory.SHOPPING,
  TransactionCategory.OTHER_EXPENSE,
];

export const getCategoryLabel = (category: TransactionCategory): string => {
  const labels: Record<TransactionCategory, string> = {
    [TransactionCategory.SALARY]: 'Salário',
    [TransactionCategory.FREELANCE]: 'Freelance',
    [TransactionCategory.INVESTMENT]: 'Investimento',
    [TransactionCategory.BUSINESS]: 'Negócio',
    [TransactionCategory.OTHER_INCOME]: 'Outras Receitas',
    [TransactionCategory.FOOD]: 'Alimentação',
    [TransactionCategory.TRANSPORT]: 'Transporte',
    [TransactionCategory.HEALTH]: 'Saúde',
    [TransactionCategory.EDUCATION]: 'Educação',
    [TransactionCategory.ENTERTAINMENT]: 'Entretenimento',
    [TransactionCategory.UTILITIES]: 'Utilidades',
    [TransactionCategory.RENT]: 'Aluguel',
    [TransactionCategory.SHOPPING]: 'Compras',
    [TransactionCategory.OTHER_EXPENSE]: 'Outras Despesas',
  };

  return labels[category] || category;
};
