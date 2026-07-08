// 前端 API 客户端 — 纯品牌目录版
import type { Brand } from './types';
import { dataService } from './dataService';

export const api = {
  async search(q: string, limit = 20) {
    await delay(50);
    return dataService.search(q, limit);
  },
  async brand(slug: string) {
    await delay(30);
    const b = dataService.brandBySlug(slug);
    if (!b) throw new Error('Brand not found');
    return b;
  },
  async brands() {
    await delay(30);
    return dataService.allBrands();
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
