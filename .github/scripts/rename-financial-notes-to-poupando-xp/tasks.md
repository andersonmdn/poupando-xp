---
description: 'Checklist atômico de execução e PR para renomear financial-notes para poupando-xp com validação objetiva.'
---

# Tasks — Execução

## Tarefas atômicas

- [x] Confirmar escopo: renomear `financial-notes` → `poupando-xp`
- [x] Garantir exclusão explícita: não alterar domínios/URLs externas
- [x] Atualizar `name` em `package.json` aplicáveis
- [x] Atualizar README e badges que exibem o nome do projeto
- [x] Atualizar scripts de build com referência ao nome antigo
- [x] Atualizar referências no código dentro de `apps/*` e `packages/*`
- [x] Revisar CI/CD, Docker e automações por menções textuais ao nome antigo
- [x] Executar busca final e validar que não restaram ocorrências fora das exceções

## Checklist de qualidade técnica

- [x] `pnpm build`
- [x] `pnpm lint` (ou equivalente)
- [x] typecheck (`pnpm -r typecheck` se disponível)
- [x] `pnpm dev` sobe sem erro novo relacionado ao renome

## Checklist de PR

- [x] Escopo descrito com clareza
- [x] Não-objetivos registrados (URLs externas preservadas)
- [x] Evidências de validação incluídas (comandos + resultado)
- [x] Riscos e mitigação documentados
- [x] Diff revisado para evitar mudanças fora de escopo

## Observações de validação final

- Evidências executadas: `pnpm build`, `pnpm lint`, `pnpm -r type-check`, `pnpm prisma:generate` e `pnpm dev` (API + Web iniciando com sucesso).
- Risco/mitigação principal: erros pré-existentes de configuração (Swagger/ESLint/Prisma Client) foram corrigidos para não mascarar a validação do renome.
- Se persistirem ocorrências em contexto histórico/documental, justificar no PR.
- Se alguma ocorrência for ambígua, aplicar mudança mínima e registrar decisão.
- Antes do merge, confirmar consistência do nome `poupando-xp` em toda a superfície de produto no escopo definido.
