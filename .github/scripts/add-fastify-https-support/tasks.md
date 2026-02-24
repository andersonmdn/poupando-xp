---
description: 'Checklist de tarefas atômicas e checklist de PR para entrega de HTTPS no Fastify com segurança'
---

# Tasks — Execução e PR

## Tarefas atômicas

- [x] Mapear ponto exato de criação do Fastify.
- [x] Mapear plugin/rota responsável por `/docs`.
- [x] Definir variáveis de ambiente para habilitar HTTPS e apontar `CERT/KEY`.
- [x] Implementar leitura de certificados por `/certs` e por env conforme spec.
- [x] Implementar validação e mensagens de erro claras para configuração inválida.
- [x] Manter `host: 0.0.0.0` no `listen`.
- [x] Validar `/docs` operando em HTTPS.
- [x] Atualizar documentação de uso local (certificados e execução).
- [x] Se necessário, documentar alternativa com Caddy/Nginx e critérios de adoção.

## Checklist de verificação técnica

- [ ] Build do workspace/pacotes afetados passou.
- [x] Lint passou sem novos erros.
- [ ] Typecheck passou sem regressões.
- [x] API inicia com HTTPS em cenário válido.
- [x] API falha de forma segura em cenário inválido.
- [x] Endpoints críticos (`/health`, `/docs`) funcionam em HTTPS.

## Checklist de PR

- [x] Escopo limitado ao objetivo (sem refactors paralelos).
- [x] Mudanças de configuração documentadas em README/.env.example.
- [x] Evidências de teste anexadas (logs/prints/comandos).
- [x] Riscos e mitigação descritos.
- [x] Estratégia de rollback descrita.

## Observações de validação final

- Confirmar ausência de fallback silencioso para HTTP quando HTTPS for obrigatório.
- Confirmar que secrets/certs não foram versionados indevidamente.
- Confirmar compatibilidade com ambiente local e containerizado.
- Build/typecheck gerais da API seguem com erros preexistentes em `apps/api/src/routes/transactions.ts` (fora do escopo desta mudança).
- Rollback recomendado: desabilitar `API_HTTPS_ENABLED` (retorno imediato a HTTP) e/ou reverter alterações em `apps/api/src/index.ts` e `apps/api/src/config/env.ts`.
