import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, X, ArrowUpRight, Edit2, Check, Trash2, Search } from 'lucide-react';
import { Page } from '../components/Page';
import { SectionHeader } from '../components/SectionHeader';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { useScheduleStore, DayKey } from '../store/useScheduleStore';
import { useI18n } from '../i18n/useI18n';
import { api } from '../lib/api';
import type { Brand } from '../lib/types';
import { cn } from '../lib/utils';

const DAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export default function SchedulePage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const schedules = useScheduleStore((s) => s.schedules);
  const updateSchedule = useScheduleStore((s) => s.updateSchedule);
  const clearAll = useScheduleStore((s) => s.clearAll);

  // 状态：当前正在编辑哪一天
  const [editingDay, setEditingDay] = useState<DayKey | null>(null);
  
  // 编辑暂存区
  const [editNotes, setEditNotes] = useState('');
  const [editBrandSlugs, setEditBrandSlugs] = useState<string[]>([]);
  
  // 品牌搜索状态
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Brand[]>([]);

  // 加载所有品牌，以供在关联品牌时作搜索匹配
  useEffect(() => {
    api.brands().then(setAllBrands).catch(() => undefined);
  }, []);

  // 过滤搜索品牌
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      return;
    }
    const filtered = allBrands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.nameLocal && b.nameLocal.toLowerCase().includes(q)) ||
        b.slug.toLowerCase().includes(q)
    );
    setSearchResults(filtered.slice(0, 5)); // 最多展示5个候选
  }, [searchQuery, allBrands]);

  const handleStartEdit = (day: DayKey) => {
    setEditingDay(day);
    setEditNotes(schedules[day].notes);
    setEditBrandSlugs(schedules[day].brandSlugs);
    setSearchQuery('');
  };

  const handleSave = (day: DayKey) => {
    updateSchedule(day, {
      notes: editNotes,
      brandSlugs: editBrandSlugs,
    });
    setEditingDay(null);
  };

  const handleCancel = () => {
    setEditingDay(null);
  };

  const handleAddBrandTag = (slug: string) => {
    if (!editBrandSlugs.includes(slug)) {
      setEditBrandSlugs([...editBrandSlugs, slug]);
    }
    setSearchQuery('');
  };

  const handleRemoveBrandTag = (slug: string) => {
    setEditBrandSlugs(editBrandSlugs.filter((s) => s !== slug));
  };

  // 通过 slug 查找 Brand 实体
  const getBrandBySlug = (slug: string): Brand | undefined => {
    return allBrands.find((b) => b.slug === slug);
  };

  return (
    <>
      <TopBar title={t('schedule.title')} />
      <Page>
        <div className="pt-6 flex items-end justify-between">
          <div>
            <p className="font-serif italic text-2xs tracking-caps uppercase text-ink-400">
              § {t('schedule.ledger')}
            </p>
            <h1 className="mt-2 font-serif text-5xl sm:text-6xl font-bold tracking-tighter leading-[0.9]">
              {t('schedule.heading')}<span className="text-vermilion">.</span>
            </h1>
          </div>
          <button
            onClick={() => {
              if (window.confirm(t('common.confirmClearHistory'))) {
                clearAll();
              }
            }}
            className="text-2xs font-mono uppercase tracking-caps text-ink-500 hover:text-vermilion transition-colors"
          >
            {t('schedule.clearAll')}
          </button>
        </div>

        {/* 顶部副标题 */}
        <p className="mt-4 text-sm font-serif italic text-ink-600 dark:text-ink-400 max-w-md">
          {t('favorites.subtitle').replace('收藏的韩国小众品牌。', '这周的工作行程与各品牌探店路线。输入文字并关联特定的品牌。')}
        </p>

        {/* 7天计划列表 */}
        <div className="mt-10 space-y-6 mb-16">
          {DAYS.map((day) => {
            const isEditing = editingDay === day;
            const item = schedules[day];

            return (
              <div
                key={day}
                className={cn(
                  'border-2 p-5 transition-all',
                  isEditing
                    ? 'border-vermilion bg-vermilion/5 dark:bg-vermilion/10'
                    : 'border-ink dark:border-paper bg-transparent'
                )}
              >
                {/* 星期 Header */}
                <div className="flex items-center justify-between border-b border-ink/20 dark:border-paper/20 pb-3 mb-4">
                  <span className="font-serif text-xl font-bold">
                    {t(`schedule.days.${day}`)}
                  </span>
                  
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(day)}
                      className="inline-flex items-center gap-1 text-2xs font-mono uppercase tracking-caps text-ink-500 hover:text-vermilion transition-colors"
                    >
                      <Edit2 size={12} />
                      <span>编辑</span>
                    </button>
                  )}
                </div>

                {/* 编辑模式下的表单 */}
                {isEditing ? (
                  <div className="space-y-4">
                    {/* 文本输入 */}
                    <div>
                      <label className="block text-2xs font-mono uppercase tracking-caps text-ink-500 mb-1.5">
                        {t('schedule.notes')}
                      </label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder={t('schedule.notesPlaceholder')}
                        className="w-full min-h-[100px] p-3 border-2 border-ink dark:border-paper bg-transparent font-serif text-sm focus:border-vermilion focus:outline-none dark:focus:border-vermilion"
                      />
                    </div>

                    {/* 已关联的品牌 */}
                    <div>
                      <label className="block text-2xs font-mono uppercase tracking-caps text-ink-500 mb-1.5">
                        {t('schedule.taggedBrands')}
                      </label>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {editBrandSlugs.map((slug) => {
                          const b = getBrandBySlug(slug);
                          return (
                            <span
                              key={slug}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ink text-paper dark:bg-paper dark:text-ink text-2xs font-mono uppercase tracking-caps"
                            >
                              <span>{b ? b.name : slug}</span>
                              <button
                                onClick={() => handleRemoveBrandTag(slug)}
                                className="hover:text-vermilion shrink-0"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          );
                        })}
                        {editBrandSlugs.length === 0 && (
                          <span className="text-2xs font-serif italic text-ink-400">
                            暂未关联任何品牌
                          </span>
                        )}
                      </div>

                      {/* 搜寻并添加关联品牌 */}
                      <div className="relative">
                        <div className="flex items-center gap-2 border-b border-ink dark:border-paper pb-1">
                          <Search size={12} className="text-ink-400 shrink-0" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('schedule.searchBrand')}
                            className="w-full bg-transparent font-mono text-2xs focus:outline-none uppercase tracking-caps"
                          />
                        </div>

                        {/* 候选下拉选项 */}
                        {searchResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 border-2 border-ink dark:border-paper bg-paper dark:bg-ink z-10 max-h-40 overflow-y-auto divide-y divide-ink-300 dark:divide-ink-700">
                            {searchResults.map((b) => (
                              <button
                                key={b.slug}
                                type="button"
                                onClick={() => handleAddBrandTag(b.slug)}
                                className="w-full text-left p-2 hover:bg-vermilion hover:text-white transition-colors flex items-center justify-between"
                              >
                                <span className="font-serif text-sm font-bold">{b.name}</span>
                                <span className="font-mono text-2xs text-ink-500 hover:text-white-500">
                                  {b.nameLocal}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border-2 border-ink dark:border-paper text-2xs font-mono uppercase tracking-caps active:bg-ink active:text-paper"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleSave(day)}
                        className="px-4 py-2 bg-ink text-paper dark:bg-paper dark:text-ink border-2 border-ink dark:border-paper text-2xs font-mono uppercase tracking-caps active:opacity-90"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 正常显示模式 */
                  <div className="space-y-4">
                    {/* 行程内容 */}
                    <div className="font-serif text-base leading-relaxed text-ink-800 dark:text-ink-200 whitespace-pre-line">
                      {item.notes ? (
                        item.notes
                      ) : (
                        <p className="italic text-ink-400 font-normal">
                          {lang === 'zh' ? '点击右上角“编辑”添加日程规划...' : 'Tap Edit to add schedule notes...'}
                        </p>
                      )}
                    </div>

                    {/* 关联的探店品牌链接 */}
                    {item.brandSlugs.length > 0 && (
                      <div className="pt-2">
                        <div className="text-3xs font-mono uppercase tracking-caps text-ink-400 mb-1.5">
                          @ {t('schedule.taggedBrands')}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.brandSlugs.map((slug) => {
                            const b = getBrandBySlug(slug);
                            if (!b) return null;
                            return (
                              <button
                                key={slug}
                                onClick={() => navigate(`/brand/${slug}`)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-ink hover:border-vermilion dark:border-paper dark:hover:border-vermilion text-2xs font-mono uppercase tracking-caps transition-colors"
                              >
                                <span>{b.name}</span>
                                <ArrowUpRight size={10} strokeWidth={2} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Page>
      <BottomNav />
    </>
  );
}
