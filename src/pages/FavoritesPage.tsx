import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { api } from '../lib/api';
import type { Brand } from '../lib/types';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useI18n } from '../i18n/useI18n';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  const slugs = useFavoritesStore((s) => s.slugs);
  const { t } = useI18n();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.brands()
      .then((all) => {
        if (cancelled) return;
        const filtered = all.filter((b) => slugs[b.slug] === true);
        setFavorites(filtered);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slugs]);

  return (
    <>
      <TopBar title={t('favorites.title')} />
      <Page>
        <div className="pt-6 mb-8">
          <p className="text-sm font-serif italic text-ink-600 dark:text-ink-400">
            {t('favorites.subtitle')}
          </p>
        </div>

        <SectionHeader
          index="01"
          title={t('favorites.favs')}
          meta={t('brand.itemCount.other', { n: favorites.length })}
        />

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-ink border-t-vermilion rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-ink-300 dark:border-ink-700">
            <Bookmark size={28} strokeWidth={1.5} className="mx-auto text-ink-400" />
            <p className="mt-4 font-serif text-xl">{t('favorites.empty.title')}</p>
            <p className="mt-1 text-2xs font-mono uppercase tracking-caps text-ink-500 max-w-xs mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.map((b) => (
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
