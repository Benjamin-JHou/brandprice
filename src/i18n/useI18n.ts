// i18n hook：返回 t 函数和当前语言
import { useCallback, useMemo } from 'react';
import { translations, type Lang, type TranslationKey } from './translations';
import { useSettingsStore } from '../store/useSettingsStore';

function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function useI18n() {
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const dict = translations[language];

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      const raw = (dict[key] as string | undefined) ?? translations.zh[key] ?? key;
      return format(raw, vars);
    },
    [dict],
  );

  return useMemo(
    () => ({
      t,
      lang: language,
      setLang: setLanguage,
    }),
    [t, language, setLanguage],
  );
}

export type { Lang };
