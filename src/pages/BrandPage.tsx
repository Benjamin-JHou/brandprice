import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { ProductCard } from '../components/ProductCard';
import { api } from '../lib/api';
import type { Brand, Product } from '../lib/types';
import { useI18n } from '../i18n/useI18n';

export default function BrandPage() {
  const { slug = '' } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([api.brands(), api.brandProducts(slug)])
      .then(([brands, items]) => {
        if (cancelled) return;
        setBrand(brands.find((b) => b.slug === slug) ?? null);
        setProducts(items);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <>
      <TopBar back title={t('brand.house')} />
      <Page>
        <div className="pt-6">
          <p className="font-serif italic text-2xs tracking-caps uppercase text-ink-400">
            § {t('brand.house')}
          </p>
          <h1 className="mt-2 font-serif text-5xl sm:text-6xl font-bold tracking-tighter leading-[0.9]">
            {brand?.name ?? slug}
          </h1>
          {brand && (
            <>
              {brand.nameLocal && brand.nameLocal !== brand.name && (
                <p className="mt-2 font-serif text-2xl text-ink-700 dark:text-ink-300">
                  {brand.nameLocal}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3 text-2xs font-mono uppercase tracking-caps text-ink-500">
                <span>{brand.country}</span>
                <span>·</span>
                <span className="italic font-serif normal-case tracking-normal text-ink-700 dark:text-ink-300">
                  "{brand.tagline}"
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mt-10">
          <SectionHeader
            index={t('brand.catalogue')}
            title={t('brand.catalogue') === 'catalogue' ? 'In stock now' : '现货清单'}
            meta={
              loading
                ? t('brand.fetching')
                : t('brand.itemCount.other', { n: products.length })
            }
          />
          {loading ? (
            <div className="space-y-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 image-grid animate-pulse" />
              ))}
            </div>
          ) : (
            <div>
              {products.map((p, i) => (
                <ProductCard key={p.sku} product={p} rank={i + 1} />
              ))}
            </div>
          )}
        </div>
      </Page>
      <BottomNav />
    </>
  );
}
