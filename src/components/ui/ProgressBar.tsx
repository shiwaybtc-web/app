import { cn } from '@/lib/cn'

export function ProgressBar({ ratio, color = 'rgba(214,198,255,0.95)', className, height = 3 }: { ratio: number; color?: string; className?: string; height?: number }) {
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-white/10', className)} style={{ height }}>
      <div
        className="h-full rounded-full transition-[width] duration-1000 ease-premium"
        style={{ width: `${Math.max(0, Math.min(100, ratio * 100))}%`, background: color, boxShadow: `0 0 10px ${color}` }}
      />
    </div>
  )
}
