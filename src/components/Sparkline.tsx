import { useMemo } from 'react';
import type { PricePoint } from '../lib/types';

type Props = {
  data: PricePoint[];
  width?: number;
  height?: number;
  stroke?: string;
  className?: string;
};

export function Sparkline({
  data,
  width = 220,
  height = 56,
  stroke = '#D63A2F',
  className,
}: Props) {
  const { path, area, minY, maxY, points } = useMemo(() => {
    if (data.length === 0) {
      return { path: '', area: '', minY: 0, maxY: 0, points: [] as { x: number; y: number }[] };
    }
    const prices = data.map((d) => d.price);
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    const range = hi - lo || 1;
    const stepX = data.length > 1 ? width / (data.length - 1) : 0;
    const pts = data.map((d, i) => ({
      x: i * stepX,
      y: height - ((d.price - lo) / range) * (height - 8) - 4,
    }));
    const pathD = pts
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ');
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
    return { path: pathD, area: areaD, minY: lo, maxY: hi, points: pts };
  }, [data, width, height]);

  if (data.length === 0) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      width="100%"
      height={height}
    >
      <path d={area} fill={stroke} fillOpacity={0.08} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="square" />
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={2.5}
          fill={stroke}
        />
      )}
    </svg>
  );
}
