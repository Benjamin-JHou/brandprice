import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, SearchX } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { LiveDot } from '../components/LiveDot';
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
                <span aria-hidden>·</span>
                <LiveDot label />
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
              <span className="font-mono not-italic text-ink-700 dark:text-ink-300"> JA12GR043</span>
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
          <div className="divide-y-0">
            {data.map((p, i) => (
              <ProductCard key={p.sku} product={p} rank={i + 1} />
            ))}
            {loading && data.length === 0 && (
              <div className="space-y-6">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-[88px_1fr] gap-4 py-5 border-t-2 border-ink">
                    <div className="aspect-square image-grid animate-pulse" />
                    <div className="space-y-2 pt-1">
                      <div className="h-2 w-1/3 bg-ink-300 dark:bg-ink-700 animate-pulse" />
                      <div className="h-4 w-2/3 bg-ink-300 dark:bg-ink-700 animate-pulse" />
                      <div className="h-6 w-1/2 bg-ink-300 dark:bg-ink-700 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Page>
      <BottomNav />
    </>
  );
}
