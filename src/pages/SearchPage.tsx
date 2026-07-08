import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, SearchX, ArrowUpRight } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { SearchBar } from '../components/SearchBar';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { useSearch } from '../hooks/useSearch';
import { useHistoryStore } from '../store/useHistoryStore';
import { useI18n } from '../i18n/useI18n';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const initial = params.get('q') ?? '';
  const [q, setQ] = useState(initial);
  const addHistory = useHistoryStore((s) => s.add);
  const { data, loading, elapsedMs, error, refresh } = useSearch(initial);
  const { t } = useI18n();

  useEffect(() => {
    setQ(initial);
  }, [initial]);

  const submit = (text: string) => {
    const t0 = text.trim();
    if (!t0) return;
    addHistory(t0);
    setParams({ q: t0 });
  };

  return (
    <>
      <TopBar back title={t('search.title')} />
      <Page>
        <div className="py-6">
          <SearchBar value={q} onChange={setQ} onSubmit={submit} />
        </div>

        <SectionHeader
          index="results"
          title={q || t('search.emptyQuery')}
          meta={
            error ? (
              <span className="text-vermilion">
                {t('common.error')} · {error}
              </span>
            ) : loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-pulse" />
                {t('search.searching')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="font-mono tnum">{t('search.resultCount.other', { n: data.length, ms: elapsedMs })}</span>
              </span>
            )
          }
          action={
            <button
              onClick={refresh}
              disabled={loading || !initial.trim()}
              aria-label={t('common.refresh')}
              className="inline-flex items-center gap-1.5 px-2 py-1 border-2 border-ink text-2xs font-mono uppercase tracking-caps active:bg-ink active:text-paper disabled:opacity-40 disabled:active:bg-transparent disabled:active:text-ink-500"
            >
              <RefreshCw
                size={12}
                strokeWidth={1.5}
                className={loading ? 'animate-spin' : ''}
              />
              <span>{loading ? t('common.refreshing') : t('common.refresh')}</span>
            </button>
          }
        />

        {error ? (
          <div className="py-12 text-center">
            <p className="font-serif text-lg text-vermilion">{t('search.failed.title')}</p>
            <p className="mt-1 text-2xs font-mono uppercase tracking-caps text-ink-500">
              {t('search.failed.hint')}
            </p>
          </div>
        ) : data.length === 0 && !loading ? (
          <div className="py-16 text-center border-2 border-dashed border-ink-300 dark:border-ink-700">
            <SearchX size={28} strokeWidth={1.5} className="mx-auto text-ink-400" />
            <p className="mt-4 font-serif text-xl">{t('search.empty.title')}</p>
            <p className="mt-1 text-2xs font-mono uppercase tracking-caps text-ink-500 max-w-xs mx-auto">
              {t('search.empty.hint')}
              <span className="font-mono not-italic text-ink-700 dark:text-ink-300"> ADER, Matin, 안데르손벨</span>
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-1 text-2xs font-mono uppercase tracking-caps text-vermilion"
            >
              <ArrowLeft size={12} strokeWidth={1.5} />
              {t('search.empty.back')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {data.map((b) => (
              <button
                key={b.slug}
                onClick={() => navigate(`/brand/${b.slug}`)}
                className="flex items-center justify-between p-4 border-2 border-ink hover:border-vermilion dark:border-ink hover:bg-ink-100 dark:hover:bg-ink-900 transition-colors text-left"
              >
                <div>
                  <div className="font-serif text-lg font-bold flex items-center gap-2">
                    <span>{b.name}</span>
                    {b.nameLocal && b.nameLocal !== b.name && (
                      <span className="text-sm font-sans font-normal text-ink-500">({b.nameLocal})</span>
                    )}
                  </div>
                  <div className="mt-1 text-2xs font-mono uppercase tracking-caps text-ink-400">
                    {b.tagline}
                  </div>
                </div>
                <ArrowUpRight size={18} strokeWidth={1.5} className="text-ink-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </Page>
      <BottomNav />
    </>
  );
}
