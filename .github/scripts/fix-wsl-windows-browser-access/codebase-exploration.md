---
description: 'Exploração do codebase e ambiente para diagnosticar por que API/Web em WSL não abrem no Chrome do Windows'
---

# Prompt: Codebase Exploration (WSL -> Windows Browser Access)

Você é o Copilot atuando como engenheiro sênior de diagnóstico.
**Não implemente mudanças ainda.**
Seu objetivo é explorar o monorepo e o setup local para identificar por que API/Web rodam no WSL, mas não abrem no Chrome no Windows.

## Contexto do problema

- API e Web rodam no WSL.
- Docker já está ok (integração com WSL funcionando).
- Chrome no Windows não consegue abrir a página Web nem `/docs` da API.

## Instruções obrigatórias

- [ ] Explorar primeiro o codebase e scripts de execução (`dev`, `dev:web`, `dev:api`).
- [ ] Mapear configurações de host/porta, CORS, middleware e URLs públicas.
- [ ] Verificar diferenças de acesso entre `localhost`, `127.0.0.1` e IP do WSL.
- [ ] Não alterar código nesta etapa.

## O que investigar (checklist)

### 1) Execução de servidores e binding de rede

- [ ] `apps/api/src/index.ts`: `fastify.listen` e `host` (`0.0.0.0` vs `localhost`).
- [ ] `apps/web` (Next.js): host de bind no `dev` (se está exposto para fora do namespace WSL).
- [ ] Scripts no `package.json` root/apps e possíveis comandos que forçam bind local.

### 2) Configuração de URLs e ambiente

- [ ] `.env` root, `apps/api/.env`, `.env.example`.
- [ ] `NEXT_PUBLIC_API_URL` e consistência com endpoint realmente acessível no Windows.
- [ ] Diferença entre porta esperada e porta efetiva em runtime.

### 3) Camada de acesso web/browser

- [ ] Middleware do web (`apps/web/src/middleware.ts`) e possíveis bloqueios por domínio/cookie.
- [ ] CORS da API (`origin`, `credentials`, headers, métodos).
- [ ] Compatibilidade de cookie/auth entre host usado no browser e host da API.

### 4) Infra e sistema operacional

- [ ] Evidenciar como WSL está expondo portas para Windows (localhost forwarding).
- [ ] Identificar se há dependência de IP dinâmico do WSL.
- [ ] Checar conflitos de porta e processos já em execução.

## Riscos a levantar explicitamente

- [ ] Bind incorreto (servidor escutando só dentro do WSL).
- [ ] URL da API hardcoded para IP/porta obsoletos.
- [ ] CORS/cookie incompatível com host usado no Windows.
- [ ] Mudanças que resolvem no WSL mas quebram no Linux/macOS/CI.

## Saída esperada

Entregue um relatório com:

1. **Resumo executivo** (causa(s) provável(is))
2. **Inventário de evidências por arquivo/comando**
3. **Causas raiz priorizadas**
4. **Riscos por severidade (alto/médio/baixo)**
5. **Abordagem recomendada sem implementar**
6. **Validação proposta no Windows + WSL**

## Critério de qualidade

- Basear diagnóstico em evidências objetivas do repositório e comandos reproduzíveis.
- Diferenciar claramente problema de rede/bind, URL/env, CORS/cookie e middleware.
- Evitar suposições sem confirmação.
