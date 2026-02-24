import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string | undefined;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn(className)}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
