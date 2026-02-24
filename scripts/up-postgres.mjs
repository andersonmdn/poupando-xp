import { spawnSync } from 'node:child_process';

const action = process.argv[2] ?? 'up';

const actionArgsMap = {
  up: ['up', '-d', 'postgres'],
  down: ['down'],
  status: ['ps'],
};

const actionArgs = actionArgsMap[action];

if (!actionArgs) {
  console.error('Ação inválida. Use: up, down ou status.');
  process.exit(1);
}

const commands = [
  ['docker', ['compose', ...actionArgs]],
  ['docker-compose', actionArgs],
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: 'inherit' });

  if (!result.error && result.status === 0) {
    process.exit(0);
  }

  if (!result.error && result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.error(
  'Não foi possível executar o comando Docker Compose. Instale Docker Compose v2 (`docker compose`) ou v1 (`docker-compose`).'
);
process.exit(1);
