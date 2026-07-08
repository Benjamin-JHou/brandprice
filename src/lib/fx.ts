// FX 静态汇率表（基准 1 单位 = X EUR，2026-07 估值）
// 用于前端做展示货币换算；价格数据源保留原始货币
// 注意：这是 mock 汇率，生产环境应接入实时汇率 API

import type { Currency } from './types';

export const FX_TO_EUR: Record<Currency, number> = {
  EUR: 1.0,
  USD: 1.08,
  GBP: 0.85,
  JPY: 168.5,
  CNY: 7.85,
  KRW: 1620.0,
};

export function convert(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount;
  const inEur = amount / FX_TO_EUR[from];
  return inEur * FX_TO_EUR[to];
}
