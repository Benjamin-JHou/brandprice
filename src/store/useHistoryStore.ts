import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type HistoryEntry = {
  id: string;
  q: string;
  brand: string | null;
  ts: number;
};

type HistoryState = {
  items: HistoryEntry[];
  add: (q: string, brand?: string | null) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      add: (q, brand = null) => {
        const trimmed = q.trim();
        if (!trimmed) return;
        set((s) => {
          const next = [
            { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, q: trimmed, brand, ts: Date.now() },
            ...s.items.filter((x) => x.q.toLowerCase() !== trimmed.toLowerCase()),
          ];
          return { items: next.slice(0, 30) };
        });
      },
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'bp.history' },
  ),
);
