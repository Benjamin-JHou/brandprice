import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency } from '../lib/types';
import type { Lang } from '../i18n/translations';

type Theme = 'light' | 'dark' | 'system';

type SettingsState = {
  language: Lang;
  currency: Currency;
  theme: Theme;
  setLanguage: (l: Lang) => void;
  setCurrency: (c: Currency) => void;
  setTheme: (t: Theme) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // 默认中文版本
      language: 'zh',
      currency: 'KRW',
      theme: 'system',
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'bp.settings',
      version: 3,
      // 老数据迁移：自动补上默认 language 与 currency
      migrate: (persisted: any, _version) => {
        return {
          language: 'zh',
          currency: 'KRW',
          theme: 'system',
          ...(persisted as object),
        } as SettingsState;
      },
    },
  ),
);
