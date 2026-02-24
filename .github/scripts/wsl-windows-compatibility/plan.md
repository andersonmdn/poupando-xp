---
description: 'Plano incremental e mergeável para implementar compatibilidade entre WSL e Windows'
---

# Prompt: Plan (Incremental e Mergeável)

Você é o Copilot responsável por transformar a spec em um plano de execução incremental.
O plano deve ter passos pequenos, reversíveis e fáceis de revisar em PRs.

## Objetivo do plano

Implementar compatibilidade WSL/Windows com o menor risco possível, em etapas que possam ser mergeadas de forma independente.

## Diretrizes obrigatórias

- [ ] Cada passo deve ter escopo claro e resultado verificável.
- [ ] Cada passo deve listar arquivos prováveis de alteração.
- [ ] Cada passo deve indicar como testar localmente no WSL e no Windows.
- [ ] Evitar PRs grandes; priorizar sequência de baixo risco.

## Estrutura exigida por passo

Para cada passo, inclua:

1. **Nome do passo**
2. **Objetivo**
3. **Mudanças previstas**
4. **Arquivos prováveis**
5. **Como testar (WSL + Windows)**
6. **Critério de pronto**
7. **Risco** (baixo/médio/alto)
8. **Rollback**

## Sequência sugerida (base)

- [ ] Passo 1: Normalização de scripts cross-platform no monorepo.
- [ ] Passo 2: Ajustes de paths/env e robustez de configuração.
- [ ] Passo 3: Compatibilidade de docker/banco no fluxo local.
- [ ] Passo 4: Atualização de documentação operacional por ambiente.
- [ ] Passo 5: Validação final comparativa e estabilização.

## Estratégia de rollback

- [ ] Definir rollback por passo (reverter commit/PR específico).
- [ ] Evitar migrações irreversíveis no mesmo PR de ajustes de script.
- [ ] Manter mudanças de documentação separadas quando possível.

## Formato da saída esperada

Entregue:

1. **Visão geral do plano** (ordem e rationale)
2. **Passos detalhados (template completo acima)**
3. **Dependências entre passos**
4. **Plano de validação cumulativa**
5. **Estratégia de rollback consolidada**

## Critério de qualidade

- O plano precisa ser executável por outra pessoa sem contexto adicional.
- Os passos precisam ser pequenos o suficiente para revisão rápida de PR.
- O plano deve minimizar chance de quebra de fluxo de desenvolvimento.
