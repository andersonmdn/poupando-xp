---
description: 'Especificar a mudança de renome para poupando-xp com critérios de aceite, regras de escopo e validação.'
---

# Spec — Renome `financial-notes` → `poupando-xp`

## Contexto

O projeto precisa padronizar o nome para `poupando-xp` em metadados, documentação e referências internas de código.

## Objetivo

Atualizar ocorrências de `financial-notes` para `poupando-xp` em:

- `package.json` (`name`)
- README e badges
- scripts de build
- referências no código

## Não-objetivos

- Não alterar domínios/URLs externas nesta entrega
- Não redesenhar arquitetura, pipelines ou features além do necessário para o renome

## Regras de renome

1. Substituir somente identificadores ligados ao nome do projeto.
2. Preservar valores técnicos sem relação com branding (ex.: nomes de variáveis genéricas não relacionadas).
3. Em scripts, atualizar rótulos/comandos quando o nome antigo estiver explícito.
4. Evitar mudanças colaterais não requeridas.
5. Se houver ambiguidade, priorizar mudança mínima e registrar em “Assunções”.

## Critérios de aceite

- [ ] `name` em `package.json` relevantes atualizado para `poupando-xp`
- [ ] README e badges sem referência remanescente a `financial-notes`
- [ ] Scripts de build atualizados quando citam o nome antigo
- [ ] Referências internas no código revisadas/atualizadas conforme escopo
- [ ] Nenhuma URL/domínio externo foi alterado
- [ ] Build/lint/typecheck executam sem regressão causada pelo renome

## Edge cases

- Workspaces com nomes distintos por pacote (evitar renome indevido)
- Badges com texto e URL separados (mudar apenas texto quando aplicável)
- Scripts que concatenam nomes dinamicamente
- Strings históricas em docs (manter se forem contexto histórico e não branding atual)

## Plano de validação

1. Rodar `pnpm build`
2. Rodar `pnpm lint` (ou equivalente no workspace)
3. Rodar typecheck (`pnpm -r typecheck` se disponível)
4. Validar execução local (`pnpm dev`) e inicialização de apps principais
5. Revisar diff focando apenas no escopo definido

## Assunções

- O nome canônico desejado é exatamente `poupando-xp`.
- O renome deve cobrir todo o monorepo, respeitando o escopo acima.
- URLs e domínios externos permanecem intactos por ora, mesmo se contiverem o nome antigo.
