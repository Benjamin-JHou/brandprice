import { Link } from 'react-router-dom';
import { ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { PriceTag } from './PriceTag';
import { formatRelativeTime } from '../lib/format';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { cn } from '../lib/utils';
import type { Product } from '../lib/types';
import { useI18n } from '../i18n/useI18n';
import { LiveDot } from './LiveDot';

type Props = {
  product: Product;
  rank?: number;
};

export function ProductCard({ product, rank }: Props) {
  const isFav = useFavoritesStore((s) => s.has(product.sku));
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const isOnSale = product.originalPrice > product.price;
  const { t, lang } = useI18n();
  const updatedLabel = lang === 'zh' ? '更新于' : 'updated';

  return (
    <article className="card-lift group relative border-t-2 border-ink py-5">
      <div className="grid grid-cols-[88px_1fr_auto] gap-4 items-start">
        <Link to={`/product/${product.sku}`} className="block">
          <div
            className={cn(
              'aspect-square image-grid border border-ink-300 dark:border-ink-700',
              'flex items-center justify-center',
            )}
          >
            <span className="font-serif italic text-2xl text-ink-400">{product.brand.charAt(0)}</span>
          </div>
        </Link>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {rank !== undefined && (
              <span className="font-mono tnum text-2xs text-ink-400">
                {String(rank).padStart(2, '0')}
              </span>
            )}
            <span className="font-serif text-2xs uppercase tracking-caps text-ink-500 truncate">
              {product.brand}
            </span>
            {!product.inStock && (
              <span className="ml-auto font-mono text-2xs uppercase tracking-caps text-vermilion">
                ● {lang === 'zh' ? '售罄' : 'sold out'}
              </span>
            )}
          </div>
          <Link to={`/product/${product.sku}`}>
            <h3 className="mt-1 font-serif text-lg leading-snug truncate">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1 flex items-center gap-2 text-2xs font-mono text-ink-500">
            <span className="uppercase tracking-caps">{product.color}</span>
            {product.size && (
              <>
                <span>·</span>
                <span>Size {product.size}</span>
              </>
            )}
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <PriceTag
              amount={product.price}
              currency={product.currency}
              size="md"
              originalAmount={isOnSale ? product.originalPrice : undefined}
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-2xs font-mono text-ink-400">
            <LiveDot label={false} />
            <span>{updatedLabel} {formatRelativeTime(product.fetchedAt)}</span>
            {isOnSale && (
              <span className="ml-2 bg-mustard text-ink px-1.5 py-0.5 uppercase tracking-caps text-[10px]">
                {lang === 'zh' ? '促销' : 'on sale'}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            aria-label={isFav ? t('detail.saved') : t('detail.save')}
            onClick={() => toggleFav(product.sku, product.price)}
            className="p-1.5 -m-1.5 text-ink-700 dark:text-ink-300 active:text-vermilion"
          >
            {isFav ? (
              <BookmarkCheck size={18} strokeWidth={1.5} className="text-vermilion" />
            ) : (
              <Bookmark size={18} strokeWidth={1.5} />
            )}
          </button>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-2xs uppercase tracking-caps font-mono text-ink-500 hover:text-vermilion"
          >
            <span>{lang === 'zh' ? '前往' : 'visit'}</span>
            <ExternalLink size={11} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </article>
  );
}
