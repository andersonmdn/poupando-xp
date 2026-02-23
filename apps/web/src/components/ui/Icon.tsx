import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  as: LucideIcon;
  size?: number;
  className?: string;
}

/**
 * Componente wrapper para ícones lucide-react
 *
 * Padroniza tamanho e classes dos ícones no app
 *
 * @param as - O ícone do lucide-react
 * @param size - Tamanho em pixels (default: 18)
 * @param className - Classes CSS adicionais
 */
export function Icon({ as: IconComponent, size = 18, className }: IconProps) {
  return <IconComponent size={size} className={cn('shrink-0', className)} />;
}
