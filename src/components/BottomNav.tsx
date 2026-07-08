import { Link, useLocation } from 'react-router-dom';
import { Search, Bookmark, Clock, Settings as Cog } from 'lucide-react';
import { cn } from '../lib/utils';
import { useI18n } from '../i18n/useI18n';

const items = [
  { to: '/', key: 'nav.search' as const, icon: Search },
  { to: '/history', key: 'nav.history' as const, icon: Clock },
  { to: '/favorites', key: 'nav.saved' as const, icon: Bookmark },
  { to: '/settings', key: 'nav.settings' as const, icon: Cog },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t-2 border-ink bg-paper/95 dark:bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80 dark:supports-[backdrop-filter]:bg-ink/80 pb-safe">
      <ul className="grid grid-cols-4 max-w-screen-sm mx-auto">
        {items.map((item) => {
          const active =
            item.to === '/'
              ? pathname === '/' || pathname.startsWith('/search') || pathname.startsWith('/brand') || pathname.startsWith('/product')
              : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 h-14 text-2xs uppercase tracking-caps font-mono',
                  active ? 'text-vermilion' : 'text-ink-500',
                )}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span>{t(item.key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
