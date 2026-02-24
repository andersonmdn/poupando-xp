---
description: 'Plano incremental e mergeável para restaurar acesso no Chrome do Windows a serviços rodando no WSL'
---

# Prompt: Plan (Incremental e Mergeável)

Você é o Copilot responsável por transformar a spec em um plano de execução incremental.
O plano deve reduzir risco e permitir validação em cada passo.

## Objetivo do plano

Corrigir o acesso Web/API no Chrome do Windows com serviços rodando no WSL, em passos pequenos e reversíveis.

## Diretrizes obrigatórias

- [ ] Um passo por vez, mergeável e com critério de pronto claro.
- [ ] Listar arquivos prováveis por passo.
- [ ] Definir validação prática para WSL + Windows a cada etapa.
- [ ] Incluir rollback por passo.

## Estrutura exigida por passo

Para cada passo, incluir:

1. **Nome do passo**
2. **Objetivo**
3. **Mudanças previstas**
4. **Arquivos prováveis**
5. **Como testar (WSL + Windows)**
6. **Critério de pronto**
7. **Risco (baixo/médio/alto)**
8. **Rollback**

## Sequência sugerida

- [ ] Passo 1: Confirmar causa raiz (bind, URL/env, CORS/cookie, middleware).
- [ ] Passo 2: Ajustar bind/host e padronizar portas acessíveis no Windows.
- [ ] Passo 3: Corrigir URL da API no frontend/env para cenário WSL+Windows.
- [ ] Passo 4: Ajustar CORS/cookie e validar autenticação.
- [ ] Passo 5: Atualizar documentação operacional e troubleshooting.

## Arquivos prováveis (base)

- [ ] `apps/api/src/index.ts`
- [ ] `apps/web/package.json` e/ou scripts root
- [ ] `apps/web/src/lib/api.ts`
- [ ] `.env`, `apps/api/.env`, `.env.example`
- [ ] `README.md`

## Estratégia de rollback

- [ ] Reversão por commit/PR de cada passo.
- [ ] Separar ajustes de env/script de mudanças de código quando possível.
- [ ] Preservar configuração anterior como fallback até validação final.

## Saída esperada

Entregue:

1. **Visão geral do plano e rationale**
2. **Passos detalhados com template completo**
3. **Dependências entre passos**
4. **Plano de validação cumulativa**
5. **Rollback consolidado**

## Critério de qualidade

- Plano executável sem contexto implícito.
- Etapas pequenas e revisáveis.
- Cobertura explícita de WSL + Windows Chrome.
