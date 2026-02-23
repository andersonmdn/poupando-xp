'use client';

/**
 * Página de Edição de Transação
 *
 * TUTORIAL: Esta página demonstra:
 *
 * 1. CARREGAMENTO DE DADOS EXISTENTES: Buscar transação por ID
 * 2. FORMULÁRIO DE EDIÇÃO: Pré-popular com dados existentes
 * 3. LOADING STATES: Diferentes estados de carregamento
 * 4. ATUALIZAÇÃO DE DADOS: PATCH/PUT para modificar registro
 * 5. TRATAMENTO DE 404: Quando transação não existe
 * 6. UX DE EDIÇÃO: Cancelar alterações, confirmar exclusão
 *
 * Este é um padrão muito comum em aplicações CRUD.
 */

import { Moon, Pencil, Trash2 } from '@/components/ui/icons';
import { useAuth } from '@/contexts/auth';
import { apiClient, ApiClientError } from '@/lib/api';
import {
  getCategoryLabel,
  getExpenseCategories,
  getIncomeCategories,
  Transaction,
  TransactionCategory,
  TransactionType,
  UpdateTransactionDTO,
  updateTransactionSchema,
} from '@financial-notes/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const { user, logout } = useAuth();

  const transactionId = params.id as string;

  // Estados para carregamento inicial
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Estados para o formulário
  const [apiError, setApiError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateTransactionDTO>({
    resolver: zodResolver(updateTransactionSchema),
  });

  /**
   * TUTORIAL: Carrega a transação existente ao montar o componente
   */
  useEffect(() => {
    loadTransaction();
  }, [transactionId]);

  const loadTransaction = async () => {
    try {
      setInitialLoading(true);
      setApiError('');
      setNotFound(false);

      const existingTransaction = await apiClient.get<Transaction>(
        `/api/v1/transactions/${transactionId}`
      );

      setTransaction(existingTransaction);

      // TUTORIAL: reset() do React Hook Form para pré-popular o formulário
      // Converte a data de volta para o formato do input date
      reset({
        type: existingTransaction.type,
        amount: existingTransaction.amount,
        description: existingTransaction.description,
        category: existingTransaction.category,
        occurredAt: existingTransaction.occurredAt + 'T12:00:00.000Z', // Adiciona horário para o datetime-local
      });
    } catch (error) {
      console.error('Erro ao carregar transação:', error);

      if (error instanceof ApiClientError && error.status === 404) {
        setNotFound(true);
      } else {
        setApiError('Erro ao carregar transação');
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const selectedType = watch('type');

  const getAvailableCategories = (
    type: TransactionType
  ): TransactionCategory[] => {
    return type === 'INCOME' ? getIncomeCategories() : getExpenseCategories();
  };

  const handleTypeChange = (type: TransactionType) => {
    const availableCategories = getAvailableCategories(type);

    if (availableCategories.length > 0) {
      setValue('category', availableCategories[0] as TransactionCategory);
    }
  };

  const onSubmit = async (data: UpdateTransactionDTO) => {
    try {
      setApiError('');
      setSuccess(false);

      // Remove campos undefined para não enviar na requisição
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      // Converte data para formato ISO se fornecida
      if (updateData.occurredAt) {
        updateData.occurredAt = new Date(
          updateData.occurredAt as string
        ).toISOString();
      }

      const updatedTransaction = await apiClient.put<Transaction>(
        `/api/v1/transactions/${transactionId}`,
        updateData
      );

      setTransaction(updatedTransaction);
      setSuccess(true);

      // Remove mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setApiError(
          error.apiError?.detail ||
            error.apiError?.title ||
            'Erro ao atualizar transação'
        );
      } else {
        setApiError('Erro inesperado. Tente novamente.');
      }

      console.error('Erro ao atualizar transação:', error);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    const confirmDelete = confirm(
      `Tem certeza que deseja excluir a transação "${transaction.description}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/api/v1/transactions/${transactionId}`);

      // Redireciona para lista após deletar
      router.push('/transactions?deleted=true');
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      alert('Erro ao deletar transação. Tente novamente.');
    }
  };

  /**
   * TUTORIAL: Loading state inicial
   */
  if (initialLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-background-secondary)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <div className="card text-center">
            <p>Carregando transação...</p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * TUTORIAL: Estado de erro 404
   */
  if (notFound) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-background-secondary)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <div className="card text-center">
            <div
              style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}
            >
              😕
            </div>
            <h2 className="text-xl font-bold mb-4">Transação não encontrada</h2>
            <p className="text-secondary mb-6">
              A transação que você está tentando editar não foi encontrada.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/transactions" className="btn btn-primary">
                Ver Transações
              </Link>
              <Link href="/dashboard" className="btn btn-secondary">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background-secondary)',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: 'var(--color-background)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--spacing-md) 0',
        }}
      >
        <div className="container">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-primary"
              >
                💰 Financial Notes
              </Link>
              <span className="text-secondary">/ Editar Transação</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/transactions" className="text-secondary">
                Ver Transações
              </Link>
              <Link href="/dashboard" className="text-secondary">
                Dashboard
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">{user?.name}</span>
                <button
                  onClick={logout}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.75rem',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                  }}
                >
                  Sair
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Header da página */}
          <section className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Editar Transação</h1>
            <p className="text-secondary">
              {transaction?.description &&
                `Editando: ${transaction.description}`}
            </p>
          </section>

          {/* Indicador de alterações não salvas */}
          {isDirty && (
            <div
              style={{
                backgroundColor: '#fef3c7',
                color: '#d97706',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: 'var(--spacing-md)',
                fontSize: '0.875rem',
                border: '1px solid #fed7aa',
              }}
            >
              ⚠️ Você tem alterações não salvas
            </div>
          )}

          {/* Mensagem de sucesso */}
          {success && (
            <div
              style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: 'var(--spacing-md)',
                fontSize: '0.875rem',
                border: '1px solid #bbf7d0',
              }}
            >
              ✅ Transação atualizada com sucesso!
            </div>
          )}

          {/* Erro da API */}
          {apiError && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: 'var(--spacing-md)',
                fontSize: '0.875rem',
                border: '1px solid #fecaca',
              }}
            >
              ⚠️ {apiError}
            </div>
          )}

          {/* Formulário */}
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Tipo da transação */}
              <div className="mb-4">
                <label className="label">Tipo da Transação *</label>
                <div className="flex gap-4">
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      {...register('type')}
                      type="radio"
                      value="INCOME"
                      onChange={() => handleTypeChange('INCOME')}
                    />
                    <span className="text-success font-medium">📈 Receita</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      {...register('type')}
                      type="radio"
                      value="EXPENSE"
                      onChange={() => handleTypeChange('EXPENSE')}
                    />
                    <span className="text-error font-medium">📉 Despesa</span>
                  </label>
                </div>
                {errors.type && (
                  <p className="text-error text-sm mt-2">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Valor */}
              <div className="mb-4">
                <label htmlFor="amount" className="label">
                  Valor (R$) *
                </label>
                <input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  id="amount"
                  className="input"
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                />
                {errors.amount && (
                  <p className="text-error text-sm mt-2">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div className="mb-4">
                <label htmlFor="description" className="label">
                  Descrição *
                </label>
                <input
                  {...register('description')}
                  type="text"
                  id="description"
                  className="input"
                  placeholder="Descreva esta transação"
                  maxLength={255}
                />
                {errors.description && (
                  <p className="text-error text-sm mt-2">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Categoria */}
              {selectedType && (
                <div className="mb-4">
                  <label htmlFor="category" className="label">
                    Categoria *
                  </label>
                  <select
                    {...register('category')}
                    id="category"
                    className="input"
                  >
                    {getAvailableCategories(selectedType).map(category => (
                      <option key={category} value={category}>
                        {getCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-error text-sm mt-2">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              )}

              {/* Data */}
              <div className="mb-6">
                <label htmlFor="occurredAt" className="label">
                  Data da Transação *
                </label>
                <input
                  {...register('occurredAt')}
                  type="date"
                  id="occurredAt"
                  className="input"
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.occurredAt && (
                  <p className="text-error text-sm mt-2">
                    {errors.occurredAt.message}
                  </p>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-2 mb-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? 'Salvando...' : '💾 Salvar Alterações'}
                </button>

                <Link
                  href="/transactions"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ↩️ Cancelar
                </Link>
              </div>

              {/* Zona de perigo */}
              <div
                style={{
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: 'var(--spacing-md)',
                  marginTop: 'var(--spacing-md)',
                }}
              >
                <h3 className="text-sm font-semibold text-error mb-2">
                  Zona de Perigo
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Uma vez excluída, esta transação não poderá ser recuperada.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-error"
                  style={{ fontSize: '0.875rem' }}
                >
                  🗑️ Excluir Transação
                </button>
              </div>
            </form>
          </div>

          {/* Informações adicionais */}
          {transaction && (
            <section className="mt-6">
              <div className="card" style={{ fontSize: '0.875rem' }}>
                <h3 className="font-semibold mb-3">
                  ℹ️ Informações da Transação
                </h3>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div className="flex justify-between">
                    <span className="text-secondary">ID:</span>
                    <span className="font-mono text-sm">{transaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Criado em:</span>
                    <span>
                      {new Date(transaction.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Última atualização:</span>
                    <span>
                      {new Date(transaction.updatedAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Dicas de melhorias */}
          <section className="mt-8">
            <div
              className="card"
              style={{
                backgroundColor: 'var(--color-background-tertiary)',
                borderStyle: 'dashed',
              }}
            >
              <h3 className="font-semibold mb-4">
                🔧 Melhorias para implementar
              </h3>
              <ul className="text-sm text-secondary">
                <li className="mb-2">
                  <strong>Histórico de alterações:</strong> Rastrear quem e
                  quando modificou
                </li>
                <li className="mb-2">
                  <strong>Confirmação antes de sair:</strong> Avisar sobre
                  alterações não salvas
                </li>
                <li className="mb-2">
                  <strong>Auto-save:</strong> Salvar automaticamente enquanto o
                  usuário digita
                </li>
                <li className="mb-2">
                  <strong>Duplicar transação:</strong> Criar cópia com dados
                  similares
                </li>
                <li className="mb-2">
                  <strong>Validação de servidor:</strong> Validar dados no
                  backend também
                </li>
              </ul>
            </div>
          </section>

          {/*
            TAILWIND DEMO (você pode remover depois)
            Objetivo: exemplo mínimo de classes do Tailwind sem afetar o CSS atual
          */}
          <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
            <h2 className="text-lg font-semibold">Tailwind Demo</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Exemplo de spacing, cores e dark mode por classe.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                INCOME
              </span>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800 dark:bg-rose-900/30 dark:text-rose-200">
                EXPENSE
              </span>
              <button className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                Botão Tailwind
              </button>
            </div>
          </section>

          {/*
            ICONS DEMO (removível)
            Objetivo: demonstrar uso do lucide-react com Tailwind
          */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900">
              <Pencil className="h-4 w-4" />
              Editar
            </button>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <Moon className="h-4 w-4" /> Modo escuro
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-rose-700 dark:text-rose-300">
              <Trash2 className="h-4 w-4" /> Excluir
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
