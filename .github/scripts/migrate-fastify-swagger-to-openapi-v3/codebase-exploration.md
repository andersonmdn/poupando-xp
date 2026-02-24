---
description: 'Exploração de codebase para migração segura de @fastify/swagger (Swagger v2) para OpenAPI v3 no servidor Fastify'
---

# Prompt: Codebase Exploration (Swagger v2 -> OpenAPI v3)

Você é o Copilot atuando como engenheiro sênior de diagnóstico técnico.
**Não implemente mudanças ainda.**
Seu objetivo é explorar o monorepo e validar viabilidade da migração de configuração de documentação da API no Fastify.

## Contexto do objetivo

Migrar a configuração do plugin `@fastify/swagger` de Swagger v2 (`swagger`) para OpenAPI v3 (`openapi`) no servidor da API, mantendo:

- documentação em `/docs` com `@fastify/swagger-ui`
- `info` e `tags` atuais
- autenticação Bearer JWT funcional no botão **Try it out**
- compatibilidade com versões atuais do projeto, sem quebrar rotas nem docs

## Instruções obrigatórias

- [ ] Explorar primeiro a estrutura do monorepo e os pontos de integração API/Web.
- [ ] Mapear versões e compatibilidade dos pacotes Fastify/Swagger instalados.
- [ ] Identificar exatamente onde a config Swagger v2 está sendo usada hoje.
- [ ] Não alterar código nesta etapa.

## O que investigar (checklist)

### 1) Versões e compatibilidade de plugins

- [ ] Conferir versões de `fastify`, `@fastify/swagger` e `@fastify/swagger-ui` em `apps/api/package.json`.
- [ ] Confirmar na tipagem e/ou docs locais se a versão aceita `openapi` com `servers`, `components.securitySchemes` e `security`.
- [ ] Verificar se há limitações conhecidas de versão que impeçam migração 100% segura.

### 2) Configuração atual do servidor

- [ ] Mapear `apps/api/src/index.ts` (registro de plugins `swagger` e `swaggerUI`).
- [ ] Localizar uso de campos Swagger v2 (`host`, `schemes`, `consumes`, `produces`, `securityDefinitions`).
- [ ] Verificar se há transformações (`transformSpecification`) que dependem de formato v2.

### 3) Contratos e segurança

- [ ] Mapear como o esquema Bearer está declarado hoje e como será equivalente em OpenAPI v3.
- [ ] Verificar uso de `security` global e por rota.
- [ ] Confirmar se rotas protegidas e plugin de auth dependem de algo específico na documentação atual.

### 4) Impacto funcional e riscos

- [ ] Avaliar risco de quebra no Swagger UI em `/docs`.
- [ ] Avaliar risco de perda de compatibilidade no Try it out (header `Authorization: Bearer <token>`).
- [ ] Avaliar risco de quebra em geração/renderização de schemas das rotas.
- [ ] Avaliar impacto em ambientes `localhost` e `127.0.0.1` com `config.app.port`.

## Riscos a levantar explicitamente

- [ ] Incompatibilidade de versão dos plugins com `openapi`.
- [ ] Mudança de comportamento da autenticação no Swagger UI.
- [ ] Diferenças de spec gerada que afetem docs existentes.
- [ ] Necessidade de fallback para alternativa mínima sem breaking changes.

## Saída esperada

Entregue um relatório com:

1. **Resumo executivo** (viável agora ou não)
2. **Inventário de arquivos/pontos afetados**
3. **Matriz de compatibilidade por versão**
4. **Riscos por severidade (alto/médio/baixo)**
5. **Recomendação técnica**:
   - Migração completa para OpenAPI v3, **ou**
   - Alternativa mínima segura sem breaking changes
6. **Próximos passos sugeridos (sem implementar)**

## Critério de qualidade

- Basear conclusões em evidências do repositório (arquivos, versões, tipos).
- Não assumir compatibilidade sem validação.
- Priorizar segurança de mudança e preservação de rotas/docs.
