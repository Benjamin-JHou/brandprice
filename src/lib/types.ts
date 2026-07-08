// 共享类型定义

export type Currency = 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CNY' | 'KRW';

export const CURRENCIES: Currency[] = ['EUR', 'USD', 'GBP', 'JPY', 'CNY', 'KRW'];

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
};

export const CURRENCY_LABEL: Record<Currency, string> = {
  EUR: 'Euro',
  USD: 'US Dollar',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan',
  KRW: 'Korean Won',
};

export type Brand = {
  slug: string;
  name: string;
  /** 当地语言名称（如韩文 / 中文 / 日文） */
  nameLocal: string;
  country: string;
  logo: string;
  tagline: string;
  /** 是否热门 */
  popular?: boolean;
};

export type PricePoint = {
  date: string; // YYYY-MM-DD
  price: number;
};

export type Product = {
  sku: string;
  brandSlug: string;
  brand: string;
  name: string;
  category: string;
  color: string;
  size: string | null;
  currency: Currency;
  price: number;
  originalPrice: number;
  inStock: boolean;
  url: string;
  image: string;
  description: string;
  fetchedAt: string; // ISO
  priceHistory: PricePoint[];
};

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type Subscription = {
  sku: string;
  thresholdPrice: number;
  createdAt: string;
};
