---
description: 'Checklist de tarefas atômicas para migração Swagger v2 -> OpenAPI v3 no Fastify com validação e PR checklist'
---

# Prompt: Tasks (Execução + PR Checklist)

Você é o Copilot responsável por decompor o plano em tarefas objetivas e verificáveis.
As tarefas devem cobrir implementação, validação funcional e segurança de rollback.

## Objetivo

Entregar a migração de docs para OpenAPI v3 sem quebrar `/docs`, sem impactar rotas e mantendo Bearer JWT funcional no Try it out.

## Instruções obrigatórias

- [ ] Derivar tarefas diretamente da exploração, spec e plan.
- [ ] Criar tarefas atômicas (ideal: 15–60 min cada).
- [ ] Associar cada tarefa a um critério objetivo de conclusão.
- [ ] Incluir trilha de fallback quando migração completa não for segura.

## Checklist de tarefas (modelo)

### A. Preparação e compatibilidade

- [x] `T1` Validar versões de `fastify`, `@fastify/swagger` e `@fastify/swagger-ui`.
- [x] `T2` Confirmar suporte a `openapi` + `components.securitySchemes` na versão atual.
- [x] `T3` Registrar baseline de comportamento atual em `/docs`.

### B. Migração de configuração

- [x] `T4` Substituir bloco `swagger` por bloco `openapi` no servidor.
- [x] `T5` Configurar `servers` para localhost e 127.0.0.1 com `config.app.port`.
- [x] `T6` Configurar `components.securitySchemes.bearerAuth` e `security` global.

### C. Validação funcional

- [x] `T7` Subir API e verificar ausência de erros de registro dos plugins.
- [x] `T8` Validar carregamento de `/docs` no browser.
- [x] `T9` Validar Try it out com token Bearer em rota protegida.
- [x] `T10` Validar comportamento sem token em rota protegida.
- [x] `T11` Rodar `build`/`typecheck` do escopo API. _(executado; falha por erros TypeScript pré-existentes em `src/routes/transactions.ts`, fora do escopo desta migração)_

### D. Fallback (se necessário)

- [ ] `T12` Caso incompatível, documentar risco e evidência.
- [ ] `T13` Aplicar alternativa mínima sem breaking changes.
- [ ] `T14` Registrar pré-condições para migração completa futura.

### E. Documentação

- [x] `T15` Atualizar documentação relevante (se houve ajuste de operação).
- [x] `T16` Registrar resultado final: v3 aplicado ou fallback adotado. _(resultado: OpenAPI v3 aplicado com sucesso em `apps/api/src/index.ts`; fallback não necessário)_

## Checklist de PR (obrigatório)

- [ ] Escopo restrito à configuração de documentação da API.
- [ ] Sem alterações de comportamento funcional das rotas.
- [ ] `/docs` validado manualmente.
- [ ] Try it out com Bearer validado.
- [ ] `build` e `typecheck` executados.
- [ ] Evidências de teste adicionadas na descrição do PR.
- [ ] Rollback descrito de forma objetiva.

## Observações de validação final

- [ ] Confirmar spec OpenAPI v3 exibida no Swagger UI.
- [ ] Confirmar servers corretos (`localhost` e `127.0.0.1`) com porta configurada.
- [ ] Confirmar que não houve regressão nas rotas documentadas.
- [ ] Confirmar alternativa mínima segura, se v3 não foi possível.

## Saída esperada

Entregue:

1. **Lista de tarefas por fase (com IDs)**
2. **Critério de conclusão por tarefa**
3. **PR checklist preenchível**
4. **Resumo de validação final e pendências**
