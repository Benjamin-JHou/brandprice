// 前端本地数据服务 — 替代原 Express API 后端
// 将 api/services/productRepository.ts 和 api/services/searchService.ts 的逻辑内联到前端
// 数据来自 src/data/ 下的 JSON 文件

import type { Product, Brand, PricePoint } from './types';
import brandsData from '../data/brands.json';
import productsData from '../data/products.json';

// ============ Types ============

type RawProduct = {
  sku: string;
  brandSlug: string;
  name: string;
  category: string;
  color: string;
  size: string;
  currency: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
  url: string;
  image: string;
  description: string;
};

// ============ Initialize data ============

const brands = brandsData as Brand[];

type ProductBase = Omit<Product, 'fetchedAt' | 'priceHistory' | 'price'> & {
  basePrice: number;
  priceHistory: PricePoint[];
};

const productsBase: ProductBase[] = (productsData as RawProduct[]).map((p) => {
  const brand = brands.find((b) => b.slug === p.brandSlug);
  return {
    ...p,
    currency: p.currency as Product['currency'],
    size: p.size || null,
    basePrice: p.price,
    brand: brand ? brand.name : p.brandSlug,
    priceHistory: generatePriceHistory(p.price, 30, p.sku),
  };
});

const productBySku = new Map<string, ProductBase>(productsBase.map((p) => [p.sku, p]));
const brandBySlug = new Map<string, Brand>(brands.map((b) => [b.slug, b]));

// ============ Live price state ============

type LiveState = { bucket: number; price: number };
const liveCache = new Map<string, LiveState>();

const BUCKET_MS = 30 * 1000; // 每 30 秒换一次桶

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h;
}

/**
 * 实时价格：同一分钟桶内价格稳定，跨桶随时间漂移 ±1.5%
 */
function getLivePrice(sku: string, basePrice: number): number {
  const now = Date.now();
  const bucket = Math.floor(now / BUCKET_MS);
  const cached = liveCache.get(sku);
  if (cached && cached.bucket === bucket) return cached.price;

  // 同一桶：seed 决定一个稳定的 ±1.5% 漂移
  const seed = (bucket * 2654435761) ^ hashCode(sku);
  const r = Math.abs(Math.sin(seed)) % 1;
  const drift = (r * 2 - 1) * 0.015;
  // KRW 按 100 韩元取整；其他货币按 1 取整
  const round = basePrice >= 10000 ? 100 : 1;
  const newPrice = Math.round((basePrice * (1 + drift)) / round) * round;
  liveCache.set(sku, { bucket, price: newPrice });
  return newPrice;
}

// ============ Price history ============

function generatePriceHistory(basePrice: number, days: number, seedKey: string): PricePoint[] {
  const seed = seedKey
    .split('')
    .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
  const points: PricePoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    points.push({ date: d.toISOString().slice(0, 10), price: +basePrice.toFixed(2) });
  }
  return points;
}

// 把 base 商品转成带实时价格和当前时间戳的 Product
function applyLive(base: ProductBase): Product {
  const livePrice = getLivePrice(base.sku, base.basePrice);
  const history = base.priceHistory.slice();
  // 最后一点对齐到今日实时价
  if (history.length > 0) {
    history[history.length - 1] = {
      date: history[history.length - 1].date,
      price: livePrice,
    };
  }
  return {
    sku: base.sku,
    brandSlug: base.brandSlug,
    brand: base.brand,
    name: base.name,
    category: base.category,
    color: base.color,
    size: base.size,
    currency: base.currency,
    price: livePrice,
    originalPrice: base.originalPrice,
    inStock: base.inStock,
    url: base.url,
    image: base.image,
    description: base.description,
    fetchedAt: new Date().toISOString(),
    priceHistory: history,
  };
}

// ============ Search ============

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[\s,/-]+/)
    .filter(Boolean);
}

function scoreProduct(p: Product, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const haystack = [
    p.name,
    p.brand,
    p.brandSlug,
    p.color,
    p.category,
    p.sku,
  ]
    .join(' ')
    .toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (p.sku.toLowerCase() === t) return 1000; // 精确 SKU
    if (p.brand.toLowerCase() === t) score += 200;
    if (p.brandSlug.toLowerCase() === t) score += 220;
    if (p.name.toLowerCase().includes(t)) score += 80;
    if (haystack.includes(t)) score += 30;
  }
  return score;
}

// ============ Public API ============

export const dataService = {
  // --- Brands ---
  allBrands(): Brand[] {
    return brands;
  },
  brandBySlug(slug: string): Brand | undefined {
    return brandBySlug.get(slug);
  },
  popularBrands(limit = 8): Brand[] {
    return brands.filter((b) => b.popular).slice(0, limit);
  },

  // --- Products ---
  allProducts(): Product[] {
    return productsBase.map(applyLive);
  },
  productBySku(sku: string): Product | undefined {
    const p = productBySku.get(sku);
    return p ? applyLive(p) : undefined;
  },
  productsByBrand(slug: string): Product[] {
    return productsBase.filter((p) => p.brandSlug === slug).map(applyLive);
  },
  priceHistory(sku: string, days = 30): PricePoint[] | undefined {
    const p = productBySku.get(sku);
    if (!p) return undefined;
    const live = applyLive(p);
    return live.priceHistory.slice(-days);
  },

  // --- Search ---
  search(query: string, limit = 10): { query: string; total: number; elapsedMs: number; items: Product[] } {
    const start = Date.now();
    const tokens = tokenize(query);
    if (tokens.length === 0) {
      return { query, total: 0, elapsedMs: 0, items: [] };
    }
    const all = productsBase.map(applyLive);
    const ranked = all
      .map((p) => ({ p, s: scoreProduct(p, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map((x) => x.p);
    const elapsed = Date.now() - start;
    return { query, total: ranked.length, elapsedMs: elapsed, items: ranked };
  },
};
