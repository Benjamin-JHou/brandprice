import { useI18n } from '../i18n/useI18n';
import { Check, Languages } from 'lucide-react';

const LANGS = [
  { value: 'zh' as const, label: '中文', sub: '简体' },
  { value: 'en' as const, label: 'English', sub: 'EN' },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <ul className="border-2 border-ink divide-y-2 divide-ink">
      {LANGS.map((l) => {
        const active = l.value === lang;
        return (
          <li key={l.value}>
            <button
              onClick={() => setLang(l.value)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left active:bg-ink active:text-paper"
            >
              <div className="flex items-center gap-3">
                <Languages
                  size={16}
                  strokeWidth={1.5}
                  className={active ? 'text-vermilion' : 'text-ink-400'}
                />
                <div>
                  <div className="font-serif text-lg leading-tight">{l.label}</div>
                  <div className="text-2xs font-mono uppercase tracking-caps text-ink-500">
                    {l.sub}
                  </div>
                </div>
              </div>
              {active && (
                <Check size={16} strokeWidth={1.5} className="text-vermilion" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
