'use client';

/**
 * Dashboard Principal - Página protegida
 *
 * TUTORIAL: Esta é a primeira página que o usuário vê após fazer login.
 * Demonstra:
 *
 * 1. PROTEÇÃO DE ROTA: Usuário deve estar autenticado
 * 2. RESUMO FINANCEIRO: Cards com totais e estatísticas
 * 3. LISTAGEM DE DADOS: Transações recentes
 * 4. NAVEGAÇÃO: Links para outras páginas
 * 5. LAYOUT DE APLICAÇÃO: Header com logout, menu lateral
 *
 * PADRÕES IMPORTANTES:
 * - Verificação de autenticação no início
 * - Loading states
 * - Tratamento de erros
 * - Responsive design
 * - Componentização (Card, Header, etc.)
 */

import { useAuth } from '@/contexts/auth';
import { apiClient, ApiClientError } from '@/lib/api';
import { PaginatedResponse, Transaction } from '@financial-notes/shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  // Estado local para dados do dashboard
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionsCount: 0,
  });

  /**
   * TUTORIAL: useEffect para carregar dados na montagem do componente
   *
   * Carrega:
   * 1. Transações recentes
   * 2. Estatísticas financeiras
   *
   * Dependência []: executa apenas uma vez
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Busca transações recentes (últimas 5)
      const recentTransactions = await apiClient.get<
        PaginatedResponse<Transaction>
      >('/api/v1/transactions?pageSize=5&page=1');

      setTransactions(recentTransactions.data);

      // Calcula estatísticas
      // TUTORIAL: Em uma aplicação real, a API deveria fornecer essas estatísticas
      // para evitar processar no frontend. Aqui fazemos localmente para simplificar.
      const income = recentTransactions.data
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = recentTransactions.data
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
        transactionsCount: recentTransactions.pagination.total,
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);

      if (error instanceof ApiClientError) {
        setError(error.apiError?.detail || 'Erro ao carregar dados');
      } else {
        setError('Erro inesperado ao carregar dados');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * TUTORIAL: Formatação de valores monetários
   * Em uma aplicação real, considere usar bibliotrias como Intl.NumberFormat
   * ou react-number-format para formatação mais robusta
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  /**
   * TUTORIAL: Formatação de datas
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  /**
   * TUTORIAL: Loading state
   * Enquanto carrega os dados, mostra um skeleton/loading
   */
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-background-secondary)',
        }}
      >
        <AppHeader user={user} onLogout={logout} />
        <main className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
          <div className="text-center">
            <p>Carregando seus dados...</p>
          </div>
        </main>
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
      {/* Header da aplicação */}
      <AppHeader user={user} onLogout={logout} />

      <main className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
        {/* Saudação */}
        <section className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Olá, {user?.name?.split(' ')[0] || 'Usuário'}! 👋
          </h1>
          <p className="text-secondary">
            Aqui está um resumo das suas finanças.
          </p>
        </section>

        {/* Cards de estatísticas */}
        <section className="mb-8">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-md)',
            }}
          >
            {/* Card Saldo */}
            <div className="card">
              <h3 className="text-sm font-medium text-secondary mb-2">
                Saldo Atual
              </h3>
              <p
                className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-success' : 'text-error'}`}
              >
                {formatCurrency(stats.balance)}
              </p>
            </div>

            {/* Card Receitas */}
            <div className="card">
              <h3 className="text-sm font-medium text-secondary mb-2">
                Total de Receitas
              </h3>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(stats.totalIncome)}
              </p>
            </div>

            {/* Card Despesas */}
            <div className="card">
              <h3 className="text-sm font-medium text-secondary mb-2">
                Total de Despesas
              </h3>
              <p className="text-2xl font-bold text-error">
                {formatCurrency(stats.totalExpense)}
              </p>
            </div>

            {/* Card Transações */}
            <div className="card">
              <h3 className="text-sm font-medium text-secondary mb-2">
                Total de Transações
              </h3>
              <p className="text-2xl font-bold">{stats.transactionsCount}</p>
            </div>
          </div>
        </section>

        {/* Ações rápidas */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="flex gap-4">
            <Link href="/transactions/new" className="btn btn-primary">
              ➕ Nova Transação
            </Link>
            <Link href="/transactions" className="btn btn-secondary">
              📊 Ver Todas as Transações
            </Link>
          </div>
        </section>

        {/* Transações recentes */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Transações Recentes</h2>
            <Link href="/transactions" className="text-primary text-sm">
              Ver todas →
            </Link>
          </div>

          {/* Lista de transações */}
          {error ? (
            <div className="card">
              <p className="text-error">⚠️ {error}</p>
              <button
                onClick={loadDashboardData}
                className="btn btn-primary mt-4"
              >
                Tentar novamente
              </button>
            </div>
          ) : transactions.length > 0 ? (
            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr
                      style={{ borderBottom: '1px solid var(--color-border)' }}
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
                          textAlign: 'right',
                          padding: 'var(--spacing-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Data
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
                          <span className="text-sm text-secondary">
                            {transaction.category}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-sm)',
                            textAlign: 'right',
                            fontWeight: '500',
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
                            textAlign: 'right',
                          }}
                        >
                          <span className="text-sm text-secondary">
                            {formatDate(transaction.occurredAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <div
                style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}
              >
                📊
              </div>
              <h3 className="font-semibold mb-2">Nenhuma transação ainda</h3>
              <p className="text-secondary mb-4">
                Comece registrando sua primeira receita ou despesa.
              </p>
              <Link href="/transactions/new" className="btn btn-primary">
                Criar primeira transação
              </Link>
            </div>
          )}
        </section>

        {/* Próximos passos */}
        <section className="mt-8">
          <div
            className="card"
            style={{
              backgroundColor: 'var(--color-background-tertiary)',
              borderStyle: 'dashed',
            }}
          >
            <h3 className="font-semibold mb-4">
              🚀 Próximos passos para aprender
            </h3>
            <ul className="text-sm text-secondary">
              <li className="mb-2">
                <strong>Componentes:</strong> Extrair cards e tabela para
                componentes reutilizáveis
              </li>
              <li className="mb-2">
                <strong>Hooks customizados:</strong> Criar useTransactions()
                para gerenciar estado
              </li>
              <li className="mb-2">
                <strong>Otimização:</strong> Implementar cache, React Query ou
                SWR
              </li>
              <li className="mb-2">
                <strong>Melhorias UX:</strong> Skeleton loading, paginação,
                filtros
              </li>
              <li className="mb-2">
                <strong>Gráficos:</strong> Adicionar Chart.js ou Recharts para
                visualizações
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

/**
 * TUTORIAL: Componente Header reutilizável
 *
 * Este componente pode ser extraído para um arquivo separado
 * e usado em todas as páginas da aplicação.
 */
interface AppHeaderProps {
  user: any;
  onLogout: () => void;
}

function AppHeader({ user, onLogout }: AppHeaderProps) {
  return (
    <header
      style={{
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-md) 0',
      }}
    >
      <div className="container">
        <nav className="flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              💰 Financial Notes
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/transactions" className="text-secondary">
              Transações
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary">{user?.name}</span>
              <button
                onClick={onLogout}
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
  );
}
