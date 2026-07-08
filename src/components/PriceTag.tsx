import { formatPrice, formatConvertedPrice } from '../lib/format';
import { useSettingsStore } from '../store/useSettingsStore';
import { cn } from '../lib/utils';
import type { Currency } from '../lib/types';

type Props = {
  amount: number;
  currency: Currency;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  convertToUserCurrency?: boolean;
  originalAmount?: number;
  className?: string;
  align?: 'left' | 'right';
};

const sizeMap = {
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-4xl sm:text-5xl',
  xl: 'text-5xl sm:text-6xl',
};

export function PriceTag({
  amount,
  currency,
  size = 'md',
  convertToUserCurrency = true,
  originalAmount,
  className,
  align = 'left',
}: Props) {
  const userCcy = useSettingsStore((s) => s.currency);
  const target = convertToUserCurrency ? userCcy : currency;
  const text = formatConvertedPrice(amount, currency, target);
  const hasDiscount =
    originalAmount !== undefined && originalAmount > amount;

  return (
    <div className={cn('flex flex-col', align === 'right' ? 'items-end' : 'items-start', className)}>
      <div
        className={cn(
          'font-mono tnum font-semibold text-vermilion tracking-tight leading-none',
          sizeMap[size],
        )}
      >
        {text}
      </div>
      {hasDiscount && (
        <div className="mt-1 flex items-center gap-2 font-mono tnum text-2xs text-ink-500">
          <span className="line-through">{formatPrice(originalAmount, currency)}</span>
          <span className="uppercase tracking-caps text-mustard">
            −{Math.round(((originalAmount - amount) / originalAmount) * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
