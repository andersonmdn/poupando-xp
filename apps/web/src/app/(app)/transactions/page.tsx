'use client';

/**
 * Página de Listagem de Transações
 *
 * TUTORIAL: Esta página demonstra conceitos mais avançados:
 *
 * 1. FILTROS E BUSCA: Formulário para filtrar transações
 * 2. PAGINAÇÃO: Navegação entre páginas de resultados
 * 3. ESTADO COMPLEXO: Múltiplos estados interagindo
 * 4. DEBOUNCE: Otimização para evitar muitas requisições
 * 5. URL STATE: Sincronização entre URL e estado (opcional)
 * 6. CRUD OPERATIONS: Ações de editar/deletar
 *
 * Esta é uma página mais complexa que mostra padrões avançados
 * do React e Next.js.
 */

import { Plus, Search, TrendingDown, TrendingUp } from '@/components/ui/icons';
import { apiClient, ApiClientError } from '@/lib/api';
import {
  getCategoryLabel,
  PaginatedResponse,
  Transaction,
  TransactionCategory,
  TransactionType,
} from '@poupando-xp/shared';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface Filters {
  type: TransactionType | '';
  category: TransactionCategory | '';
  fromDate: string;
  toDate: string;
}

export default function TransactionsPage() {
  // Estado das transações
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Estado da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // Estado dos filtros
  const [filters, setFilters] = useState<Filters>({
    type: '',
    category: '',
    fromDate: '',
    toDate: '',
  });

  // Estado para mostrar/ocultar filtros
  const [showFilters, setShowFilters] = useState(false);

  /**
   * TUTORIAL: useCallback para otimizar a função de busca
   *
   * useCallback memoriza a função e só recria quando as dependências mudam.
   * Útil quando a função é passada como prop ou usada em useEffect.
   */
  const loadTransactions = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError('');

        // Constrói query string com filtros
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (filters.type) params.append('type', filters.type);
        if (filters.category) params.append('category', filters.category);
        if (filters.fromDate) params.append('from', filters.fromDate);
        if (filters.toDate) params.append('to', filters.toDate);

        const response = await apiClient.get<PaginatedResponse<Transaction>>(
          `/api/v1/transactions?${params.toString()}`
        );

        setTransactions(response.data);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } catch (error) {
        console.error('Erro ao carregar transações:', error);

        if (error instanceof ApiClientError) {
          setError(error.apiError?.detail || 'Erro ao carregar transações');
        } else {
          setError('Erro inesperado ao carregar transações');
        }
      } finally {
        setLoading(false);
      }
    },
    [filters]
  ); // Dependência: quando filtros mudam, função é recriada

  /**
   * TUTORIAL: useEffect que reage a mudanças nos filtros
   *
   * Sempre que os filtros mudam, carrega os dados novamente.
   * Reseta a página para 1 quando aplica novos filtros.
   */
  useEffect(() => {
    loadTransactions(1);
  }, [loadTransactions]);

  /**
   * TUTORIAL: Handlers para mudanças nos filtros
   */
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      fromDate: '',
      toDate: '',
    });
  };

  /**
   * TUTORIAL: Função para deletar transação
   *
   * Demonstra operação CRUD com confirmação e atualização da lista.
   */
  const handleDelete = async (id: string, description: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${description}"?`)) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/transactions/${id}`);

      // Recarrega a lista após deletar
      await loadTransactions(currentPage);

      // TODO: Implementar toast/notification de sucesso
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      // TODO: Implementar toast/notification de erro
      alert('Erro ao deletar transação');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      {/* Header da página */}
      <section className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Suas Transações</h1>
          <p className="text-secondary">
            {total > 0
              ? `${total} transação${total > 1 ? 'ões' : ''} encontrada${total > 1 ? 's' : ''}`
              : 'Nenhuma transação encontrada'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
          >
            🔍 Filtros
          </button>
          <Link href="/transactions/new" className="btn btn-primary">
            ➕ Nova Transação
          </Link>
        </div>
      </section>

      {/* Filtros */}
      {showFilters && (
        <section className="card mb-6">
          <h3 className="font-semibold mb-4">Filtrar Transações</h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            {/* Filtro por tipo */}
            <div>
              <label className="label">Tipo</label>
              <select
                value={filters.type}
                onChange={e => handleFilterChange('type', e.target.value)}
                className="input"
              >
                <option value="">Todos os tipos</option>
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
              </select>
            </div>

            {/* Filtro por categoria */}
            <div>
              <label className="label">Categoria</label>
              <select
                value={filters.category}
                onChange={e => handleFilterChange('category', e.target.value)}
                className="input"
              >
                <option value="">Todas as categorias</option>
                <option value="SALARY">Salário</option>
                <option value="FREELANCE">Freelance</option>
                <option value="FOOD">Alimentação</option>
                <option value="TRANSPORT">Transporte</option>
                <option value="HEALTH">Saúde</option>
                <option value="EDUCATION">Educação</option>
                <option value="ENTERTAINMENT">Entretenimento</option>
                {/* TODO: Usar enum do shared para gerar opções */}
              </select>
            </div>

            {/* Data inicial */}
            <div>
              <label className="label">Data inicial</label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={e => handleFilterChange('fromDate', e.target.value)}
                className="input"
              />
            </div>

            {/* Data final */}
            <div>
              <label className="label">Data final</label>
              <input
                type="date"
                value={filters.toDate}
                onChange={e => handleFilterChange('toDate', e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={clearFilters} className="btn btn-secondary">
              Limpar Filtros
            </button>
          </div>
        </section>
      )}

      {/* Lista de transações */}
      <section>
        {loading ? (
          <div className="card text-center">
            <p>Carregando transações...</p>
          </div>
        ) : error ? (
          <div className="card text-center">
            <p className="text-error mb-4">⚠️ {error}</p>
            <button
              onClick={() => loadTransactions(currentPage)}
              className="btn btn-primary"
            >
              Tentar novamente
            </button>
          </div>
        ) : transactions.length > 0 ? (
          <>
            {/* Tabela de transações */}
            <div className="card mb-6">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                      }}
                    >
                      <th
                        style={{
                          textAlign: 'left',
                          padding: 'var(--spacing-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Descrição
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: 'var(--spacing-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Categoria
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: 'var(--spacing-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Tipo
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: 'var(--spacing-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Valor
                      </th>
                      <th
                        style={{
                          textAlign: 'center',
                          padding: 'var(--spacing-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Data
                      </th>
                      <th
                        style={{
                          textAlign: 'center',
                          padding: 'var(--spacing-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => (
                      <tr
                        key={transaction.id}
                        style={{
                          borderBottom:
                            '1px solid var(--color-border-secondary)',
                        }}
                      >
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-sm)',
                          }}
                        >
                          <div className="font-medium">
                            {transaction.description}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-sm)',
                          }}
                        >
                          <span className="text-sm">
                            {getCategoryLabel(transaction.category)}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-sm)',
                          }}
                        >
                          <span
                            className={`text-sm ${transaction.type === 'INCOME' ? 'text-success' : 'text-error'}`}
                          >
                            {transaction.type === 'INCOME'
                              ? '📈 Receita'
                              : '📉 Despesa'}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-sm)',
                            textAlign: 'right',
                            fontWeight: '600',
                          }}
                        >
                          <span
                            className={
                              transaction.type === 'INCOME'
                                ? 'text-success'
                                : 'text-error'
                            }
                          >
                            {transaction.type === 'INCOME' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-sm)',
                            textAlign: 'center',
                          }}
                        >
                          <span className="text-sm text-secondary">
                            {formatDate(transaction.occurredAt)}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-sm)',
                            textAlign: 'center',
                          }}
                        >
                          <div className="flex gap-1 justify-center">
                            <Link
                              href={`/transactions/${transaction.id}`}
                              className="text-primary text-sm"
                              style={{ padding: '0.25rem' }}
                              title="Editar"
                            >
                              ✏️
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(
                                  transaction.id,
                                  transaction.description
                                )
                              }
                              className="text-error text-sm"
                              style={{
                                padding: '0.25rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => loadTransactions(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  ← Anterior
                </button>

                <span className="text-sm text-secondary">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => loadTransactions(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center">
            <div
              style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}
            >
              📊
            </div>
            <h3 className="font-semibold mb-2">Nenhuma transação encontrada</h3>
            <p className="text-secondary mb-4">
              {Object.values(filters).some(Boolean)
                ? 'Tente ajustar os filtros ou criar uma nova transação.'
                : 'Comece criando sua primeira transação financeira.'}
            </p>
            <div className="flex gap-2 justify-center">
              {Object.values(filters).some(Boolean) && (
                <button onClick={clearFilters} className="btn btn-secondary">
                  Limpar Filtros
                </button>
              )}
              <Link href="/transactions/new" className="btn btn-primary">
                Nova Transação
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Dicas para melhorias */}
      <section className="mt-8">
        <div
          className="card"
          style={{
            backgroundColor: 'var(--color-background-tertiary)',
            borderStyle: 'dashed',
          }}
        >
          <h3 className="font-semibold mb-4">🔧 Melhorias para implementar</h3>
          <ul className="text-sm text-secondary">
            <li className="mb-2">
              <strong>Busca por texto:</strong> Adicionar campo para buscar na
              descrição
            </li>
            <li className="mb-2">
              <strong>Ordenação:</strong> Clicar nos headers da tabela para
              ordenar
            </li>
            <li className="mb-2">
              <strong>Bulk actions:</strong> Selecionar múltiplas transações e
              deletar
            </li>
            <li className="mb-2">
              <strong>Exportação:</strong> Exportar dados para CSV/Excel
            </li>
            <li className="mb-2">
              <strong>Virtualization:</strong> Para listas muito grandes, usar
              react-window
            </li>
            <li className="mb-2">
              <strong>URL State:</strong> Sincronizar filtros com URL para
              compartilhamento
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
          <Plus className="h-4 w-4" />
          Nova Transação
        </button>
        <span className="inline-flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
          <TrendingUp className="h-4 w-4" /> Receita
        </span>
        <span className="inline-flex items-center gap-2 text-sm text-rose-700 dark:text-rose-300">
          <TrendingDown className="h-4 w-4" /> Despesa
        </span>
        <span className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <Search className="h-4 w-4" /> Buscar
        </span>
      </div>
    </>
  );
}
