import { ReactNode } from 'react';

type SummaryCardProps = {
  title: string;
  titleIcon: ReactNode;
  description: string;
  valueIcon: ReactNode;
  value: string;
  valueText: string;
};

export function SummaryCard({
  title,
  titleIcon,
  description,
  valueIcon,
  value,
  valueText,
}: SummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <span className="text-slate-500">{titleIcon}</span>
      </div>

      <p className="mt-3 text-sm text-slate-500">{description}</p>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-slate-600">{valueIcon}</span>
        <div>
          <p className="text-xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{valueText}</p>
        </div>
      </div>
    </article>
  );
}
