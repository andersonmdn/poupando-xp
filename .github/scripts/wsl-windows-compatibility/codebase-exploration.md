---
description: 'Exploração de codebase para mapear gaps de compatibilidade entre WSL e Windows, sem alterar código'
---

# Prompt: Codebase Exploration (WSL + Windows)

Você é o Copilot atuando como engenheiro sênior de diagnóstico. **Não implemente mudanças ainda**.
Seu objetivo é explorar o repositório e produzir um mapeamento de compatibilidade entre execução no WSL e no Windows nativo.

## Contexto do objetivo

- Tornar o projeto executável de forma confiável em ambiente Linux/WSL e também no Windows.
- Evitar que scripts, caminhos, ferramentas e variáveis funcionem apenas em um SO.

## Instruções obrigatórias

- [ ] Explore primeiro a estrutura do monorepo e os comandos principais (`dev`, `build`, `lint`, `typecheck`, docker, prisma).
- [ ] Mapeie todos os pontos onde podem existir diferenças de plataforma.
- [ ] Não modifique arquivos do produto nesta etapa.

## O que investigar (checklist)

### 1) Scripts e package managers

- [ ] `package.json` (root, apps e packages): uso de comandos shell não portáveis (`rm`, `cp`, `mv`, `export`, `&&` com sintaxe específica, globbing).
- [ ] Dependência de shell específico (bash/zsh) em scripts npm/pnpm.
- [ ] Uso de ferramentas com comportamento diferente em Windows (watchers, paths, binários).

### 2) Caminhos e sistema de arquivos

- [ ] Paths hardcoded com `/` ou `\\` em scripts/código.
- [ ] Dependência de case-sensitive path (funciona no Linux e falha no Windows).
- [ ] Referências absolutas de ambiente local (home dirs, mounts WSL, drive letters).

### 3) Variáveis de ambiente e configuração

- [ ] Diferenças de export/set de variáveis em scripts.
- [ ] Carregamento de `.env` no root e em apps.
- [ ] URLs/hosts locais que mudam entre WSL e Windows (localhost, loopback, portas).

### 4) Docker, banco e rede local

- [ ] `docker-compose.yml` e comandos de inicialização.
- [ ] Dependência de caminhos bind-mount sensíveis ao SO.
- [ ] Acesso API/Web/DB entre host e container em WSL vs Windows.

### 5) Toolchain e CI

- [ ] Versões mínimas de Node/pnpm e possíveis incompatibilidades.
- [ ] Scripts usados em CI que podem divergir do ambiente local.
- [ ] Arquivos de documentação com instruções incompletas para um dos ambientes.

## Riscos a levantar explicitamente

- [ ] Quebra por comandos shell não cross-platform.
- [ ] Quebra por path separator e case sensitivity.
- [ ] Falhas por encoding/EOL (LF/CRLF) e permissões/executáveis.
- [ ] Falhas intermitentes em watch mode e hot reload.
- [ ] Problemas de rede local entre serviços (web/api/db) em contextos mistos.

## Formato da saída esperada

Entregue um relatório com as seções:

1. **Resumo executivo** (5-10 linhas)
2. **Inventário de pontos críticos por arquivo/comando**
3. **Riscos por severidade** (alto/médio/baixo)
4. **Hipóteses de causa raiz**
5. **Abordagem recomendada sem implementação** (ordem sugerida de correção)
6. **Lista de dúvidas/resíduos** (se houver)

## Critério de qualidade

- Use evidências objetivas (arquivo + script/comando).
- Priorize ações que aumentem portabilidade sem refactors desnecessários.
- Mantenha o diagnóstico reutilizável para outras migrações cross-platform.
