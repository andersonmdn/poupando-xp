/**
 * Cliente HTTP para comunicação com a API
 *
 * TUTORIAL: Este é um wrapper sobre fetch() que adiciona funcionalidades:
 * - Base URL automática
 * - Headers padrão
 * - Autenticação automática
 * - Tratamento de erros
 * - Tipos TypeScript
 *
 * Usar este client em vez de fetch() diretamente garante consistência
 * e facilita manutenção.
 */

import { ApiError } from '@financial-notes/shared';

// Configuração base da API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://172.26.141.51:3004';
console.log('📡 API Base URL:', API_BASE_URL);

/**
 * Classe de erro personalizada para erros da API
 */
export class ApiClientError extends Error {
  constructor(
    public status: number,
    public apiError?: ApiError
  ) {
    super(apiError?.title || 'Erro na API');
    this.name = 'ApiClientError';
  }
}

/**
 * Cliente HTTP para a API
 */
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove barra final
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Obtém o token de autenticação
   *
   * NOTA: Aqui implementamos localStorage, mas em produção considere:
   * - HttpOnly cookies (mais seguro)
   * - Refresh tokens
   * - Expiração automática
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null; // SSR
    return localStorage.getItem('auth-token');
  }

  /**
   * Configura headers para autenticação
   */
  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Executa uma requisição HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Se resposta é 204 No Content, retorna objeto vazio
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiClientError(response.status, data as ApiError);
      }

      return data as T;
    } catch (error) {
      console.error('Erro na requisição:', error);
      // Se erro de rede ou parsing
      if (!(error instanceof ApiClientError)) {
        throw new ApiClientError(0, {
          type: 'network-error',
          title: 'Erro de conexão',
          status: 0,
          detail: 'Não foi possível conectar com o servidor',
        });
      }

      throw error;
    }
  }

  /**
   * Métodos HTTP públicos
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const options: RequestInit = {
      method: 'POST',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, options);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const options: RequestInit = {
      method: 'PUT',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, options);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Salva token de autenticação
   */
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);

      // CORREÇÃO: Também salva no cookie para o middleware poder acessar
      // Configura cookie com httpOnly=false para JavaScript poder acessar
      document.cookie = `auth-token=${token}; path=/; max-age=86400; samesite=lax`;
    }
  }

  /**
   * Remove token de autenticação
   */
  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');

      // CORREÇÃO: Remove também o cookie
      document.cookie =
        'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

/**
 * Instância singleton do client
 * Use esta instância em toda a aplicação
 */
export const apiClient = new ApiClient();
