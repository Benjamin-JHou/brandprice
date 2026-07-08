import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search as SearchIcon } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { SearchBar } from '../components/SearchBar';
import { BrandChip } from '../components/BrandChip';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { LiveDot } from '../components/LiveDot';
import { api } from '../lib/api';
import { useHistoryStore } from '../store/useHistoryStore';
import type { Brand } from '../lib/types';
import { formatRelativeTime } from '../lib/format';
import { useI18n } from '../i18n/useI18n';

// K-fashion 热门词：中文版用品牌 + 类别；英文版用品牌 + 英文类别
const HOT_EN = [
  'ADER hoodie',
  'Matin Kim shirt',
  'Andersson Bell coat',
  'PAF vest',
  'Mardi Mercredi',
  'We11done denim',
  'Ato blazer',
  'RECTO oxford',
];

const HOT_ZH = [
  'ADER 连帽衫',
  '마틴킴 衬衫',
  '안데르손벨 大衣',
  'PAF 马甲',
  'Mardi Mercredi',
  'We11done 牛仔',
  'Ato 西装',
  'RECTO 牛津纺',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const history = useHistoryStore((s) => s.items);
  const addHistory = useHistoryStore((s) => s.add);
  const removeHistory = useHistoryStore((s) => s.remove);
  const { t, lang } = useI18n();
  const hot = lang === 'zh' ? HOT_ZH : HOT_EN;

  useEffect(() => {
    api.popularBrands().then(setBrands).catch(() => undefined);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const submit = (text: string) => {
    const t0 = text.trim();
    if (!t0) return;
    addHistory(t0);
    navigate(`/search?q=${encodeURIComponent(t0)}`);
  };

  return (
    <>
      <TopBar />
      <Page>
        {/* 简洁标题区：去掉长段介绍 */}
        <div className="pt-8 sm:pt-12 mb-8">
          <div className="flex items-center justify-between gap-3 mb-3">
            <LiveDot label size="md" text="auto" />
            <span className="text-2xs font-mono uppercase tracking-caps text-ink-400">
              {lang === 'zh' ? '实时 · 每 30 秒更新' : 'Live · updates every 30s'}
            </span>
          </div>
          <h1 className="font-serif text-[clamp(2.75rem,10vw,4.5rem)] font-bold tracking-tighter leading-[0.92]">
            {t('home.title.line1')}
            <br />
            {t('home.title.line2')}
            <span className="text-vermilion">.</span>
          </h1>
        </div>

        {/* 搜索区 */}
        <div className="mb-12">
          <SearchBar value={q} onChange={setQ} onSubmit={submit} autoFocus />
          <div className="mt-3 flex items-center justify-between gap-3 text-2xs font-mono uppercase tracking-caps text-ink-500">
            <span>{t('home.try')}</span>
            <div className="flex flex-wrap gap-x-3 gap-y-1 justify-end">
              {hot.map((p) => (
                <button
                  key={p}
                  onClick={() => submit(p)}
                  className="text-ink-500 hover:text-vermilion transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 热门品牌 */}
        <section className="mb-10">
          <SectionHeader
            index="01"
            title={t('home.popularBrands')}
            meta={t('home.popularMeta', { n: brands.length })}
          />
          <div className="-mx-5 sm:-mx-6 overflow-x-auto no-scrollbar">
            <div className="px-5 sm:px-6 flex gap-2 pb-2">
              {brands.map((b) => (
                <BrandChip key={b.slug} brand={b} />
              ))}
            </div>
          </div>
        </section>

        {/* 最近查询 */}
        <section className="mb-10">
          <SectionHeader
            index="02"
            title={t('home.recentLookups')}
            meta={
              history.length > 0
                ? t('home.recentMeta.few', { n: history.length })
                : t('home.recentMeta.empty')
            }
          />
          {history.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-ink-300 dark:border-ink-700">
              <SearchIcon size={20} strokeWidth={1.5} className="mx-auto text-ink-400" />
              <p className="mt-3 font-serif italic text-ink-500">{t('home.empty.title')}</p>
            </div>
          ) : (
            <ul className="divide-y divide-ink-300 dark:divide-ink-700">
              {history.slice(0, 8).map((h) => (
                <li
                  key={h.id}
                  className="group flex items-center justify-between gap-3 py-3"
                >
                  <button
                    onClick={() => submit(h.q)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="font-serif text-lg truncate">{h.q}</div>
                    <div className="font-mono text-2xs uppercase tracking-caps text-ink-500">
                      {formatRelativeTime(new Date(h.ts).toISOString())}
                    </div>
                  </button>
                  <button
                    onClick={() => removeHistory(h.id)}
                    className="opacity-0 group-hover:opacity-100 text-2xs font-mono uppercase tracking-caps text-ink-500"
                    aria-label={t('common.remove')}
                  >
                    {t('common.remove')}
                  </button>
                  <ArrowUpRight size={16} strokeWidth={1.5} className="text-ink-400" />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 底部留白的小行签名：取代大段编者按 */}
        <div className="mt-12 pt-6 border-t border-ink-300 dark:border-ink-700">
          <p className="text-2xs font-mono uppercase tracking-caps text-ink-400 text-center">
            {lang === 'zh' ? '官网价格 · 直达源头' : 'Official site · Direct source'}
          </p>
        </div>
      </Page>
      <BottomNav />
    </>
  );
}
