// 前端 API 客户端 — 纯前端版（数据来自本地 dataService）
import type { Product, Brand, PricePoint } from './types';
import { dataService } from './dataService';

export const api = {
  async search(q: string, limit = 10) {
    // 模拟微小延迟，让 loading 状态可感知
    await delay(50);
    return dataService.search(q, limit);
  },
  async product(sku: string) {
    await delay(30);
    const p = dataService.productBySku(sku);
    if (!p) throw new Error('Product not found');
    return p;
  },
  async history(sku: string, days = 30) {
    await delay(20);
    const h = dataService.priceHistory(sku, days);
    if (!h) throw new Error('Product not found');
    return h;
  },
  async brands() {
    await delay(30);
    return dataService.allBrands();
  },
  async popularBrands() {
    await delay(30);
    return dataService.popularBrands();
  },
  async brandProducts(slug: string) {
    await delay(30);
    return dataService.productsByBrand(slug);
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
