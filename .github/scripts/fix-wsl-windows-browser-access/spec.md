---
description: 'Especificação técnica para corrigir acesso da Web/API no Chrome do Windows com serviços rodando no WSL'
---

# Prompt: Spec (Correção de acesso WSL -> Windows Chrome)

Você é o Copilot responsável por escrever a especificação técnica da correção.
Baseie-se na exploração do codebase e **não implemente nesta etapa**.

## Contexto

A aplicação roda no WSL, mas o Chrome no Windows não abre:

- Web app (Next.js)
- Docs da API (`/docs`)

Docker já está funcional e não é o foco do problema.

## Objetivo

- Garantir que Web e API sejam acessíveis no Chrome do Windows quando executadas no WSL.
- Padronizar host/porta e URLs para ambiente WSL + Windows.
- Preservar fluxo de autenticação e acesso ao Swagger UI.

## Não-objetivos

- Não refatorar arquitetura de auth inteira.
- Não alterar deploy/produção.
- Não trocar stack/frameworks.

## Assunções

- [ ] O desenvolvimento local é executado majoritariamente em WSL.
- [ ] O navegador principal de teste é o Chrome no Windows (fora do WSL).
- [ ] Docker permanece como está (já funcional).
- [ ] A solução deve minimizar dependência de IP dinâmico do WSL.

## Regras técnicas

### Deve

- [ ] Garantir bind de servidores para acesso externo ao namespace WSL quando necessário.
- [ ] Usar URL da API coerente com acesso do Chrome no Windows.
- [ ] Manter CORS compatível com origem do frontend em desenvolvimento.
- [ ] Manter `/docs` acessível via host/porta documentados.

### Não deve

- [ ] Introduzir hardcode frágil de IP dinâmico sem fallback.
- [ ] Quebrar execução padrão Linux/WSL já existente.
- [ ] Alterar comportamento funcional de rotas fora do escopo de conectividade.

## Critérios de aceite

- [ ] Web abre no Chrome do Windows via URL documentada.
- [ ] `/docs` da API abre no Chrome do Windows via URL documentada.
- [ ] Chamadas do frontend para API funcionam sem erro de CORS/conectividade.
- [ ] Rotas autenticadas continuam funcionais no fluxo local.
- [ ] Documentação local indica claramente como subir e acessar em WSL+Windows.

## Edge cases obrigatórios

- [ ] Porta já ocupada (web/api) e fallback claro.
- [ ] Execução com `localhost` e `127.0.0.1`.
- [ ] Diferença de `.env` root vs `.env` de app.
- [ ] Sessão/cookie quando frontend e API usam hosts diferentes.

## Plano de validação

- [ ] Subir API e Web em WSL com configurações finalizadas.
- [ ] Abrir URLs no Chrome do Windows e validar carregamento.
- [ ] Validar `/docs` e uma chamada de API autenticada.
- [ ] Rodar checks do projeto (`build`, `lint`, `typecheck`) no escopo aplicável.

## Formato da saída esperada

Entregue a spec com:

1. **Resumo da mudança**
2. **Escopo e não-escopo**
3. **Assunções**
4. **Regras técnicas e decisões**
5. **Critérios de aceite testáveis**
6. **Riscos e mitigação**
7. **Plano de validação WSL + Windows**
