---
description: 'Especificação técnica da migração de Swagger v2 para OpenAPI v3 no Fastify, com critérios de aceite e fallback seguro'
---

# Prompt: Spec (Swagger v2 -> OpenAPI v3)

Você é o Copilot responsável por escrever a especificação técnica da mudança.
Baseie-se no resultado da exploração e **não implemente ainda**.

## Contexto

Atualmente o servidor Fastify usa configuração Swagger v2 no plugin `@fastify/swagger`.
Deseja-se migrar para OpenAPI v3 no arquivo do servidor da API, mantendo compatibilidade com Swagger UI em `/docs` e com autenticação Bearer JWT no **Try it out**.

## Objetivo

- Trocar configuração `swagger: { ... }` por `openapi: { ... }`.
- Substituir itens v2 por equivalentes v3:
  - `host/schemes` -> `servers`
  - `securityDefinitions` -> `components.securitySchemes`
  - segurança global -> `security`
- Preservar `info` e `tags` atuais.
- Incluir `servers` para `http://localhost:${config.app.port}` e `http://127.0.0.1:${config.app.port}`.
- Manter o Bearer JWT funcional no Swagger UI.

## Não-objetivos

- Não refatorar rotas da API fora do necessário para docs.
- Não alterar contratos de payload/response das rotas.
- Não introduzir upgrade de major version sem necessidade explícita.

## Assunções

- [ ] O projeto usa versões estáveis de Fastify/plugins compatíveis com OpenAPI v3.
- [ ] A documentação atual em `/docs` já funciona e serve como baseline.
- [ ] O escopo principal está concentrado em `apps/api/src/index.ts`.
- [ ] Se houver incompatibilidade real de versão, será adotada alternativa mínima sem breaking changes.

## Regras de migração

### Deve

- [ ] Usar `openapi` no registro do `@fastify/swagger`.
- [ ] Declarar `servers` para localhost e 127.0.0.1 com `config.app.port`.
- [ ] Declarar `components.securitySchemes.bearerAuth` com tipo Bearer.
- [ ] Declarar `security` global para uso do `bearerAuth`.
- [ ] Manter `info`, `tags` e rota `/docs` operacionais.

### Não deve

- [ ] Quebrar renderização do Swagger UI.
- [ ] Quebrar funcionalidade de rotas da API.
- [ ] Alterar comportamento de autenticação da API (somente docs).

## Critérios de aceite

- [ ] API inicia sem erro com plugins de docs registrados.
- [ ] `/docs` carrega normalmente.
- [ ] Especificação exibida no UI está em OpenAPI v3.
- [ ] Botão **Authorize** aceita token Bearer e requisições autenticadas funcionam no Try it out.
- [ ] Rotas públicas e protegidas continuam documentadas e executáveis.

## Edge cases obrigatórios

- [ ] Ambiente local acessando por `localhost` e por `127.0.0.1`.
- [ ] Falta de token no Try it out em rota protegida (retorno esperado de auth).
- [ ] Headers CORS/Authorization preservados.
- [ ] Compatibilidade de transformações de spec (`transformSpecification`) com v3.

## Fallback obrigatório (se não for 100% seguro)

Se a migração completa para OpenAPI v3 não for comprovadamente segura com as versões atuais:

- [ ] Descrever risco técnico com evidência objetiva.
- [ ] Propor alternativa mínima sem breaking change (ex.: manter v2 e ajustar apenas pontos necessários/documentação).
- [ ] Listar pré-requisitos para realizar migração completa no futuro.

## Plano de validação

- [ ] Subir API local e validar logs de inicialização.
- [ ] Acessar `/docs` e validar carregamento da UI.
- [ ] Executar chamada protegida via Try it out com Bearer.
- [ ] Executar chamada sem token para confirmar comportamento esperado.
- [ ] Rodar `build` e `typecheck` do app API (ou do monorepo, se aplicável).

## Formato da saída esperada

Entregue a spec com seções:

1. **Resumo da mudança**
2. **Escopo e não-escopo**
3. **Assunções e dependências**
4. **Regras técnicas de implementação**
5. **Critérios de aceite testáveis**
6. **Riscos e mitigação/fallback**
7. **Plano de validação**
