---
description: 'Especificação da mudança para garantir compatibilidade WSL/Windows com critérios de aceite e validação'
---

# Prompt: Spec (WSL + Windows Compatibility)

Você é o Copilot responsável por escrever a especificação técnica da mudança.
Baseie-se no resultado da exploração do codebase e **não avance para implementação** nesta etapa.

## Contexto

Criar uma especificação para que o projeto rode de forma consistente em:

- WSL (Linux)
- Windows (PowerShell/CMD/Git Bash, conforme aplicável)

## Objetivo

- Padronizar execução local (`dev`, `build`, `lint`, `typecheck`, banco/docker) em ambos os ambientes.
- Reduzir dependências de shell/comando específico de SO.
- Documentar setup e troubleshooting mínimo para times híbridos.

## Não-objetivos

- Não redesenhar arquitetura da aplicação.
- Não trocar stack principal sem necessidade.
- Não otimizar performance além do necessário para compatibilidade.

## Assunções (preencher e ajustar se necessário)

- [ ] Node e pnpm são gerenciados com versões compatíveis entre ambientes.
- [ ] Desenvolvimento principal ocorre no monorepo atual, sem split de repositórios.
- [ ] Docker Desktop (quando usado no Windows) e Docker no WSL estão disponíveis.
- [ ] CI continuará em Linux; foco é reduzir discrepância local vs CI.

## Regras de compatibilidade

### Deve

- [ ] Scripts de automação funcionar sem depender de comandos exclusivos de Unix.
- [ ] Paths e leitura de arquivos serem independentes de separador de diretório.
- [ ] Setup local ter instruções claras para WSL e Windows.
- [ ] Fluxos essenciais (`install`, `dev`, `build`) funcionarem em ambos os ambientes.

### Não deve

- [ ] Introduzir dependência nova sem justificativa técnica clara.
- [ ] Alterar comportamento funcional do produto fora do escopo de compatibilidade.
- [ ] Exigir passos manuais frágeis não documentados.

## Critérios de aceite

- [ ] Instalação de dependências funciona em WSL e Windows.
- [ ] Execução de desenvolvimento sobe os serviços esperados sem ajuste manual ad-hoc.
- [ ] `build`, `lint` e `typecheck` executam com sucesso nos dois ambientes.
- [ ] Fluxos com banco (migração/seed, se aplicável) têm instrução e execução reproduzível.
- [ ] README/docs atualizados com passos por ambiente e troubleshooting essencial.

## Edge cases obrigatórios

- [ ] CRLF vs LF em scripts e arquivos de configuração.
- [ ] Paths com espaço e caracteres especiais no diretório do projeto.
- [ ] Diferença de case sensitivity entre sistemas de arquivos.
- [ ] Portas ocupadas e conflito de rede local entre host/WSL/container.
- [ ] Ferramentas que exigem execução via shell específico.

## Plano de validação

- [ ] Validar em WSL: install, dev, build, lint, typecheck, fluxo principal da aplicação.
- [ ] Validar em Windows: install, dev, build, lint, typecheck, fluxo principal da aplicação.
- [ ] Comparar resultados com CI para detectar divergências.
- [ ] Registrar evidências (comandos, outputs resumidos, limitações conhecidas).

## Formato da saída esperada

Entregue a spec com as seções:

1. **Resumo da mudança**
2. **Escopo e não-escopo**
3. **Regras técnicas**
4. **Critérios de aceite testáveis**
5. **Matriz de validação WSL vs Windows**
6. **Riscos e mitigação**
7. **Assunções e pendências**
