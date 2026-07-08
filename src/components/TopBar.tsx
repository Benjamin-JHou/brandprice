import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useI18n } from '../i18n/useI18n';
import { LiveDot } from './LiveDot';

type Props = {
  title?: string;
  back?: boolean;
  right?: React.ReactNode;
  className?: string;
};

export function TopBar({ title, back, right, className }: Props) {
  const { t, lang } = useI18n();
  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-paper/95 dark:bg-ink/95 backdrop-blur',
        'border-b-2 border-ink pt-safe',
        className,
      )}
    >
      <div className="mx-auto max-w-screen-sm h-12 px-4 sm:px-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {back ? (
            <Link
              to={-1 as unknown as string}
              onClick={(e) => {
                e.preventDefault();
                if (window.history.length > 1) window.history.back();
                else window.location.href = '/';
              }}
              aria-label={t('nav.back')}
              className="p-1.5 -ml-1.5 active:text-vermilion"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </Link>
          ) : (
            <Link to="/" className="font-serif italic font-bold text-lg tracking-tight">
              <span>Brand</span>
              <span className="text-vermilion">/</span>
              <span>Price</span>
            </Link>
          )}
          {title && (
            <span className="font-mono text-2xs uppercase tracking-caps text-ink-500 truncate">
              · {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {right}
          <LiveDot label={false} />
          <span
            className="font-mono text-[10px] uppercase tracking-caps text-ink-400"
            aria-hidden
          >
            {lang}
          </span>
        </div>
      </div>
    </header>
  );
}
