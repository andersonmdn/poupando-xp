'use client';

import { SummaryCard } from '@/components/ui/SummaryCard';
import {
  HandCoins,
  Sun,
  TrendingDown,
  TrendingUp,
} from '@/components/ui/icons';

export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Saldo Total"
          titleIcon={<HandCoins className="h-5 w-5" />}
          description="Visão geral do seu saldo consolidado."
          valueIcon={<HandCoins className="h-5 w-5" />}
          value="R$ 12.450,00"
          valueText="Atualizado hoje"
        />

        <SummaryCard
          title="Receita Mensal"
          titleIcon={<TrendingUp className="h-5 w-5" />}
          description="Total de receitas registradas neste mês."
          valueIcon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          value="R$ 8.200,00"
          valueText="Receitas de fevereiro"
        />

        <SummaryCard
          title="Despesas Mensais"
          titleIcon={<TrendingDown className="h-5 w-5" />}
          description="Total de despesas lançadas neste mês."
          valueIcon={<TrendingDown className="h-5 w-5 text-rose-600" />}
          value="R$ 5.750,00"
          valueText="Despesas de fevereiro"
        />

        <SummaryCard
          title="Taxa de Poupança"
          titleIcon={<Sun className="h-5 w-5" />}
          description="Percentual da renda mensal que foi poupado."
          valueIcon={<Sun className="h-5 w-5 text-amber-500" />}
          value="29,9%"
          valueText="Taxa de poupança mensal"
        />
      </div>
    </section>
  );
}
