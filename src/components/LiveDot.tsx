// 实时指示器：脉动小绿点 + LIVE 文字
import { cn } from '../lib/utils';
import { useI18n } from '../i18n/useI18n';

type Props = {
  label?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  /** 中文 / 英文 / 自动 */
  text?: 'zh' | 'en' | 'auto';
};

export function LiveDot({ label = true, size = 'sm', className, text = 'auto' }: Props) {
  const { t, lang } = useI18n();
  const dotSize = size === 'md' ? 'w-2 h-2' : 'w-1.5 h-1.5';
  const showZh = text === 'zh' || (text === 'auto' && lang === 'zh');
  const text0 = showZh ? '实时' : t('common.live');
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        className={cn(
          dotSize,
          'rounded-full bg-moss relative',
        )}
      >
        <span
          className={cn(
            'absolute inset-0 rounded-full bg-moss animate-ping',
            'opacity-60',
          )}
        />
      </span>
      {label && (
        <span className="font-mono text-2xs uppercase tracking-caps text-moss">
          {text0}
        </span>
      )}
    </span>
  );
}
