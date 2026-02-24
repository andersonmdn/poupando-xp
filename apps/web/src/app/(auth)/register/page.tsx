'use client';

/**
 * Página de Registro
 *
 * TUTORIAL: Similar à página de login, mas com campos adicionais.
 * Demonstra:
 * 1. Formulário mais complexo (nome + email + senha)
 * 2. Validação de confirmação de senha
 * 3. Feedback de sucesso/erro
 * 4. Reutilização de padrões (mesmo layout, mesmo hook form)
 *
 * Compare esta página com login.tsx para ver as semelhanças
 * e diferenças. Note como os padrões se repetem.
 */

import { Filter, Pencil, Plus } from '@/components/ui/icons';
import { useAuth } from '@/contexts/auth';
import { ApiClientError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterDTO, registerSchema } from '@poupando-xp/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [apiError, setApiError] = useState<string>('');

  /**
   * TUTORIAL: Mesma configuração do login, mas com schema diferente
   * registerSchema valida name, email e password
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterDTO) => {
    try {
      setApiError('');

      // Chama a função de registro do contexto
      await registerUser(data.name, data.email, data.password);

      // Se chegou aqui, registro foi bem-sucedido
      // O contexto já atualizou o estado do usuário
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiClientError) {
        setApiError(
          error.apiError?.detail ||
            error.apiError?.title ||
            'Erro ao criar conta'
        );
      } else {
        setApiError('Erro inesperado. Tente novamente.');
      }

      console.error('Erro no registro:', error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background-secondary)',
        padding: 'var(--spacing-md)',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">
            💰 Poupando XP
          </h1>
          <h2 className="text-xl font-semibold mb-2">Criar nova conta</h2>
          <p className="text-secondary">
            Comece a controlar suas finanças hoje
          </p>
        </div>

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
            {apiError}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo Nome */}
          <div className="mb-4">
            <label htmlFor="name" className="label">
              Nome completo
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="input"
              placeholder="Seu nome completo"
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-error text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          {/* Campo Email */}
          <div className="mb-4">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="input"
              placeholder="seu@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-error text-sm mt-2">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Senha */}
          <div className="mb-6">
            <label htmlFor="password" className="label">
              Senha
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="input"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-error text-sm mt-2">
                {errors.password.message}
              </p>
            )}
            <p className="text-sm text-secondary mt-2">
              A senha deve ter pelo menos 6 caracteres.
            </p>
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta gratuita'}
          </button>

          {/* Link para login */}
          <p className="text-center text-secondary">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary font-medium">
              Fazer login
            </Link>
          </p>
        </form>

        {/* Informações adicionais */}
        <div
          style={{
            marginTop: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-background-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '0.875rem',
          }}
        >
          <p className="font-medium text-secondary mb-2">
            ✨ Ao criar sua conta você terá:
          </p>
          <ul className="text-sm text-secondary">
            <li>• Controle completo de receitas e gastos</li>
            <li>• Categorização automática</li>
            <li>• Relatórios financeiros simples</li>
            <li>• Dados seguros e privados</li>
          </ul>
        </div>

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
            <Filter className="h-4 w-4" /> Filtrar
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Pencil className="h-4 w-4" /> Editar
          </span>
        </div>
      </div>
    </div>
  );
}
