import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type FieldWithRightIconProps = {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

export function FieldWithRightIcon({
  icon,
  children,
  className,
}: FieldWithRightIconProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
    </div>
  );
}
