# Componente Input

Um componente de input reutilizável construído com TypeScript, Tailwind CSS e lucide-react.

## ✨ Funcionalidades

- **Label posicionada**: Label sempre acima à esquerda do input
- **Toggle de senha**: Ícone para mostrar/ocultar senha em campos do tipo `password`
- **Estados visuais**: Focus, error, disabled com feedback visual claro
- **Modo escuro**: Suporte completo ao dark mode
- **Acessibilidade**: `forwardRef`, `htmlFor` e navegação por teclado
- **TypeScript**: Tipagem completa com extensão de `InputHTMLAttributes`

## 🎯 Uso básico

```tsx
import { Input } from '@/components/ui/Input';

// Input de texto simples
<Input
  label="Nome completo"
  type="text"
  placeholder="Digite seu nome"
  name="name"
/>

// Input de email
<Input
  label="E-mail"
  type="email"
  placeholder="seu@email.com"
  name="email"
  required
/>

// Input de senha com toggle de visibilidade
<Input
  label="Senha"
  type="password"
  placeholder="Digite sua senha"
  name="password"
  required
/>
```

## 🛠️ Propriedades

| Prop        | Tipo                                    | Obrigatório | Descrição                                   |
| ----------- | --------------------------------------- | ----------- | ------------------------------------------- |
| `label`     | `string`                                | ✅          | Texto do label                              |
| `error`     | `string`                                | ❌          | Mensagem de erro a exibir                   |
| `type`      | `string`                                | ❌          | Tipo do input (text, email, password, etc.) |
| `className` | `string`                                | ❌          | Classes CSS adicionais                      |
| `...props`  | `InputHTMLAttributes<HTMLInputElement>` | ❌          | Todas as props nativas do input HTML        |

## 🎨 Estados visuais

### Normal

```tsx
<Input label="Campo normal" type="text" placeholder="Digite aqui" />
```

### Com erro

```tsx
<Input
  label="Campo com erro"
  type="email"
  error="Email inválido"
  value="email-invalido"
/>
```

### Desabilitado

```tsx
<Input label="Campo desabilitado" type="text" value="Valor fixo" disabled />
```

### Senha com toggle

```tsx
<Input label="Senha" type="password" placeholder="Digite sua senha" />
```

## 🎯 Integração com React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

function MyForm() {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <form>
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Senha"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
    </form>
  );
}
```

## 🎨 Customização visual

O componente usa Tailwind CSS com classes que podem ser sobrescritas:

```tsx
<Input
  label="Campo customizado"
  type="text"
  className="border-2 border-purple-500 focus:ring-purple-400"
/>
```

### Cores do tema

**Modo claro:**

- Background: `bg-white`
- Border: `border-zinc-300` → `border-blue-500` (focus)
- Text: `text-zinc-900`
- Placeholder: `text-zinc-400`

**Modo escuro:**

- Background: `bg-zinc-900`
- Border: `border-zinc-600` → `border-blue-400` (focus)
- Text: `text-zinc-100`
- Placeholder: `text-zinc-500`

**Estados de erro:**

- Border: `border-red-500`
- Ring: `ring-red-500`
- Text: `text-red-600` (dark: `text-red-400`)

## 🔒 Toggle de senha

Para campos `type="password"`, o componente automaticamente:

1. **Adiciona padding à direita** para acomodar o ícone
2. **Renderiza botão de toggle** com ícones `Eye`/`EyeOff`
3. **Alterna entre** `type="password"` e `type="text"`
4. **Mantém acessibilidade** com `tabIndex={-1}` no botão

## 📱 Responsividade

O componente é totalmente responsivo:

- **Mobile**: Padding e tamanhos otimizados para toque
- **Desktop**: Hover states e focus rings apropriados
- **Tablets**: Adaptação automática via Tailwind

## ♿ Acessibilidade

- **Labels associados**: `htmlFor` conecta label ao input
- **Forward refs**: Suporte a `ref` em bibliotecas de formulário
- **Keyboard navigation**: Tab order respeitado
- **Screen readers**: Estrutura semântica correta
- **Alto contraste**: Cores que respeitam WCAG

## 🎭 Demo ao vivo

Visite `/input-demo` para ver todos os estados e tipos de input funcionando.

---

**Dependências**: `lucide-react`, `tailwind-css`, `@/lib/utils`
