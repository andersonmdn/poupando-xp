import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de teste
  const hashedPassword = await bcrypt.hash('123456', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'teste@example.com' },
    update: {},
    create: {
      name: 'Usuário Teste',
      email: 'teste@example.com',
      passwordHash: hashedPassword,
    },
  });

  console.log('👤 Usuário teste criado:', testUser.email);

  // Criar transações de exemplo
  const transactions = [
    {
      type: 'INCOME' as const,
      amount: 5000.0,
      description: 'Salário Janeiro',
      category: 'SALARY',
      occurredAt: new Date('2024-01-01'),
    },
    {
      type: 'EXPENSE' as const,
      amount: 800.0,
      description: 'Supermercado',
      category: 'FOOD',
      occurredAt: new Date('2024-01-02'),
    },
    {
      type: 'EXPENSE' as const,
      amount: 150.0,
      description: 'Gasolina',
      category: 'TRANSPORT',
      occurredAt: new Date('2024-01-03'),
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: {
        ...transaction,
        userId: testUser.id,
      },
    });
  }

  console.log('💰 Transações de exemplo criadas');
  console.log('✅ Seed concluído!');
  console.log('\n📋 Dados de teste:');
  console.log('Email: teste@example.com');
  console.log('Senha: 123456');
}

main()
  .catch(e => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
