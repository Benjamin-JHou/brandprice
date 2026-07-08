import { Link } from 'react-router-dom';
import type { Brand } from '../lib/types';
import { cn } from '../lib/utils';

type Props = {
  brand: Brand;
  active?: boolean;
};

export function BrandChip({ brand, active }: Props) {
  return (
    <Link
      to={`/brand/${brand.slug}`}
      className={cn(
        'group flex items-center gap-2 px-3 py-2 border whitespace-nowrap',
        'transition-colors duration-200',
        active
          ? 'border-ink bg-ink text-paper dark:bg-paper dark:text-ink'
          : 'border-ink-300 dark:border-ink-700 hover:border-ink hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink',
      )}
    >
      <span
        className={cn(
          'font-serif italic text-lg leading-none w-5 h-5 flex items-center justify-center',
          active ? 'text-vermilion dark:text-vermilion' : 'text-vermilion',
        )}
      >
        {brand.logo}
      </span>
      <span className="font-mono text-2xs uppercase tracking-caps">
        {brand.name}
      </span>
    </Link>
  );
}
