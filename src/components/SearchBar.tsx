import { Search, X } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useI18n } from '../i18n/useI18n';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  autoFocus = false,
  className,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const { t } = useI18n();
  const ph = placeholder ?? t('home.searchPlaceholder');

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <div className={cn('relative w-full', className)}>
      <Search
        className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-400"
        size={18}
        strokeWidth={1.5}
      />
      <input
        ref={ref}
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        value={value}
        placeholder={ph}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit?.(value);
        }}
        className={cn(
          'w-full bg-transparent pl-8 pr-10 py-3',
          'font-serif text-xl sm:text-2xl font-medium tracking-tight',
          'placeholder:text-ink-400 placeholder:font-serif placeholder:italic',
          'border-b-2 border-ink focus:border-vermilion focus:outline-none',
          'transition-colors',
        )}
      />
      {value && (
        <button
          aria-label={t('common.cancel')}
          onClick={() => {
            onChange('');
            ref.current?.focus();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-ink-500 active:text-ink"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
