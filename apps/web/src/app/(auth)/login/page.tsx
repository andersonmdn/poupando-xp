'use client';

import { HandCoins, LogIn, PersonStanding } from '@/components/ui/icons';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/auth';
import { ApiClientError } from '@/lib/api';
import { LoginDTO, loginSchema } from '@financial-notes/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const { login } = useAuth();
  const [apiError, setApiError] = useState<string>('');

  /**
   * TUTORIAL: Configuração do React Hook Form
   *
   * useForm() retorna métodos para gerenciar o formulário:
   * - register: registra campos no formulário
   * - handleSubmit: wrapper para onSubmit com validação
   * - formState: estado do formulário (errors, isSubmitting, etc.)
   * - reset: limpa o formulário
   *
   * resolver: zodResolver(schema) integra validação Zod
   */
  const {
    register,
    handleSubmit,
    // formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    // Valores padrão (opcional)
    defaultValues: {
      email: 'teste@example.com',
      password: '123456',
    },
  });

  /**
   * Handler do submit do formulário
   *
   * TUTORIAL: Esta função é chamada apenas se a validação Zod passar.
   * Os dados já vêm validados e tipados como LoginDTO.
   */
  const onSubmit = async (data: LoginDTO) => {
    try {
      // Limpa erro anterior
      setApiError('');

      // Chama a função de login do contexto
      await login(data.email, data.password);

      // Se chegou aqui, login foi bem-sucedido
      // Redireciona para a página solicitada ou dashboard
      router.push(redirectTo);
    } catch (error) {
      // Trata erros da API
      if (error instanceof ApiClientError) {
        setApiError(
          error.apiError?.detail ||
            error.apiError?.title ||
            'Erro ao fazer login'
        );
      } else {
        setApiError('Erro inesperado. Tente novamente.');
      }

      console.error('Erro no login:', error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-blue-950">
      <div className="w-1/2 min-h-screen flex items-center justify-center flex-col rounded-xs">
        <div className="w-full flex-1 flex items-center justify-center gap-4">
          <div className="flex min-w-md">
            <span className="h-10 w-10 rounded-md bg-blue-500 flex items-center justify-center">
              <HandCoins className="h-6 w-6 text-white" />
            </span>
            <span className="text-lg font-semibold text-white px-3 py-2">
              FinTrack
            </span>
          </div>
        </div>
        <div className="w-full flex-4 flex items-center justify-center">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold text-white">
              Domine seu Dinheiro de forma inteligente.
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
              ratione nulla ea quod fugit quasi debitis quaerat ad quibusdam
              magni at earum et labore sunt, necessitatibus distinctio atque
              consequuntur accusamus!
            </p>
          </div>
        </div>
        <div className="w-full flex-1 flex items-center justify-center">
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-900">
              <PersonStanding className="inline-block h-5 w-5 mr-1 text-white" />
            </div>
            Controle financeiro fácil e eficiente para todos.
          </span>
        </div>
      </div>

      <div className="w-1/2 min-h-screen flex items-center justify-center flex-col bg-gray-900">
        <div className="flex items-center justify-items-start flex-col w-1/2">
          <span className="w-full text-3xl font-bold text-white">
            Bem Vindo!
          </span>
          <span className="w-full text-gray-400">
            Não tem uma conta?{' '}
            <a href="/register" className="text-blue-500">
              Cadastre-se
            </a>
          </span>
        </div>
        <div className="mt-5 space-y-5 w-1/2">
          <Input
            {...register('email', { required: true })}
            label="Email"
            type="email"
            placeholder="Digite seu email"
            name="email"
            required
          />
          <Input
            {...register('password', { required: true })}
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            name="password"
            required
          />
          {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}
        </div>
        <div className="mt-5 space-y-5 w-1/2">
          <button
            className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={handleSubmit(onSubmit)}
          >
            Entrar
            <LogIn className="inline-block h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
