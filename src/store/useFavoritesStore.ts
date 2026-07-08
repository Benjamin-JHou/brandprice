import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Subscription } from '../lib/types';

type FavoritesState = {
  /** sku -> 入收藏时的快照价 */
  prices: Record<string, number>;
  subscriptions: Subscription[];
  toggle: (sku: string, currentPrice: number) => void;
  has: (sku: string) => boolean;
  subscribe: (sub: Subscription) => void;
  unsubscribe: (sku: string) => void;
  hasSub: (sku: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      prices: {},
      subscriptions: [],
      toggle: (sku, currentPrice) => {
        const cur = get().prices;
        if (cur[sku] !== undefined) {
          const { [sku]: _, ...rest } = cur;
          set({ prices: rest });
        } else {
          set({ prices: { ...cur, [sku]: currentPrice } });
        }
      },
      has: (sku) => get().prices[sku] !== undefined,
      subscribe: (sub) =>
        set((s) => ({ subscriptions: [...s.subscriptions.filter((x) => x.sku !== sub.sku), sub] })),
      unsubscribe: (sku) =>
        set((s) => ({ subscriptions: s.subscriptions.filter((x) => x.sku !== sku) })),
      hasSub: (sku) => get().subscriptions.some((x) => x.sku === sku),
    }),
    { name: 'bp.favorites' },
  ),
);
