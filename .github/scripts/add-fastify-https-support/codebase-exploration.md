---
description: 'Explorar o codebase para adicionar HTTPS no Fastify com cert/key via /certs ou variáveis de ambiente, mantendo host 0.0.0.0 e /docs funcional'
---

# Codebase Exploration — HTTPS no Fastify

## Objetivo desta exploração

Levantar tudo o que é necessário para habilitar HTTPS no servidor Fastify da API, com leitura de `CERT` e `KEY` (arquivos `.pem`) via pasta `/certs` ou via variáveis de ambiente, sem alterar código nesta etapa.

## Instruções para o Copilot

1. Explore o codebase antes de propor qualquer mudança.
2. Mapeie os pontos de inicialização do servidor e configuração de ambiente.
3. Verifique compatibilidade entre versões atuais de Fastify/plugins e opção `https`.
4. Valide o impacto em `/docs` (Swagger/OpenAPI) quando servido sob HTTPS.
5. Se houver risco de incompatibilidade, documente claramente e proponha alternativa com proxy reverso (Caddy/Nginx).

## Áreas obrigatórias para mapear

- Bootstrap do servidor API (`apps/api/src/index.ts` e arquivos relacionados).
- Configuração de ambiente (`apps/api/src/config/env.ts`, `.env.example`, README).
- Registro de rotas e docs (`/docs`, plugins de Swagger/OpenAPI).
- Scripts de execução local e monorepo (`package.json` raiz e de `apps/api`).
- Infra local (`docker-compose.yml`, possíveis volumes para `/certs`).
- Qualquer middleware/plugin que assuma HTTP puro.

## Checklist de investigação

- [ ] Identificar onde o Fastify é instanciado e como `listen` é chamado.
- [ ] Identificar como variáveis de ambiente são validadas e carregadas.
- [ ] Confirmar se existe padrão para caminhos absolutos/relativos no projeto.
- [ ] Listar plugins que podem ser sensíveis a `http` vs `https`.
- [ ] Verificar se `/docs` usa URL base fixa e se requer ajuste.
- [ ] Verificar implicações para dev local em Linux/WSL e containers.
- [ ] Levantar riscos de segurança (cert inválido, permissões de arquivo, fallback inseguro).

## Saída esperada da exploração

- Mapa de arquivos e responsabilidades.
- Lista de riscos técnicos e operacionais.
- Decisão recomendada: HTTPS nativo no Fastify **ou** proxy reverso.
- Critérios para decidir entre as abordagens (compatibilidade, segurança, simplicidade operacional).
- Sem alterações de código nesta fase.
