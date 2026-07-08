import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ExternalLink, Bookmark, BookmarkCheck, Bell, BellOff, Copy, Check, RefreshCw } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { Sparkline } from '../components/Sparkline';
import { LiveDot } from '../components/LiveDot';
import { useProduct } from '../hooks/useProduct';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { formatConvertedPrice, formatRelativeTime, formatDateShort } from '../lib/format';
import type { PricePoint } from '../lib/types';
import { useI18n } from '../i18n/useI18n';

const RANGES_EN = [
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '180D', days: 180 },
];

const RANGES_ZH = [
  { label: '30天', days: 30 },
  { label: '90天', days: 90 },
  { label: '180天', days: 180 },
];

export default function ProductDetailPage() {
  const { sku = '' } = useParams();
  const { data, loading, refreshing, error, refresh } = useProduct(sku);
  const userCcy = useSettingsStore((s) => s.currency);
  const { t, lang } = useI18n();
  const RANGES = lang === 'zh' ? RANGES_ZH : RANGES_EN;

  const isFav = useFavoritesStore((s) => (data ? s.has(data.sku) : false));
  const savedPrice = useFavoritesStore((s) => (data ? s.prices[data.sku] : undefined));
  const toggleFav = useFavoritesStore((s) => s.toggle);

  const hasSub = useFavoritesStore((s) => (data ? s.hasSub(data.sku) : false));
  const subscribe = useFavoritesStore((s) => s.subscribe);
  const unsubscribe = useFavoritesStore((s) => s.unsubscribe);

  const [range, setRange] = useState<(typeof RANGES)[number]>(RANGES[0]);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [subOpen, setSubOpen] = useState(false);
  const [subValue, setSubValue] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!data) return;
    setHistory(data.priceHistory.slice(-range.days));
    setSubValue(Math.round(data.price * 0.85).toString());
  }, [data, range]);

  if (loading) {
    return (
      <>
        <TopBar back />
        <Page>
          <div className="py-20 text-center">
            <div className="w-10 h-10 mx-auto border-2 border-ink border-t-vermilion rounded-full animate-spin" />
            <p className="mt-4 font-mono text-2xs uppercase tracking-caps text-ink-500">
              {t('detail.fetching')}
            </p>
          </div>
        </Page>
        <BottomNav />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <TopBar back />
        <Page>
          <div className="py-20 text-center">
            <p className="font-serif text-2xl">{t('detail.notFound')}</p>
            <Link
              to="/"
              className="mt-4 inline-block text-2xs font-mono uppercase tracking-caps text-vermilion"
            >
              {t('detail.backToSearch')}
            </Link>
          </div>
        </Page>
        <BottomNav />
      </>
    );
  }

  const minPrice = history.length ? Math.min(...history.map((h) => h.price)) : data.price;
  const maxPrice = history.length ? Math.max(...history.map((h) => h.price)) : data.price;
  const priceDelta = savedPrice !== undefined ? data.price - savedPrice : 0;
  const onSale = data.originalPrice > data.price;
  const off = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);

  const colorAndSize = data.size
    ? `${data.color} · ${t('detail.size', { size: data.size })}`
    : data.color;

  return (
    <>
      <TopBar back title={data.brand.toLowerCase()} />
      <Page>
        <div className="pt-6">
          <div className="flex items-center gap-2 text-2xs font-mono uppercase tracking-caps text-ink-500">
            <span>{data.brand}</span>
            <span>·</span>
            <span>{data.category}</span>
            <span className="ml-auto font-mono tnum text-ink-400">
              {t('detail.sku', { sku: data.sku })}
            </span>
          </div>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.05]">
            {data.name}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm font-mono text-ink-700 dark:text-ink-300">
            <span className="uppercase tracking-caps">{colorAndSize}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-2xs uppercase tracking-caps">
              <span
                className={`w-1.5 h-1.5 rounded-full ${data.inStock ? 'bg-moss' : 'bg-vermilion'}`}
              />
              {data.inStock ? t('detail.inStock') : t('detail.soldOut')}
            </span>
          </div>

          <div className="mt-8 border-y-2 border-ink py-8">
            <p className="text-2xs font-mono uppercase tracking-caps text-ink-500">
              {t('detail.currentPrice')} · {data.currency}
            </p>
            <div className="mt-3 flex items-baseline gap-4">
              <div className="font-mono tnum font-bold text-vermilion text-5xl sm:text-6xl tracking-tight leading-none">
                {formatConvertedPrice(data.price, data.currency, userCcy)}
              </div>
              {onSale && (
                <div className="flex flex-col">
                  <span className="font-mono tnum text-base line-through text-ink-400">
                    {formatConvertedPrice(data.originalPrice, data.currency, userCcy)}
                  </span>
                  <span className="mt-1 inline-block bg-mustard text-ink text-2xs font-mono uppercase tracking-caps px-1.5 py-0.5 self-start">
                    −{off}% {t('detail.onSale')}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2 text-2xs font-mono uppercase tracking-caps text-ink-500">
              <LiveDot label />
              <span>{t('detail.fetched', { time: formatRelativeTime(data.fetchedAt) })}</span>
              <span aria-hidden>·</span>
              <button
                onClick={refresh}
                disabled={refreshing}
                className="inline-flex items-center gap-1 underline decoration-dotted disabled:opacity-50"
                aria-label={t('common.refresh')}
              >
                <RefreshCw
                  size={11}
                  strokeWidth={1.5}
                  className={refreshing ? 'animate-spin' : ''}
                />
                <span>{refreshing ? t('common.refreshing') : t('common.refresh')}</span>
              </button>
              <span aria-hidden>·</span>
              <Link to="/settings" className="underline decoration-dotted">
                {t('common.changeCurrency')}
              </Link>
            </div>
            {savedPrice !== undefined && (
              <p
                className={`mt-1 text-2xs font-mono uppercase tracking-caps ${
                  priceDelta < 0 ? 'text-moss' : priceDelta > 0 ? 'text-vermilion' : 'text-ink-500'
                }`}
              >
                {priceDelta === 0
                  ? t('detail.sameAsSaved')
                  : priceDelta < 0
                    ? t('detail.dropped', {
                        amount: formatConvertedPrice(Math.abs(priceDelta), data.currency, userCcy),
                      })
                    : t('detail.up', {
                        amount: formatConvertedPrice(priceDelta, data.currency, userCcy),
                      })}
              </p>
            )}
          </div>

          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-3 w-full bg-ink text-paper dark:bg-paper dark:text-ink py-4 font-serif uppercase tracking-caps text-sm active:opacity-90"
          >
            <span>{t('detail.visitCta')}</span>
            <ExternalLink size={16} strokeWidth={1.5} />
          </a>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              onClick={() => toggleFav(data.sku, data.price)}
              className="flex items-center justify-center gap-2 py-3 border-2 border-ink text-2xs font-mono uppercase tracking-caps active:bg-ink active:text-paper"
            >
              {isFav ? <BookmarkCheck size={14} strokeWidth={1.5} /> : <Bookmark size={14} strokeWidth={1.5} />}
              {isFav ? t('detail.saved') : t('detail.save')}
            </button>
            <button
              onClick={() => setSubOpen((v) => !v)}
              className="flex items-center justify-center gap-2 py-3 border-2 border-ink text-2xs font-mono uppercase tracking-caps active:bg-ink active:text-paper"
            >
              {hasSub ? <BellOff size={14} strokeWidth={1.5} /> : <Bell size={14} strokeWidth={1.5} />}
              {hasSub ? t('detail.alertOn') : t('detail.alert')}
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(data.url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {
                  // ignore
                }
              }}
              className="flex items-center justify-center gap-2 py-3 border-2 border-ink text-2xs font-mono uppercase tracking-caps active:bg-ink active:text-paper"
            >
              {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
              {copied ? t('detail.copied') : t('detail.copyUrl')}
            </button>
          </div>

          {subOpen && (
            <div className="mt-3 border-2 border-ink p-4">
              <p className="text-2xs font-mono uppercase tracking-caps text-ink-500">
                {t('detail.notifyBelow')}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-2xl text-vermilion">{data.currency}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={subValue}
                  onChange={(e) => setSubValue(e.target.value)}
                  className="flex-1 bg-transparent border-b-2 border-ink focus:border-vermilion focus:outline-none py-1 font-mono text-xl"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    const v = parseFloat(subValue);
                    if (!isNaN(v) && v > 0) {
                      subscribe({ sku: data.sku, thresholdPrice: v, createdAt: new Date().toISOString() });
                    }
                    setSubOpen(false);
                  }}
                  className="flex-1 bg-ink text-paper dark:bg-paper dark:text-ink py-2.5 text-2xs font-mono uppercase tracking-caps"
                >
                  {hasSub ? t('detail.update') : t('detail.subscribe')}
                </button>
                {hasSub && (
                  <button
                    onClick={() => {
                      unsubscribe(data.sku);
                      setSubOpen(false);
                    }}
                    className="px-4 py-2.5 border-2 border-ink text-2xs font-mono uppercase tracking-caps"
                  >
                    {t('common.cancel')}
                  </button>
                )}
              </div>
            </div>
          )}

          <section className="mt-10">
            <SectionHeader
              index={t('detail.trend')}
              title={t('detail.priceHistory')}
              meta={t('detail.historyMeta', {
                n: data.priceHistory.length,
                low: formatConvertedPrice(minPrice, data.currency, userCcy),
                high: formatConvertedPrice(maxPrice, data.currency, userCcy),
              })}
              action={
                <div className="flex gap-1 shrink-0">
                  {RANGES.map((r) => (
                    <button
                      key={r.days}
                      onClick={() => setRange(r)}
                      className={`px-2 py-1 text-2xs font-mono uppercase tracking-caps border ${
                        r.days === range.days
                          ? 'border-ink bg-ink text-paper dark:bg-paper dark:text-ink'
                          : 'border-ink-300 dark:border-ink-700'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="border-2 border-ink p-4">
              <Sparkline data={history} height={120} width={600} />
              <div className="mt-3 flex items-center justify-between text-2xs font-mono uppercase tracking-caps text-ink-500">
                <span>{formatDateShort(history[0]?.date ?? data.priceHistory[0].date)}</span>
                <span className="text-vermilion">
                  {formatConvertedPrice(history[history.length - 1]?.price ?? data.price, data.currency, userCcy)}
                </span>
                <span>{formatDateShort(history[history.length - 1]?.date ?? data.priceHistory[0].date)}</span>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <SectionHeader index={t('detail.notes')} title={t('detail.notes')} meta={t('detail.editorMeta')} />
            <p className="font-serif text-base leading-relaxed">{data.description}</p>
            <p className="mt-4 text-2xs font-mono uppercase tracking-caps text-ink-400">
              {t('detail.disclaimer', { brand: data.brand })}
            </p>
          </section>
        </div>
      </Page>
      <BottomNav />
    </>
  );
}
