import { Input } from '@/components/ui/Input';

export default function InputDemo() {
  return (
    <div className="max-w-md mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
        Demo do Componente Input
      </h1>

      {/* Input de texto normal */}
      <Input
        label="Nome completo"
        type="text"
        placeholder="Digite seu nome"
        name="name"
      />

      {/* Input de email */}
      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        name="email"
      />

      {/* Input de senha com toggle */}
      <Input
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        name="password"
      />

      {/* Input de senha com toggle e erro */}
      <Input
        label="Confirmar senha"
        type="password"
        placeholder="Confirme sua senha"
        name="confirmPassword"
        error="As senhas não coincidem"
      />

      {/* Input com erro */}
      <Input
        label="Username"
        type="text"
        placeholder="Escolha um username"
        name="username"
        error="Este username já está em uso"
      />

      {/* Input desabilitado */}
      <Input
        label="Campo desabilitado"
        type="text"
        value="Valor fixo"
        disabled
        name="disabled"
      />

      <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-md">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Funcionalidades:
        </h2>
        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>• Label posicionada acima à esquerda</li>
          <li>• Toggle de visibilidade para senhas</li>
          <li>• Suporte a mensagens de erro</li>
          <li>• Estados disabled e focus</li>
          <li>• Suporte ao modo escuro</li>
          <li>• Acessibilidade (htmlFor, forwardRef)</li>
        </ul>
      </div>
    </div>
  );
}