# Poupando XP - Frontend (apps/web)

Sistema web para controle financeiro pessoal construído com **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS** e **Lucide React Icons**.

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+
- npm

### Instalação e execução

```bash
# Instalar dependências
cd apps/web
npm install

# Executar em desenvolvimento
npm run dev

# Executar build de produção
npm run build
npm run start
```

A aplicação será executada em: **http://localhost:3000**

## 📦 Dependencies principais

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

## 🎨 Sistema de ícones (Lucide React)

### Importação dos ícones

**Método 1: Importação direta**

```tsx
import { Plus, Search, Trash2 } from 'lucide-react';

function MyComponent() {
  return (
    <button>
      <Plus className="h-4 w-4" />
      Adicionar
    </button>
  );
}
```

**Método 2: Usando componente wrapper Icon**

```tsx
import { Icon } from '@/components/ui/Icon';
import { Plus } from '@/components/ui/icons';

function MyComponent() {
  return (
    <button>
      <Icon as={Plus} size={16} className="text-blue-500" />
      Adicionar
    </button>
  );
}
```

**Método 3: Usando ícones pré-selecionados**

```tsx
import { Plus, Search, Trash2, TrendingUp } from '@/components/ui/icons';
```

### Ícones disponíveis em `@/components/ui/icons`

- `Plus` - Adicionar/Criar
- `Trash2` - Excluir/Deletar
- `Pencil` - Editar/Lápis
- `Search` - Buscar/Pesquisar
- `Filter` - Filtrar
- `Sun` - Modo claro
- `Moon` - Modo escuro
- `ArrowLeft` - Voltar/Seta esquerda
- `LogOut` - Sair/Logout
- `TrendingUp` - Tendência positiva/Receita
- `TrendingDown` - Tendência negativa/Despesa

### Padrões recomendados

**✅ Para ícones em botões:**

```tsx
<button className="inline-flex items-center gap-2">
  <Plus className="h-4 w-4" />
  Texto do botão
</button>
```

**✅ Para ícones indicativos:**

```tsx
<span className="inline-flex items-center gap-2 text-emerald-700">
  <TrendingUp className="h-4 w-4" />
  Receita
</span>
```

**✅ Dark mode com Tailwind:**

```tsx
<Plus className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
```

## 🎨 Sistema de Design

### Cores principais (Tailwind CSS)

- **Zinc**: Cores neutras (`zinc-50`, `zinc-900`)
- **Emerald**: Receitas/Positivo (`emerald-100`, `emerald-700`)
- **Rose**: Despesas/Negativo (`rose-100`, `rose-700`)
- **Blue**: Informações (`blue-700`)

### Tamanhos de ícones

- **Pequeno**: `h-4 w-4` (16px) - Em botões e textos
- **Médio**: `h-5 w-5` (20px) - Em cards e headers
- **Grande**: `h-6 w-6` (24px) - Em títulos e destaque

## 🔧 Desenvolvimento

### Estrutura de diretórios

```
apps/web/src/
├── app/                 # App Router (Next.js 14)
├── components/ui/       # Componentes reutilizáveis
│   ├── Icon.tsx        # Wrapper de ícones
│   └── icons.ts        # Ícones exportados
├── contexts/           # React Contexts
├── lib/               # Utilitários e helpers
└── styles/            # Arquivos CSS
```

### Scripts disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npm run type-check   # Verificação TypeScript
```

### Como remover demos de ícones

Os demos de ícones são marcados com comentários:

```tsx
{
  /*
  ICONS DEMO (removível)
  Objetivo: demonstrar uso do lucide-react com Tailwind
*/
}
```

Para limpar após experimentar, procure e remova estes blocos comentados em todas as páginas.

---

**Stack completa**: Next.js 14 + App Router + TypeScript + Tailwind CSS + Lucide React + React Hook Form + Zod
