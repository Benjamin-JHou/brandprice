import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FavoritesState = {
  /** 品牌 slug -> 是否收藏 */
  slugs: Record<string, boolean>;
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      slugs: {},
      toggle: (slug) => {
        const cur = get().slugs;
        const next = { ...cur };
        if (next[slug]) {
          delete next[slug];
        } else {
          next[slug] = true;
        }
        set({ slugs: next });
      },
      has: (slug) => get().slugs[slug] === true,
    }),
    { name: 'bp.favorites.brands' },
  ),
);
