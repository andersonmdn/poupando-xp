---
description: 'Plano incremental e mergeável para migrar docs Fastify de Swagger v2 para OpenAPI v3 com baixo risco'
---

# Prompt: Plan (Incremental e Mergeável)

Você é o Copilot responsável por transformar a spec em um plano de execução incremental.
O plano deve minimizar risco de quebra de `/docs` e manter rotas da API intactas.

## Objetivo do plano

Executar migração segura de configuração do `@fastify/swagger` para OpenAPI v3, com fallback claro caso seja detectada incompatibilidade de versão.

## Diretrizes obrigatórias

- [ ] Quebrar em passos pequenos, revisáveis e mergeáveis.
- [ ] Informar arquivos prováveis por passo.
- [ ] Definir teste de validação por passo.
- [ ] Incluir ponto de decisão explícito: seguir com v3 ou aplicar fallback mínimo.

## Estrutura exigida por passo

Para cada passo, incluir:

1. **Nome do passo**
2. **Objetivo**
3. **Mudanças previstas**
4. **Arquivos prováveis**
5. **Como testar**
6. **Critério de pronto**
7. **Risco (baixo/médio/alto)**
8. **Rollback**

## Sequência sugerida

- [ ] Passo 1: Confirmar compatibilidade de versões e mapear estado atual da docs.
- [ ] Passo 2: Aplicar migração de config para `openapi` no servidor Fastify.
- [ ] Passo 3: Ajustar `servers` e `securitySchemes` Bearer para Try it out.
- [ ] Passo 4: Validar `/docs`, rotas protegidas e typecheck/build.
- [ ] Passo 5: Se necessário, executar fallback mínimo sem breaking changes.

## Arquivos prováveis (base)

- [ ] `apps/api/src/index.ts`
- [ ] `apps/api/package.json` (somente se compatibilidade exigir ajuste explícito)
- [ ] `README.md` ou docs correlatas (se houver mudança operacional)

## Estratégia de rollback

- [ ] Manter alterações concentradas em PR pequeno.
- [ ] Rollback por reversão direta do commit de migração de config.
- [ ] Se houver ajuste de dependência, separar em commit próprio para reverter isoladamente.

## Saída esperada

Entregue:

1. **Visão geral do plano e rationale**
2. **Passos detalhados com template completo**
3. **Gate de decisão (v3 vs fallback)**
4. **Plano de validação cumulativa**
5. **Estratégia de rollback consolidada**

## Critério de qualidade

- Plano executável por outra pessoa sem contexto extra.
- Etapas pequenas o suficiente para PR de baixo risco.
- Cobertura explícita de compatibilidade, segurança (Bearer) e docs `/docs`.
