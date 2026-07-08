// 章节式标题
type Props = {
  index: string;
  title: string;
  meta?: React.ReactNode;
  action?: React.ReactNode;
};

export function SectionHeader({ index, title, meta, action }: Props) {
  return (
    <div className="mb-4">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-serif italic text-ink-400 dark:text-ink-500 text-2xs tracking-caps uppercase shrink-0">
            § {index}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight truncate">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="section-rule mt-3" />
      {meta && (
        <p className="mt-2 text-2xs uppercase tracking-caps font-mono text-ink-500">
          {meta}
        </p>
      )}
    </div>
  );
}
