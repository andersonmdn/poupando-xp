'use client';

/**
 * Context de Autenticação
 *
 * TUTORIAL: React Context é uma forma de compartilhar estado entre componentes
 * sem precisar passar props manualmente através da árvore de componentes.
 *
 * Este contexto gerencia:
 * - Estado de autenticação do usuário
 * - Funções de login/logout
 * - Loading states
 * - Informações do usuário
 *
 * IMPORTANTE: Marcado como 'use client' porque:
 * - Usa hooks (useState, useEffect, useContext)
 * - Acessa localStorage
 * - Precisa de interatividade
 */

import { apiClient } from '@/lib/api';
import { AuthResponse, User } from '@poupando-xp/shared';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// Tipos para o contexto
interface AuthContextType {
  // Estado
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Ações
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// Criação do contexto com valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook personalizado para usar o contexto de autenticação
 *
 * TUTORIAL: Hooks customizados são uma forma de reutilizar lógica stateful.
 * Este hook encapsula o useContext e adiciona validação.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}

// Props do provider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider do contexto de autenticação
 *
 * TUTORIAL: Um Provider é um componente que fornece o contexto para seus filhos.
 * Coloque este componente no layout raiz para disponibilizar autenticação
 * em toda a aplicação.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estado derivado
  const isAuthenticated = !!user && apiClient.isAuthenticated();

  /**
   * Carrega informações do usuário ao inicializar
   *
   * TUTORIAL: useEffect com array vazio [] executa apenas uma vez,
   * quando o componente é montado. Ideal para inicialização.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // CORREÇÃO: Sincroniza token do localStorage com cookies se existir
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth-token');
          if (token) {
            // Sincroniza com cookie para o middleware
            document.cookie = `auth-token=${token}; path=/; max-age=86400; samesite=lax`;
          }
        }

        if (apiClient.isAuthenticated()) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        // Se token é inválido, remove
        apiClient.clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Função de login
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await apiClient.post<AuthResponse>(
        '/api/v1/auth/login',
        {
          email,
          password,
        }
      );

      // Salva token e usuário
      apiClient.setAuthToken(response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Função de registro
   */
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await apiClient.post<AuthResponse>(
        '/api/v1/auth/register',
        {
          name,
          email,
          password,
        }
      );

      // Salva token e usuário
      apiClient.setAuthToken(response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Função de logout
   */
  const logout = (): void => {
    apiClient.clearAuthToken();
    setUser(null);

    // Redireciona para home
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  /**
   * Atualiza informações do usuário
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await apiClient.get<User>('/api/v1/me');
      setUser(userData);
    } catch (error) {
      // Se falhar, limpa autenticação
      console.error('Erro ao buscar usuário:', error);
      apiClient.clearAuthToken();
      setUser(null);
      throw error;
    }
  };

  // Valor do contexto
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
