---
description: 'Checklist de tarefas atômicas, validação e PR para entrega de compatibilidade WSL/Windows'
---

# Prompt: Tasks (Execução + PR Checklist)

Você é o Copilot responsável por decompor o plano em tarefas objetivas e verificáveis.
Gere checklists atômicos para implementação e validação final.

## Objetivo

Garantir execução consistente no WSL e no Windows, com tarefas rastreáveis e critérios claros de conclusão.

## Instruções obrigatórias

- [ ] Derivar tarefas diretamente da spec e do plan aprovados.
- [ ] Produzir tarefas pequenas (idealmente 15–90 min cada).
- [ ] Associar cada tarefa a evidência de validação.
- [ ] Incluir checklist de PR com qualidade mínima.

## Checklist de implementação (modelo)

### A. Scripts e automação

- [x] Identificar scripts não portáveis e registrar impacto.
- [x] Substituir/ajustar scripts para alternativa cross-platform.
- [x] Validar execução dos scripts no WSL.
- [ ] Validar execução dos scripts no Windows.

### B. Paths e env

- [x] Revisar manipulação de caminhos e normalizar quando necessário.
- [x] Revisar carregamento de variáveis de ambiente por contexto.
- [x] Validar fluxo sem dependência de path absoluto local.

### C. Docker e banco

- [ ] Validar subida de serviços de infraestrutura em ambos ambientes.
- [x] Validar conectividade app ↔ API ↔ banco.
- [x] Registrar ajustes necessários de porta/rede.

### D. Documentação

- [ ] Atualizar guia de setup para WSL.
- [ ] Atualizar guia de setup para Windows.
- [ ] Adicionar troubleshooting (erros comuns e solução rápida).

## Checklist de PR (obrigatório)

- [ ] Escopo do PR limitado e aderente ao passo planejado.
- [ ] `build`, `lint` e `typecheck` executados.
- [ ] Fluxo principal de execução validado em WSL e Windows.
- [ ] Documentação alterada quando necessário.
- [ ] Sem mudanças fora de escopo.
- [ ] Evidências anexadas (logs resumidos, prints ou descrição objetiva).

## Observações de validação final

- [ ] Rodar validação de ponta a ponta no WSL.
- [ ] Rodar validação de ponta a ponta no Windows.
- [ ] Comparar comportamento com CI e registrar discrepâncias.
- [ ] Listar limitações conhecidas e backlog técnico residual.

## Formato da saída esperada

Entregue:

1. **Lista de tarefas por fase** (com IDs curtos, ex.: `T1`, `T2`)
2. **Critério de conclusão por tarefa**
3. **Checklist de PR preenchível**
4. **Resumo de validação final e pendências**
