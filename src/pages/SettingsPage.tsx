import { ChevronRight, Trash2, Download, Sun, Moon, Monitor, Check, type LucideIcon } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { useSettingsStore } from '../store/useSettingsStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { CURRENCIES, CURRENCY_LABEL, type Currency } from '../lib/types';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useI18n } from '../i18n/useI18n';
import type { TranslationKey } from '../i18n/translations';

const THEMES: { value: 'system' | 'light' | 'dark'; key: TranslationKey; icon: LucideIcon }[] = [
  { value: 'system', key: 'theme.auto', icon: Monitor },
  { value: 'light', key: 'theme.light', icon: Sun },
  { value: 'dark', key: 'theme.dark', icon: Moon },
];

export default function SettingsPage() {
  const currency = useSettingsStore((s) => s.currency);
  const setCurrency = useSettingsStore((s) => s.setCurrency);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const clearHistory = useHistoryStore((s) => s.clear);
  const favorites = useFavoritesStore((s) => s.prices);
  const subscriptions = useFavoritesStore((s) => s.subscriptions);
  const { t } = useI18n();

  const exportData = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      favorites,
      subscriptions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brandprice-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopBar title={t('settings.title')} />
      <Page>
        <div className="pt-6">
          <p className="font-serif italic text-2xs tracking-caps uppercase text-ink-400">
            § {t('settings.controls')}
          </p>
          <h1 className="mt-2 font-serif text-5xl sm:text-6xl font-bold tracking-tighter leading-[0.9]">
            {t('settings.heading')}<span className="text-vermilion">.</span>
          </h1>
        </div>

        <div className="mt-10">
          <SectionHeader
            index="00"
            title={t('settings.section.language')}
            meta={t('settings.section.languageMeta')}
          />
          <LanguageSwitcher />
        </div>

        <div className="mt-10">
          <SectionHeader
            index="01"
            title={t('currency.title')}
            meta={t('currency.subtitle')}
          />
          <ul className="border-2 border-ink divide-y-2 divide-ink">
            {CURRENCIES.map((c) => {
              const active = c === currency;
              return (
                <li key={c}>
                  <button
                    onClick={() => setCurrency(c)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left active:bg-ink active:text-paper"
                  >
                    <div>
                      <div className="font-serif text-lg">{c}</div>
                      <div className="text-2xs font-mono uppercase tracking-caps text-ink-500">
                        {CURRENCY_LABEL[c as Currency]}
                      </div>
                    </div>
                    {active ? (
                      <Check size={16} strokeWidth={1.5} className="text-vermilion" />
                    ) : (
                      <ChevronRight size={16} strokeWidth={1.5} className="text-ink-400" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10">
          <SectionHeader index="02" title={t('settings.section.theme')} meta={t('theme.appliesImmediately')} />
          <div className="grid grid-cols-3 gap-0 border-2 border-ink">
            {THEMES.map((th) => {
              const active = th.value === theme;
              const Icon = th.icon;
              return (
                <button
                  key={th.value}
                  onClick={() => setTheme(th.value)}
                  className={`flex flex-col items-center gap-2 py-4 ${
                    active
                      ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                      : 'text-ink-500'
                  } border-r-2 border-ink last:border-r-0`}
                >
                  <Icon size={20} strokeWidth={1.5} />
                  <span className="font-mono text-2xs uppercase tracking-caps">{t(th.key)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          <SectionHeader index="03" title={t('settings.section.data')} meta="local only" />
          <ul className="border-2 border-ink divide-y-2 divide-ink">
            <li>
              <button
                onClick={() => {
                  if (confirm(t('common.confirmClearHistory'))) clearHistory();
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left active:bg-ink active:text-paper"
              >
                <div>
                  <div className="font-serif text-lg">{t('settings.data.clearHistory.title')}</div>
                  <div className="text-2xs font-mono uppercase tracking-caps text-ink-500">
                    {t('settings.data.clearHistory.meta')}
                  </div>
                </div>
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </li>
            <li>
              <button
                onClick={exportData}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left active:bg-ink active:text-paper"
              >
                <div>
                  <div className="font-serif text-lg">{t('settings.data.export.title')}</div>
                  <div className="text-2xs font-mono uppercase tracking-caps text-ink-500">
                    {t('settings.data.export.meta')}
                  </div>
                </div>
                <Download size={16} strokeWidth={1.5} />
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (confirm(t('common.confirmClearCache'))) {
                    if ('caches' in window) {
                      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
                    }
                    location.reload();
                  }
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left active:bg-ink active:text-paper"
              >
                <div>
                  <div className="font-serif text-lg">{t('settings.data.clearCache.title')}</div>
                  <div className="text-2xs font-mono uppercase tracking-caps text-ink-500">
                    {t('settings.data.clearCache.meta')}
                  </div>
                </div>
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <SectionHeader index="04" title={t('settings.section.about')} meta={t('settings.colophon')} />
          <div className="font-serif text-sm leading-relaxed text-ink-700 dark:text-ink-300">
            <p>
              <span className="font-semibold">BrandPrice</span> · {t('settings.about.body')}
            </p>
            <p className="mt-3 text-ink-500">{t('settings.about.tagline')}</p>
            <p className="mt-6 text-2xs font-mono uppercase tracking-caps text-ink-400">
              {t('settings.about.version', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </Page>
      <BottomNav />
    </>
  );
}
