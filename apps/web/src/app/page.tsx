/**
 * Página inicial da aplicação
 *
 * TUTORIAL: Esta é a página raiz (/) da aplicação.
 * No App Router do Next.js:
 *
 * 1. page.tsx em app/ representa a rota "/"
 * 2. É um SERVER COMPONENT por padrão
 * 3. Executa no servidor, ideal para SEO e performance
 * 4. Pode buscar dados diretamente (fetch, banco, etc.)
 * 5. Não tem acesso a hooks ou eventos do browser
 *
 * Esta é uma landing page simples que apresenta o sistema
 * e direciona para login/registro.
 */

import { Plus, Search, TrendingUp } from '@/components/ui/icons';
import Link from 'next/link';

/**
 * TUTORIAL: Componente Server Component
 * - Executa no servidor
 * - Ideal para conteúdo estático, SEO
 * - Pode fazer fetch de dados assíncronos
 * - Renderiza HTML no servidor
 */
export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-background-secondary)',
      }}
    >
      {/* Header simples */}
      <header
        style={{
          padding: 'var(--spacing-md) 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <nav className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-primary">
                💰 Poupando XP
              </h1>
              <p className="text-sm text-secondary">
                Controle suas finanças de forma simples
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/login" className="btn btn-secondary">
                Entrar
              </Link>
              <Link href="/register" className="btn btn-primary">
                Criar Conta
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main style={{ flex: 1, padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          {/* Hero Section */}
          <section className="text-center mb-8">
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--color-text-primary)',
              }}
            >
              Organize suas finanças
              <br />
              <span className="text-primary">de forma inteligente</span>
            </h2>

            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                maxWidth: '600px',
                margin: '0 auto var(--spacing-xl) auto',
              }}
            >
              Registre seus gastos e ganhos, visualize relatórios e tenha
              controle total sobre seu dinheiro.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="btn btn-primary"
                style={{
                  fontSize: '1rem',
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                }}
              >
                Começar Gratuitamente
              </Link>
              <Link
                href="/login"
                className="btn btn-secondary"
                style={{
                  fontSize: '1rem',
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                }}
              >
                Já tenho conta
              </Link>
            </div>
          </section>

          {/* Features */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--spacing-xl)',
              marginTop: 'var(--spacing-2xl)',
            }}
          >
            <div className="card text-center">
              <div
                style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}
              >
                📊
              </div>
              <h3 className="text-lg font-semibold mb-2">Controle de Gastos</h3>
              <p className="text-secondary">
                Registre e categorize todos os seus gastos para entender para
                onde vai seu dinheiro.
              </p>
            </div>

            <div className="card text-center">
              <div
                style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}
              >
                💳
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Registro de Receitas
              </h3>
              <p className="text-secondary">
                Acompanhe todas as suas fontes de renda e veja o crescimento da
                sua receita.
              </p>
            </div>

            <div className="card text-center">
              <div
                style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}
              >
                📈
              </div>
              <h3 className="text-lg font-semibold mb-2">Relatórios Simples</h3>
              <p className="text-secondary">
                Visualize seus dados financeiros com relatórios claros e
                objetivos.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section
            className="text-center"
            style={{ marginTop: 'var(--spacing-2xl)' }}
          >
            <div
              className="card"
              style={{
                maxWidth: '500px',
                margin: '0 auto',
                background:
                  'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                color: 'var(--color-text-inverse)',
                border: 'none',
              }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Pronto para começar?
              </h3>
              <p className="mb-6" style={{ opacity: 0.9 }}>
                Crie sua conta gratuita e comece a organizar suas finanças hoje
                mesmo.
              </p>
              <Link
                href="/register"
                className="btn"
                style={{
                  backgroundColor: 'white',
                  color: 'var(--color-primary)',
                  borderColor: 'white',
                  fontWeight: '600',
                }}
              >
                Criar Conta Gratuita
              </Link>
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
              Novo
            </button>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <Search className="h-4 w-4" /> Buscar
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="h-4 w-4" /> Crescimento
            </span>
          </div>
        </div>
      </main>

      {/* Footer simples */}
      <footer
        style={{
          padding: 'var(--spacing-lg) 0',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-background)',
        }}
      >
        <div className="container">
          <div className="text-center text-secondary">
            <p>
              &copy; 2024 Poupando XP. Feito com ❤️ para aprender Next.js
            </p>
            <p className="text-sm mt-2">
              Stack: Next.js 14 + App Router + TypeScript + Fastify + PostgreSQL
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
