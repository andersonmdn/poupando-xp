---
description: 'Especificação funcional/técnica para habilitar HTTPS na API Fastify com cert/key via /certs ou env, mantendo host 0.0.0.0 e /docs'
---

# Spec — HTTPS no servidor Fastify

## Contexto

A API Fastify deve oferecer suporte a HTTPS com certificados `.pem`, permitindo configuração por arquivos em `/certs` ou por variáveis de ambiente, sem quebrar o comportamento atual de bind em `host: 0.0.0.0` e mantendo a rota `/docs` operacional.

## Objetivo

Adicionar uma configuração segura e previsível de HTTPS no startup da API, com fallback claramente definido quando a stack atual não suportar adequadamente HTTPS nativo.

## Não-objetivos

- Não trocar framework web.
- Não redesenhar autenticação.
- Não implementar gestão automatizada de certificados (ACME) nesta tarefa.
- Não alterar comportamento funcional das rotas de negócio.

## Regras de implementação

- Deve suportar duas fontes de certificado:
  - Arquivos `.pem` em `/certs` (ex.: `server.crt`, `server.key`), ou
  - Variáveis de ambiente com conteúdo/caminho de `CERT` e `KEY`.
- Deve manter `host: 0.0.0.0` no `listen`.
- Deve manter `/docs` acessível e funcional sob HTTPS.
- Deve falhar com erro explícito quando HTTPS for habilitado mas `CERT/KEY` estiverem ausentes/inválidos.
- Não deve habilitar fallback silencioso para HTTP quando a intenção explícita for HTTPS.

## Critérios de aceite

- [ ] API inicia com HTTPS quando configuração válida estiver presente.
- [ ] API não inicia (com mensagem clara) em configuração HTTPS inválida.
- [ ] `/docs` responde corretamente via `https://.../docs`.
- [ ] `host: 0.0.0.0` permanece inalterado.
- [ ] Documentação de setup local é atualizada.
- [ ] Fluxo de execução atual sem HTTPS explícito permanece compatível (se definido em escopo).

## Edge cases

- Certificado/key com permissões insuficientes.
- Caminho `/certs` inexistente no ambiente local/container.
- Conteúdo PEM malformado.
- Porta já em uso em ambiente HTTPS.
- Mixed content no frontend ao consumir API com esquema incorreto.

## Compatibilidade e alternativa segura

Se versões atuais do Fastify/plugins do projeto apresentarem incompatibilidade prática com HTTPS nativo (ou se complexidade operacional aumentar risco), registrar:

- Motivo técnico objetivo da incompatibilidade.
- Alternativa recomendada: TLS terminado em proxy reverso (Caddy/Nginx), mantendo API interna em HTTP.
- Requisitos mínimos de segurança para o proxy (TLS moderno, redirecionamento HTTP→HTTPS, headers corretos).

## Plano de validação

- [ ] Build dos pacotes afetados.
- [ ] Lint/typecheck da API.
- [ ] Subida local da API com certificados de teste.
- [ ] Verificação manual de `/health` e `/docs` em HTTPS.
- [ ] Verificação de integração Web → API (quando aplicável).

## Assunções

- O projeto roda em ambiente de desenvolvimento local Linux/WSL.
- Existe permissão para montar ou disponibilizar `/certs` no runtime.
- Certificados de desenvolvimento podem ser autoassinados.
- O comportamento padrão (sem flag/config de HTTPS) pode continuar em HTTP, desde que isso esteja documentado e não conflite com requisito de segurança do ambiente.
