---
description: 'Plano incremental e mergeável para implementar HTTPS no Fastify com validação e rollback'
---

# Plan — Implementação incremental

## Diretriz

Gerar um plano em passos pequenos, revisáveis e mergeáveis, priorizando segurança e baixo risco de regressão.

## Passos sugeridos

1. **Descoberta técnica e decisão de abordagem**
   - Confirmar suporte HTTPS nativo no Fastify atual.
   - Definir matriz de configuração (`/certs` vs env).
   - Saída: decisão documentada e escopo final.

2. **Configuração de ambiente e contratos**
   - Ajustar schema/config de env para novas variáveis.
   - Definir precedência (env > arquivo, ou vice-versa).
   - Saída: validação robusta de configuração.

3. **Bootstrap HTTPS no servidor**
   - Alterar criação do Fastify para aceitar `https` quando habilitado.
   - Preservar `host: 0.0.0.0`.
   - Saída: servidor sobe com TLS quando configurado.

4. **Compatibilidade de `/docs` e plugins**
   - Verificar plugin de docs e URL base.
   - Ajustar apenas o necessário para manter `/docs` funcional.
   - Saída: documentação acessível em HTTPS.

5. **Documentação operacional**
   - Atualizar README/.env.example/docker-compose conforme necessário.
   - Explicar setup local de certificados e troubleshooting.
   - Saída: onboarding reproduzível.

6. **Fallback seguro (se necessário)**
   - Se HTTPS nativo não for viável, introduzir plano de proxy reverso (Caddy/Nginx).
   - Registrar limites, prós/contras e configuração mínima segura.

## Arquivos prováveis por passo

- `apps/api/src/index.ts`
- `apps/api/src/config/env.ts`
- `apps/api/package.json` (se scripts mudarem)
- `README.md` e/ou `apps/web/README.md`
- `.env.example`
- `docker-compose.yml` (se incluir `/certs` ou proxy)

## Como testar cada passo

- Passos 1–2: validação estática de config + typecheck.
- Passo 3: subir API local com cert válido e inválido.
- Passo 4: abrir `/docs` via HTTPS e validar assets/rotas.
- Passo 5: seguir documentação do zero em máquina limpa.
- Passo 6: validar redirecionamento HTTP→HTTPS (se proxy).

## Estratégia de rollback

- Manter feature flag/config explícita para HTTPS.
- Em falha de produção, reverter para último deploy estável.
- Se usar proxy, rollback independente da aplicação (troca de rota upstream/TLS termination).

## Checklist do plano

- [ ] Passos são pequenos e mergeáveis.
- [ ] Cada passo possui validação objetiva.
- [ ] Há decisão explícita entre HTTPS nativo e proxy.
- [ ] Existe rollback documentado.
