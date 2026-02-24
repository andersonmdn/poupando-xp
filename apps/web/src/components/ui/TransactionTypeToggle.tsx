import { TrendingDown, TrendingUp } from '@/components/ui/icons';
import { TransactionType } from '@poupando-xp/shared';

type TransactionTypeToggleProps = {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
  error?: string | undefined;
};

export function TransactionTypeToggle({
  value,
  onChange,
  error,
}: TransactionTypeToggleProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Tipo de Transação
      </label>

      <div className="rounded-lg bg-slate-100 p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange('EXPENSE')}
            className={`flex items-center justify-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition ${
              value === 'EXPENSE'
                ? 'bg-white text-rose-600 ring-1 ring-rose-200'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingDown className="h-4 w-4" />
            <span>Despesa</span>
          </button>

          <button
            type="button"
            onClick={() => onChange('INCOME')}
            className={`flex items-center justify-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition ${
              value === 'INCOME'
                ? 'bg-white text-emerald-600 ring-1 ring-emerald-200'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Receita</span>
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
