import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, History as HistIcon } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { useHistoryStore } from '../store/useHistoryStore';
import { formatRelativeTime } from '../lib/format';
import { useI18n } from '../i18n/useI18n';

export default function HistoryPage() {
  const items = useHistoryStore((s) => s.items);
  const remove = useHistoryStore((s) => s.remove);
  const clear = useHistoryStore((s) => s.clear);
  const add = useHistoryStore((s) => s.add);
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <>
      <TopBar title={t('history.title')} />
      <Page>
        <div className="pt-6 flex items-end justify-between">
          <div>
            <p className="font-serif italic text-2xs tracking-caps uppercase text-ink-400">
              § {t('history.ledger')}
            </p>
            <h1 className="mt-2 font-serif text-5xl sm:text-6xl font-bold tracking-tighter leading-[0.9]">
              {t('history.heading')}<span className="text-vermilion">.</span>
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-2xs font-mono uppercase tracking-caps text-ink-500"
            >
              {t('history.clearAll')}
            </button>
          )}
        </div>

        <div className="mt-10">
          <SectionHeader
            index="01"
            title={t('history.allLookups')}
            meta={items.length === 0 ? t('common.empty') : `${items.length} ${t('history.allLookups').toLowerCase()}`}
          />
          {items.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-ink-300 dark:border-ink-700">
              <HistIcon size={28} strokeWidth={1.5} className="mx-auto text-ink-400" />
              <p className="mt-4 font-serif text-xl">{t('history.empty.title')}</p>
              <p className="mt-1 text-2xs font-mono uppercase tracking-caps text-ink-500">
                {t('history.empty.hint')}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-ink-300 dark:divide-ink-700">
              {items.map((h) => (
                <li
                  key={h.id}
                  className="group flex items-center justify-between gap-3 py-3"
                >
                  <button
                    onClick={() => {
                      add(h.q);
                      navigate(`/search?q=${encodeURIComponent(h.q)}`);
                    }}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="font-serif text-lg truncate">{h.q}</div>
                    <div className="font-mono text-2xs uppercase tracking-caps text-ink-500">
                      {formatRelativeTime(new Date(h.ts).toISOString())}
                    </div>
                  </button>
                  <button
                    onClick={() => remove(h.id)}
                    className="opacity-0 group-hover:opacity-100 text-2xs font-mono uppercase tracking-caps text-ink-500"
                  >
                    {t('common.remove')}
                  </button>
                  <ArrowUpRight size={16} strokeWidth={1.5} className="text-ink-400" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Page>
      <BottomNav />
    </>
  );
}
