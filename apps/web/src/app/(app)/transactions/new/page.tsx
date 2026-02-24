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

import { FieldWithRightIcon } from '@/components/ui/FieldWithRightIcon';
import { FormField } from '@/components/ui/FormField';
import { CalendarDays, Check, DollarSign, Tag, X } from '@/components/ui/icons';
import { TransactionTypeToggle } from '@/components/ui/TransactionTypeToggle';
import { apiClient, ApiClientError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateTransactionDTO,
  createTransactionSchema,
  getCategoryLabel,
  getExpenseCategories,
  getIncomeCategories,
  TransactionCategory,
  TransactionType,
} from '@poupando-xp/shared';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function NewTransactionPage() {
  const [apiError, setApiError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [amountInput, setAmountInput] = useState('');

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
  const occurredAtValue = watch('occurredAt');

  const selectedDate = occurredAtValue?.split('T')[0] || '';

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
      setValue('category', availableCategories[0] as TransactionCategory, {
        shouldValidate: true,
      });
    }

    setValue('type', type, { shouldValidate: true });
  };

  const formatCurrencyInput = (rawValue: string) => {
    const onlyDigits = rawValue.replace(/\D/g, '');

    if (!onlyDigits) {
      setAmountInput('');
      setValue('amount', 0, { shouldValidate: true });
      return;
    }

    const numericValue = Number(onlyDigits) / 100;

    setAmountInput(
      numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    setValue('amount', numericValue, { shouldValidate: true });
  };

  const handleDateChange = (date: string) => {
    if (!date) {
      setValue('occurredAt', '', { shouldValidate: true });
      return;
    }

    setValue('occurredAt', `${date}T12:00:00.000Z`, { shouldValidate: true });
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
      setAmountInput('');

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
    <section className="mx-auto w-full max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Nova Transação
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Registre suas movimentações financeiras.
        </p>
      </header>

      {success && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Transação criada com sucesso.
        </div>
      )}

      {apiError && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {apiError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <TransactionTypeToggle
            value={selectedType}
            onChange={handleTypeChange}
            error={errors.type?.message}
          />

          <FormField
            label="Descrição"
            htmlFor="description"
            error={errors.description?.message}
          >
            <input
              {...register('description')}
              id="description"
              type="text"
              placeholder="Ex. Supermercado Mensal"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-300"
            />
          </FormField>

          <FormField
            label="Valor"
            htmlFor="amountInput"
            error={errors.amount?.message}
          >
            <FieldWithRightIcon icon={<DollarSign className="h-4 w-4" />}>
              <input
                id="amountInput"
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={event => formatCurrencyInput(event.target.value)}
                placeholder="0,00"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none focus:border-slate-300"
              />
            </FieldWithRightIcon>
          </FormField>

          <FormField
            label="Data"
            htmlFor="occurredAt"
            error={errors.occurredAt?.message}
          >
            <FieldWithRightIcon icon={<CalendarDays className="h-4 w-4" />}>
              <input
                id="occurredAt"
                type="date"
                value={selectedDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={event => handleDateChange(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none focus:border-slate-300"
              />
            </FieldWithRightIcon>
          </FormField>

          <FormField
            label="Categoria"
            htmlFor="category"
            error={errors.category?.message}
          >
            <FieldWithRightIcon icon={<Tag className="h-4 w-4" />}>
              <select
                {...register('category')}
                id="category"
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none focus:border-slate-300"
              >
                {getAvailableCategories(selectedType).map(category => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </FieldWithRightIcon>
          </FormField>

          <div className="pt-2">
            <div className="flex items-center justify-end gap-3">
              <Link
                href="/transactions"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                <Check className="h-4 w-4" />
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
