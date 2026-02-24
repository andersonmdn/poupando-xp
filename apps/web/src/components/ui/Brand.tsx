import { HandCoins } from '@/components/ui/icons';

type BrandProps = {
  nameClassName?: string;
  iconWrapperClassName?: string;
  className?: string;
};

export function Brand({
  nameClassName = 'text-lg font-semibold text-white px-3 py-2',
  iconWrapperClassName = 'h-10 w-10 rounded-md bg-blue-500 flex items-center justify-center',
  className = 'flex min-w-md',
}: BrandProps) {
  return (
    <div className={className}>
      <span className={iconWrapperClassName}>
        <HandCoins className="h-6 w-6 text-white" />
      </span>
      <span className={nameClassName}>Poupando XP</span>
    </div>
  );
}