---
description: 'Explorar o codebase para mapear todo impacto do renome de financial-notes para poupando-xp, sem alterar código.'
---

# Codebase Exploration — Renome de Projeto

## Objetivo desta etapa

Mapear, com evidências, todos os locais onde `financial-notes` aparece e pode precisar de atualização para `poupando-xp`.

## Instruções para o Copilot

1. Faça uma exploração ampla do monorepo **antes de propor alterações**.
2. Levante ocorrências em:
   - `package.json` (raiz e workspaces), lockfiles e metadados de pacote
   - `README.md`, documentação, badges, changelog, arquivos de contribuição
   - scripts de build/dev/test/release (root e apps/packages)
   - configs de CI/CD (GitHub Actions, pipelines, cache keys, artefatos)
   - Docker/Compose, imagens, nomes de serviços e labels
   - código-fonte (`apps/*`, `packages/*`) incluindo strings, logs, namespaces e identificadores relevantes
3. Identifique o que **não** deve mudar nesta demanda:
   - domínios e URLs externas
   - integrações externas que dependem de endpoint público
4. Liste riscos e dependências:
   - imports quebrados, aliases, nomes de workspace, scripts encadeados
   - impacto em publicação de pacote, deploy, observabilidade e documentação externa
5. Proponha uma abordagem de execução por fases, **sem editar arquivos nesta etapa**.

## Entregáveis obrigatórios

- Inventário de arquivos/locais afetados com contexto
- Matriz de risco (baixo/médio/alto) por área
- Decisões e dúvidas abertas
- Recomendação de ordem de execução

## Checklist

- [ ] Buscou referências textuais e estruturais de `financial-notes`
- [ ] Mapeou `package.json` (name), README, badges e scripts de build
- [ ] Incluiu referências no código (apps e packages)
- [ ] Explicitou exclusões: não alterar domínios/URLs externas
- [ ] Documentou riscos, impactos e estratégia de mitigação
- [ ] Não propôs mudança de código nesta fase
