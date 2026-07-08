import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Bell } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { PriceTag } from '../components/PriceTag';
import { Sparkline } from '../components/Sparkline';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { api } from '../lib/api';
import type { Product } from '../lib/types';
import { formatRelativeTime, formatConvertedPrice } from '../lib/format';
import { useSettingsStore } from '../store/useSettingsStore';
import { useI18n } from '../i18n/useI18n';

export default function FavoritesPage() {
  const prices = useFavoritesStore((s) => s.prices);
  const subscriptions = useFavoritesStore((s) => s.subscriptions);
  const toggle = useFavoritesStore((s) => s.toggle);
  const userCcy = useSettingsStore((s) => s.currency);
  const { t, lang } = useI18n();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const skus = Object.keys(prices);
    if (skus.length === 0) {
      setItems([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(skus.map((sku) => api.product(sku).catch(() => null)))
      .then((results) => {
        if (cancelled) return;
        setItems(results.filter((x): x is Product => x !== null));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [prices]);

  return (
    <>
      <TopBar title={t('favorites.saved')} />
      <Page>
        <div className="pt-6">
          <p className="font-serif italic text-2xs tracking-caps uppercase text-ink-400">
            § {t('favorites.archive')}
          </p>
          <h1 className="mt-2 font-serif text-5xl sm:text-6xl font-bold tracking-tighter leading-[0.9]">
            {t('favorites.title')}<span className="text-vermilion">.</span>
          </h1>
          <p className="mt-3 max-w-sm font-serif text-base text-ink-700 dark:text-ink-300">
            {t('favorites.subtitle')}
          </p>
        </div>

        <div className="mt-10">
          <SectionHeader
            index="01"
            title={t('favorites.favs')}
            meta={loading ? t('common.loading') : `${items.length}`}
          />
          {items.length === 0 && !loading ? (
            <div className="py-16 text-center border-2 border-dashed border-ink-300 dark:border-ink-700">
              <Bookmark size={28} strokeWidth={1.5} className="mx-auto text-ink-400" />
              <p className="mt-4 font-serif text-xl">{t('favorites.empty.title')}</p>
              <p className="mt-1 text-2xs font-mono uppercase tracking-caps text-ink-500">
                {t('favorites.empty.hint')}
              </p>
              <Link
                to="/"
                className="mt-6 inline-block text-2xs font-mono uppercase tracking-caps text-vermilion"
              >
                {t('favorites.empty.cta')}
              </Link>
            </div>
          ) : (
            <div>
              {items.map((p) => {
                const saved = prices[p.sku];
                const delta = saved !== undefined ? p.price - saved : 0;
                return (
                  <article key={p.sku} className="border-t-2 border-ink py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-2xs uppercase tracking-caps text-ink-500">
                          {p.brand} · {p.category}
                        </p>
                        <Link
                          to={`/product/${p.sku}`}
                          className="block font-serif text-xl mt-1 truncate"
                        >
                          {p.name}
                        </Link>
                        <p className="mt-1 text-2xs font-mono uppercase tracking-caps text-ink-500">
                          {p.color}
                          {p.size && ` · ${t('detail.size', { size: p.size })}`}
                          {' · '}
                          {t('favorites.savedAt', { price: formatConvertedPrice(saved, p.currency, userCcy) })}
                        </p>
                      </div>
                      <button
                        aria-label={t('common.remove')}
                        onClick={() => toggle(p.sku, p.price)}
                        className="text-2xs font-mono uppercase tracking-caps text-ink-500 px-2 py-1 active:text-vermilion"
                      >
                        {t('common.remove')}
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-[1fr_auto] gap-4 items-end">
                      <div>
                        <Sparkline data={p.priceHistory.slice(-30)} height={48} width={400} />
                        <div className="mt-1 flex items-center justify-between text-2xs font-mono uppercase tracking-caps text-ink-400">
                          <span>{t('favorites.trend30d')}</span>
                          <span>{lang === 'zh' ? '更新于' : 'updated'} {formatRelativeTime(p.fetchedAt)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <PriceTag
                          amount={p.price}
                          currency={p.currency}
                          size="lg"
                          originalAmount={p.originalPrice > p.price ? p.originalPrice : undefined}
                        />
                        {delta !== 0 && (
                          <p
                            className={`mt-2 text-2xs font-mono uppercase tracking-caps ${
                              delta < 0 ? 'text-moss' : 'text-vermilion'
                            }`}
                          >
                            {delta < 0
                              ? t('favorites.dropped', { amount: formatConvertedPrice(Math.abs(delta), p.currency, userCcy) })
                              : t('favorites.up', { amount: formatConvertedPrice(delta, p.currency, userCcy) })}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10">
          <SectionHeader
            index="02"
            title={t('favorites.alerts')}
            meta={`${subscriptions.length} active`}
          />
          {subscriptions.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-ink-300 dark:border-ink-700">
              <Bell size={24} strokeWidth={1.5} className="mx-auto text-ink-400" />
              <p className="mt-3 font-serif italic text-ink-500">{t('favorites.alerts.empty.title')}</p>
              <p className="mt-1 text-2xs font-mono uppercase tracking-caps text-ink-400 max-w-xs mx-auto">
                {t('favorites.alerts.empty.hint')}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-ink-300 dark:divide-ink-700">
              {subscriptions.map((sub) => {
                const p = items.find((x) => x.sku === sub.sku);
                return (
                  <li key={sub.sku} className="py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${sub.sku}`}
                        className="font-serif text-base truncate block"
                      >
                        {p?.name ?? sub.sku}
                      </Link>
                      <p className="font-mono text-2xs uppercase tracking-caps text-ink-500">
                        {t('favorites.target')}{' '}
                        <span className="text-vermilion">
                          {formatConvertedPrice(sub.thresholdPrice, p?.currency ?? 'USD', userCcy)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => useFavoritesStore.getState().unsubscribe(sub.sku)}
                      className="text-2xs font-mono uppercase tracking-caps text-ink-500"
                    >
                      {t('favorites.cancel')}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Page>
      <BottomNav />
    </>
  );
}
