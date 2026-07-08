import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Bookmark, BookmarkCheck, Copy, Check } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { api } from '../lib/api';
import type { Brand } from '../lib/types';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useI18n } from '../i18n/useI18n';

export default function BrandPage() {
  const { slug = '' } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useI18n();

  const isFav = useFavoritesStore((s) => s.has(slug));
  const toggleFav = useFavoritesStore((s) => s.toggle);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.brand(slug)
      .then((b) => {
        if (!cancelled) setBrand(b);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <TopBar back />
        <Page>
          <div className="py-20 text-center">
            <div className="w-10 h-10 mx-auto border-2 border-ink border-t-vermilion rounded-full animate-spin" />
            <p className="mt-4 font-mono text-2xs uppercase tracking-caps text-ink-500">
              {t('search.skeleton.fetching')}
            </p>
          </div>
        </Page>
        <BottomNav />
      </>
    );
  }

  if (!brand) {
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

  const desc = lang === 'zh' ? brand.descriptionZh : brand.descriptionEn;

  return (
    <>
      <TopBar back title={brand.name.toLowerCase()} />
      <Page>
        <div className="pt-6">
          <div className="flex items-center gap-2 text-2xs font-mono uppercase tracking-caps text-ink-500">
            <span>{brand.country}</span>
            <span>·</span>
            <span className="font-mono text-ink-400">
              {brand.slug}
            </span>
          </div>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
            {brand.name}
          </h1>
          {brand.nameLocal && brand.nameLocal !== brand.name && (
            <p className="mt-1 font-serif text-xl text-ink-600 dark:text-ink-400">
              {brand.nameLocal}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3 text-sm font-mono text-ink-700 dark:text-ink-300">
            <span className="italic font-serif normal-case tracking-normal text-ink-500">
              "{brand.tagline}"
            </span>
          </div>

          <div className="mt-8 border-y-2 border-ink py-6">
            <div className="flex flex-col gap-3">
              <a
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-ink text-paper dark:bg-paper dark:text-ink py-4 font-serif uppercase tracking-caps text-sm active:opacity-90 transition-opacity"
              >
                <span>{t('detail.visitCta')}</span>
                <ExternalLink size={16} strokeWidth={1.5} />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleFav(brand.slug)}
                  className="flex items-center justify-center gap-2 py-3 border-2 border-ink text-2xs font-mono uppercase tracking-caps active:bg-ink active:text-paper"
                >
                  {isFav ? <BookmarkCheck size={14} strokeWidth={1.5} /> : <Bookmark size={14} strokeWidth={1.5} />}
                  {isFav ? t('detail.saved') : t('detail.save')}
                </button>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(brand.url);
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
            </div>
          </div>

          {/* Description Section */}
          <section className="mt-10">
            <SectionHeader
              index={t('detail.trend')}
              title={t('detail.priceHistory')}
              meta={t('detail.notes')}
            />
            <div className="font-serif text-base leading-relaxed text-ink-800 dark:text-ink-200 whitespace-pre-line">
              {desc}
            </div>
          </section>

          {/* Disclaimer */}
          <div className="mt-12 pt-6 border-t border-ink-300 dark:border-ink-700">
            <p className="text-2xs font-mono uppercase tracking-caps text-ink-400">
              {t('detail.disclaimer', { brand: brand.name })}
            </p>
          </div>
        </div>
      </Page>
      <BottomNav />
    </>
  );
}
