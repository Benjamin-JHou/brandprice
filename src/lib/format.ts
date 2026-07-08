// 货币与日期格式化
import { CURRENCY_SYMBOL, type Currency } from './types';
import { convert } from './fx';

export function formatPrice(amount: number, currency: Currency): string {
  const map: Record<Currency, Intl.NumberFormatOptions> = {
    EUR: { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
    USD: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
    GBP: { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 },
    JPY: { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 },
    CNY: { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 },
    KRW: { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 },
  };
  try {
    return new Intl.NumberFormat('en-US', map[currency]).format(amount);
  } catch {
    return `${CURRENCY_SYMBOL[currency]}${amount.toFixed(0)}`;
  }
}

export function formatConvertedPrice(
  amount: number,
  from: Currency,
  to: Currency,
): string {
  if (from === to) return formatPrice(amount, from);
  return formatPrice(convert(amount, from, to), to);
}

export function formatRelativeTime(iso: string, now = Date.now()): string {
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
