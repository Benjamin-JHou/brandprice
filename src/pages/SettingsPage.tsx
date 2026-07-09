import { useState } from 'react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { useSettingsStore } from '../store/useSettingsStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useI18n } from '../i18n/useI18n';
import { ArrowUpRight } from 'lucide-react';

export default function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const clearHistory = useHistoryStore((s) => s.clear);
  const slugs = useFavoritesStore((s) => s.slugs);

  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const [confirmClearCache, setConfirmClearCache] = useState(false);

  const handleClearHistory = () => {
    if (!confirmClearHistory) {
      setConfirmClearHistory(true);
      return;
    }
    clearHistory();
    setConfirmClearHistory(false);
  };

  const handleClearCache = () => {
    if (!confirmClearCache) {
      setConfirmClearCache(true);
      return;
    }
    localStorage.clear();
    window.location.reload();
  };

  const handleExport = () => {
    const data = JSON.stringify(slugs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brandprice-favorites-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopBar title={t('settings.title')} />
      <Page>
        {/* Language Section */}
        <section className="mt-6 mb-10">
          <SectionHeader
            index="01"
            title={t('settings.section.language')}
            meta={t('settings.section.languageMeta')}
          />
          <div className="grid grid-cols-2 gap-2">
            {(['zh', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`py-3 border-2 font-mono text-2xs uppercase tracking-caps transition-colors ${
                  lang === l
                    ? 'border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink'
                    : 'border-ink text-ink hover:bg-ink hover:text-paper dark:border-paper dark:text-paper dark:hover:bg-paper dark:hover:text-ink'
                }`}
              >
                {l === 'zh' ? '中文' : 'English'}
              </button>
            ))}
          </div>
        </section>

        {/* Theme Section */}
        <section className="mb-10">
          <SectionHeader
            index="02"
            title={t('settings.section.theme')}
            meta={t('theme.appliesImmediately')}
          />
          <div className="grid grid-cols-3 gap-2">
            {(['system', 'light', 'dark'] as const).map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                className={`py-3 border-2 font-mono text-2xs uppercase tracking-caps transition-colors ${
                  theme === th
                    ? 'border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink'
                    : 'border-ink text-ink hover:bg-ink hover:text-paper dark:border-paper dark:text-paper dark:hover:bg-paper dark:hover:text-ink'
                }`}
              >
                {t(`theme.${th}`)}
              </button>
            ))}
          </div>
        </section>

        {/* Data Section */}
        <section className="mb-10">
          <SectionHeader
            index="03"
            title={t('settings.section.data')}
            meta={t('settings.controls')}
          />
          <div className="border-t-2 border-ink divide-y divide-ink">
            {/* Clear History */}
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <h3 className="font-serif font-bold text-base">
                  {t('settings.data.clearHistory.title')}
                </h3>
                <p className="text-2xs font-mono uppercase tracking-caps text-ink-500">
                  {t('settings.data.clearHistory.meta')}
                </p>
              </div>
              <button
                onClick={handleClearHistory}
                className={`px-3 py-1.5 border-2 text-2xs font-mono uppercase tracking-caps transition-colors ${
                  confirmClearHistory
                    ? 'border-vermilion bg-vermilion text-white'
                    : 'border-ink text-ink hover:bg-ink hover:text-paper dark:border-paper dark:text-paper dark:hover:bg-paper dark:hover:text-ink'
                }`}
              >
                {confirmClearHistory ? t('common.remove') : t('common.clear')}
              </button>
            </div>

            {/* Export Favorites */}
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <h3 className="font-serif font-bold text-base">
                  {t('settings.data.export.title')}
                </h3>
                <p className="text-2xs font-mono uppercase tracking-caps text-ink-500">
                  {t('settings.data.export.meta')}
                </p>
              </div>
              <button
                onClick={handleExport}
                className="px-3 py-1.5 border-2 border-ink text-ink text-2xs font-mono uppercase tracking-caps hover:bg-ink hover:text-paper dark:border-paper dark:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors"
              >
                {t('favorites.archive')}
              </button>
            </div>

            {/* Clear Cache */}
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <h3 className="font-serif font-bold text-base">
                  {t('settings.data.clearCache.title')}
                </h3>
                <p className="text-2xs font-mono uppercase tracking-caps text-ink-500">
                  {t('settings.data.clearCache.meta')}
                </p>
              </div>
              <button
                onClick={handleClearCache}
                className={`px-3 py-1.5 border-2 text-2xs font-mono uppercase tracking-caps transition-colors ${
                  confirmClearCache
                    ? 'border-vermilion bg-vermilion text-white'
                    : 'border-ink text-ink hover:bg-ink hover:text-paper dark:border-paper dark:text-paper dark:hover:bg-paper dark:hover:text-ink'
                }`}
              >
                {confirmClearCache ? t('common.remove') : t('common.clear')}
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-10">
          <SectionHeader
            index="04"
            title={t('settings.section.about')}
            meta={t('settings.colophon')}
          />
          <div className="font-serif text-sm leading-relaxed text-ink-700 dark:text-ink-300">
            <p className="italic">"{t('settings.about.tagline')}"</p>
            <p className="mt-3">{t('settings.about.body')}</p>
            <div className="mt-6 flex items-center justify-between font-mono text-2xs uppercase tracking-caps text-ink-500">
              <span>{t('settings.about.version', { year: new Date().getFullYear() })}</span>
              <a
                href="https://github.com/Benjamin-JHou/brandprice"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-vermilion transition-colors"
              >
                <span>GitHub</span>
                <ArrowUpRight size={10} />
              </a>
            </div>
          </div>
        </section>
      </Page>
      <BottomNav />
    </>
  );
}
