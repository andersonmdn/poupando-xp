'use client';

/**
 * Página de Criação de Transação
 *
 * TUTORIAL: Esta página demonstra:
 *
 * 1. FORMULÁRIO COMPLEXO: Campos condicionais, validação avançada
 * 2. DROPDOWN DINÂMICO: Categorias baseadas no tipo selecionado
 * 3. UX PATTERNS: Auto-save, validação em tempo real
 * 4. ESTADO DE CRIAÇÃO: Loading, sucesso, erro
 * 5. NAVEGAÇÃO PÓS-CRIAÇÃO: Redirect ou continuar criando
 *
 * Este formulário é mais complexo que login/register e mostra
 * padrões avançados de formulários React.
 */

import { ArrowLeft, Plus, Sun } from '@/components/ui/icons';
import { useAuth } from '@/contexts/auth';
import { apiClient, ApiClientError } from '@/lib/api';
import {
  CreateTransactionDTO,
  createTransactionSchema,
  getCategoryLabel,
  getExpenseCategories,
  getIncomeCategories,
  TransactionCategory,
  TransactionType,
} from '@financial-notes/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function NewTransactionPage() {
  const { user, logout } = useAuth();
  const [apiError, setApiError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  /**
   * TUTORIAL: Formulário com valores padrão mais inteligentes
   *
   * Definimos valores padrão que fazem sentido:
   * - Data atual
   * - Tipo despesa (mais comum)
   * - Categoria baseada no tipo
   */
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionDTO>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: 'EXPENSE',
      amount: 0,
      description: '',
      category: 'FOOD', // Categoria padrão para despesa
      occurredAt: new Date().toISOString().split('T')[0] + 'T12:00:00.000Z', // Hoje ao meio-dia
    },
  });

  /**
   * TUTORIAL: watch() para monitorar mudanças em campos específicos
   *
   * Quando o tipo muda, atualizamos a categoria automaticamente
   * para uma categoria apropriada para o novo tipo.
   */
  const selectedType = watch('type');

  /**
   * TUTORIAL: Função para obter categorias baseadas no tipo
   */
  const getAvailableCategories = (
    type: TransactionType
  ): TransactionCategory[] => {
    return type === 'INCOME' ? getIncomeCategories() : getExpenseCategories();
  };

  /**
   * TUTORIAL: Effect para atualizar categoria quando tipo muda
   *
   * Usamos setValue() do React Hook Form para atualizar o valor
   * programaticamente quando o usuário muda o tipo.
   */
  const handleTypeChange = (type: TransactionType) => {
    const availableCategories = getAvailableCategories(type);

    // Auto-seleciona a primeira categoria disponível
    if (availableCategories.length > 0) {
      setValue('category', availableCategories[0] as TransactionCategory);
    }
  };

  const onSubmit = async (data: CreateTransactionDTO) => {
    try {
      setApiError('');
      setSuccess(false);

      // Converte data para formato ISO
      const transactionData = {
        ...data,
        // Garante que a data está no formato correto
        occurredAt: new Date(data.occurredAt).toISOString(),
      };

      await apiClient.post('/api/v1/transactions', transactionData);

      setSuccess(true);

      // Opção 1: Redirecionar para lista
      // router.push('/transactions');

      // Opção 2: Limpar formulário para criar outra (melhor UX)
      reset({
        type: data.type, // Mantém o tipo
        amount: 0,
        description: '',
        category: data.category, // Mantém a categoria
        occurredAt: new Date().toISOString().split('T')[0] + 'T12:00:00.000Z',
      });

      // Remove mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setApiError(
          error.apiError?.detail ||
            error.apiError?.title ||
            'Erro ao criar transação'
        );
      } else {
        setApiError('Erro inesperado. Tente novamente.');
      }

      console.error('Erro ao criar transação:', error);
    }
  };

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
              <span className="text-secondary">/ Nova Transação</span>
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
            <h1 className="text-2xl font-bold mb-2">Nova Transação</h1>
            <p className="text-secondary">
              Registre uma nova receita ou despesa em suas finanças.
            </p>
          </section>

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
              ✅ Transação criada com sucesso! Você pode criar outra abaixo.
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
                  placeholder={
                    selectedType === 'INCOME'
                      ? 'Ex: Salário Janeiro'
                      : 'Ex: Almoço no restaurante'
                  }
                  maxLength={255}
                />
                {errors.description && (
                  <p className="text-error text-sm mt-2">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Categoria */}
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
                  max={new Date().toISOString().split('T')[0]} // Não permite datas futuras
                />
                {errors.occurredAt && (
                  <p className="text-error text-sm mt-2">
                    {errors.occurredAt.message}
                  </p>
                )}
                <p className="text-sm text-secondary mt-2">
                  Quando esta transação aconteceu?
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? 'Salvando...' : '💾 Salvar Transação'}
                </button>

                <Link
                  href="/transactions"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ↩️ Voltar
                </Link>
              </div>
            </form>
          </div>

          {/* Dicas */}
          <section className="mt-8">
            <div
              className="card"
              style={{
                backgroundColor: 'var(--color-background-tertiary)',
                borderStyle: 'dashed',
              }}
            >
              <h3 className="font-semibold mb-4">
                💡 Dicas para um bom controle financeiro
              </h3>
              <ul className="text-sm text-secondary">
                <li className="mb-2">
                  <strong>Seja específico:</strong> Descreva bem a transação
                  (ex: "Almoço Restaurante X" em vez de "Comida")
                </li>
                <li className="mb-2">
                  <strong>Registre no mesmo dia:</strong> Evite esquecer
                  transações registrando-as rapidamente
                </li>
                <li className="mb-2">
                  <strong>Use categorias consistentes:</strong> Mantenha um
                  padrão nas suas categorizações
                </li>
                <li className="mb-2">
                  <strong>Revise regularmente:</strong> Verifique suas
                  transações semanalmente
                </li>
              </ul>

              <div
                className="mt-4 pt-4"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <h4 className="font-medium mb-2">
                  🔧 Próximas funcionalidades
                </h4>
                <ul className="text-sm text-secondary">
                  <li>• Upload de comprovantes/fotos</li>
                  <li>• Transações recorrentes</li>
                  <li>• Tags personalizadas</li>
                  <li>• Importação de extratos bancários</li>
                </ul>
              </div>
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
              <Plus className="h-4 w-4" />
              Salvar
            </button>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
              <Sun className="h-4 w-4" /> Modo claro
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
