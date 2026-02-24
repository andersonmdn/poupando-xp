---
description: 'Checklist de tarefas atômicas e PR checklist para corrigir acesso Web/API no Chrome do Windows com WSL'
---

# Prompt: Tasks (Execução + PR Checklist)

Você é o Copilot responsável por decompor o plano em tarefas objetivas e verificáveis.
As tarefas devem garantir correção de conectividade sem regressão funcional.

## Objetivo

Restaurar acesso do Chrome no Windows ao Web app e `/docs` da API executados no WSL.

## Instruções obrigatórias

- [ ] Derivar tarefas diretamente da exploração, spec e plan.
- [ ] Definir tarefas atômicas (15–90 min).
- [ ] Associar critério de conclusão para cada tarefa.
- [ ] Incluir checklist de PR e validação final.

## Checklist de tarefas (modelo)

### A. Diagnóstico inicial

- [x] `T1` Confirmar portas/hosts efetivos de Web e API em runtime.
- [x] `T2` Confirmar origem exata usada pelo Chrome no Windows.
- [x] `T3` Identificar causa raiz principal (bind, URL/env, CORS/cookie ou combinação).

### B. Correções técnicas

- [x] `T4` Ajustar bind/host de servidor(es) para acesso Windows quando aplicável.
- [x] `T5` Ajustar env/URL (`NEXT_PUBLIC_API_URL` e correlatos) para cenário WSL+Windows.
- [x] `T6` Ajustar CORS e/ou cookie/auth se necessário.
- [x] `T7` Validar carregamento de `/docs` e Web no Chrome do Windows.

### C. Validação funcional

- [x] `T8` Validar chamadas API pelo frontend sem erro de rede/CORS.
- [x] `T9` Validar fluxo autenticado essencial (login + rota protegida).
- [x] `T10` Rodar `build`/`lint`/`typecheck` no escopo alterado. _(web ok; API build com falhas TypeScript pré-existentes em `apps/api/src/routes/transactions.ts`)_

### D. Documentação

- [x] `T11` Atualizar README com instruções WSL + Windows (URLs e troubleshooting).
- [x] `T12` Registrar resultado final e limitações conhecidas.

## Checklist de PR (obrigatório)

- [ ] Escopo limitado ao problema de acesso WSL -> Windows.
- [ ] Evidências de validação no Chrome do Windows anexadas.
- [ ] `build`, `lint` e `typecheck` executados (ou falhas pré-existentes documentadas).
- [ ] Sem regressão de autenticação e `/docs`.
- [ ] Rollback simples e descrito.

## Observações de validação final

- [ ] URL final da Web abre no Chrome do Windows.
- [ ] URL final de `/docs` abre no Chrome do Windows.
- [ ] Frontend consome API sem erro de CORS/rede.
- [ ] Configuração final não depende de IP WSL frágil sem documentação.

## Formato da saída esperada

Entregue:

1. **Lista de tarefas por fase (com IDs)**
2. **Critério de conclusão por tarefa**
3. **PR checklist preenchível**
4. **Resumo de validação final e pendências**
