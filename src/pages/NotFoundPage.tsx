import { Link } from 'react-router-dom';
import { Page } from '../components/Page';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { useI18n } from '../i18n/useI18n';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <>
      <TopBar back />
      <Page>
        <div className="py-24 text-center">
          <p className="font-serif italic text-2xs tracking-caps uppercase text-ink-400">
            404 · not in catalogue
          </p>
          <h1 className="mt-4 font-serif text-7xl font-bold tracking-tighter">
            {t('detail.notFound')}<span className="text-vermilion">.</span>
          </h1>
          <p className="mt-4 max-w-sm mx-auto font-serif text-base text-ink-700 dark:text-ink-300">
            {t('detail.backToSearch')}
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-ink text-paper dark:bg-paper dark:text-ink px-6 py-3 font-serif uppercase tracking-caps text-xs"
          >
            {t('nav.home')}
          </Link>
        </div>
      </Page>
      <BottomNav />
    </>
  );
}
