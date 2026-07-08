import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '../i18n/translations';

type Theme = 'light' | 'dark' | 'system';

type SettingsState = {
  language: Lang;
  theme: Theme;
  setLanguage: (l: Lang) => void;
  setTheme: (t: Theme) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'zh',
      theme: 'system',
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'bp.settings.v4',
      version: 4,
      migrate: (persisted: any, _version) => {
        return {
          language: 'zh',
          theme: 'system',
          ...(persisted as object),
        } as SettingsState;
      },
    },
  ),
);
