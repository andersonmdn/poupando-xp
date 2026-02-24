---
description: 'Plano incremental e mergeável para executar o renome de financial-notes para poupando-xp com baixo risco.'
---

# Plano de Execução Incremental

## Diretriz geral

Executar em passos pequenos, com commits revisáveis e validação ao final de cada etapa.

## Passo 1 — Inventário final e baseline

**Objetivo:** consolidar ocorrências e congelar escopo.

Arquivos prováveis:

- `README.md`
- `package.json` (raiz + workspaces)
- configs de CI/CD, Docker e scripts
- `apps/**`, `packages/**`

Teste deste passo:

- [ ] Lista de ocorrências revisada e categorizada
- [ ] Escopo fechado com exclusões explícitas (URLs externas)

## Passo 2 — Metadados e documentação

**Objetivo:** atualizar branding em metadados e docs públicos.

Arquivos prováveis:

- `package.json`
- `README.md`
- badges e docs correlatas

Teste deste passo:

- [ ] Sem `financial-notes` em metadados/docs alvo
- [ ] Links e badges seguem válidos (sem alterar domínio externo)

## Passo 3 — Scripts de build e automações

**Objetivo:** ajustar scripts que mencionam o nome antigo.

Arquivos prováveis:

- `package.json` scripts
- CI workflows
- scripts auxiliares de build/release

Teste deste passo:

- [ ] `pnpm build` executa
- [ ] Pipelines locais/simuladas sem quebra por rename

## Passo 4 — Referências no código

**Objetivo:** atualizar strings/nomes internos estritamente no escopo.

Arquivos prováveis:

- `apps/**`
- `packages/**`

Teste deste passo:

- [ ] Busca global sem ocorrências indevidas remanescentes
- [ ] App sobe com `pnpm dev` sem erro novo de rename

## Passo 5 — Validação final e PR

**Objetivo:** consolidar qualidade e evidências.

Teste deste passo:

- [ ] Build, lint e typecheck concluídos
- [ ] Diff auditado para ausência de mudanças fora de escopo
- [ ] PR com resumo, riscos e checklist preenchido

## Estratégia de rollback

- Reverter por passo/commit (granular) para minimizar impacto.
- Se quebra em build/pipeline, reverter apenas o passo problemático.
- Manter inventário de ocorrências para reaplicar ajustes com segurança.
