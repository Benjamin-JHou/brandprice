import { cn } from '../lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main';
};

export function Page({ children, className, as: Tag = 'section' }: Props) {
  return (
    <Tag
      className={cn(
        'mx-auto max-w-screen-sm px-5 sm:px-6',
        'pb-28 pt-safe',
        'animate-rise-in',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
