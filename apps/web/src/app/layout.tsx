/**
 * Layout raiz da aplicação
 *
 * TUTORIAL: Este é o layout principal que envolve TODAS as páginas da aplicação.
 * No App Router do Next.js:
 *
 * 1. layout.tsx é obrigatório na pasta app/
 * 2. Ele define a estrutura HTML básica
 * 3. Envolve todas as páginas com providers, headers, footers, etc.
 * 4. É um SERVER COMPONENT por padrão (roda no servidor)
 *
 * Aqui configuramos:
 * - HTML base (html, body)
 * - Metadados da página
 * - Providers globais (Autenticação)
 * - Estilos globais
 */

import { AuthProvider } from '@/contexts/auth';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Configuração da fonte Inter do Google Fonts
// TUTORIAL: Next.js otimiza automaticamente as fontes do Google
const inter = Inter({ subsets: ['latin'] });

/**
 * Metadados da aplicação
 * TUTORIAL: No App Router, metadados são configurados através do objeto metadata
 * ou da função generateMetadata() para metadados dinâmicos.
 */
export const metadata: Metadata = {
  title: 'Financial Notes - Controle suas finanças',
  description:
    'Sistema simples e eficiente para controle de gastos e receitas pessoais',
  keywords: [
    'finanças',
    'controle financeiro',
    'gastos',
    'receitas',
    'orçamento',
  ],
  authors: [{ name: 'Desenvolvedor' }],
};

/**
 * TUTORIAL: Nova Viewport API do Next.js 14
 *
 * No Next.js 14, viewport foi separado de metadata
 * para melhor otimização e type safety.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/**
 * Componente de layout raiz
 *
 * TUTORIAL: Este é um Server Component, o que significa:
 * - Executa no servidor durante o build/request
 * - Não tem acesso a hooks do React ou eventos do browser
 * - Ideal para buscar dados, SEO, performance
 * - Pode renderizar Client Components como filhos
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      {/* 
        DARK MODE: Para testar Tailwind dark mode, adicione class="dark" na linha acima:
        <html lang="pt-BR" className="dark">
      */}
      <body className={inter.className}>
        {/* 
          TUTORIAL: AuthProvider é um Client Component ('use client')
          Ele pode ser renderizado por um Server Component sem problemas.
          
          Boundary entre Server e Client Components:
          - Server Component pode renderizar Client Components
          - Client Component NÃO pode renderizar Server Components
          - Comunicação via props apenas
        */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
