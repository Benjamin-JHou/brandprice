// 前端本地数据服务 — 品牌目录版
// 仅保留品牌搜索和读取逻辑，数据源自 src/data/brands.json

import type { Brand } from './types';
import brandsData from '../data/brands.json';

const brands = (brandsData as Brand[]).sort((a, b) => a.name.localeCompare(b.name));
const brandBySlug = new Map<string, Brand>(brands.map((b) => [b.slug, b]));

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[\s,/-]+/)
    .filter(Boolean);
}

function scoreBrand(b: Brand, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const haystack = [
    b.name,
    b.nameLocal,
    b.slug,
    b.tagline,
    b.descriptionZh,
    b.descriptionEn,
  ]
    .join(' ')
    .toLowerCase();
  
  let score = 0;
  for (const t of tokens) {
    if (b.slug.toLowerCase() === t) return 1000; // 精确 slug
    if (b.name.toLowerCase() === t) score += 500; // 英文名精确匹配
    if (b.nameLocal.toLowerCase() === t) score += 450; // 韩文名精确匹配
    if (b.name.toLowerCase().includes(t)) score += 150;
    if (b.nameLocal.toLowerCase().includes(t)) score += 120;
    if (haystack.includes(t)) score += 30;
  }
  return score;
}

export const dataService = {
  allBrands(): Brand[] {
    return brands;
  },
  brandBySlug(slug: string): Brand | undefined {
    return brandBySlug.get(slug);
  },
  search(query: string, limit = 20): { query: string; total: number; elapsedMs: number; items: Brand[] } {
    const start = Date.now();
    const tokens = tokenize(query);
    if (tokens.length === 0) {
      return { query, total: 0, elapsedMs: 0, items: [] };
    }
    const ranked = brands
      .map((b) => ({ b, s: scoreBrand(b, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map((x) => x.b);
    const elapsed = Date.now() - start;
    return { query, total: ranked.length, elapsedMs: elapsed, items: ranked };
  },
};
