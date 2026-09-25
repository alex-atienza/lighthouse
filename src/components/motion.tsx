import { useEffect, useRef, useState, type ReactNode } from 'react'

// Headless capture (navigator.webdriver) and reduced-motion users skip the tween
// and get the final value immediately, so screenshots and a11y stay correct.
export const INSTANT =
  (typeof navigator !== 'undefined' && (navigator as any).webdriver) ||
  (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

export function CountUp({
  end,
  duration = 900,
  delay = 0,
  format = (n: number) => String(Math.round(n)),
  className,
}: {
  end: number
  duration?: number
  delay?: number
  format?: (n: number) => string
  className?: string
}) {
  const [v, setV] = useState(INSTANT ? end : 0)
  const raf = useRef<number>()
  useEffect(() => {
    if (INSTANT) {
      setV(end)
      return
    }
    let start: number | undefined
    const tick = (t: number) => {
      if (start === undefined) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(end * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    const startTimer = window.setTimeout(() => {
      raf.current = requestAnimationFrame(tick)
    }, delay)
    // Safety snap to the final value (timers advance even where rAF is throttled).
    const snap = window.setTimeout(() => setV(end), delay + duration + 80)
    return () => {
      clearTimeout(startTimer)
      clearTimeout(snap)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [end, duration, delay])
  return <span className={className}>{format(v)}</span>
}

// Staggered entrance wrapper — use as a grid/list item with an index.
export function Reveal({ i = 0, children, className }: { i?: number; children: ReactNode; className?: string }) {
  const delay = Math.min(i * 45, 400)
  return (
    <div className={className} style={{ animation: 'reveal-up .45s cubic-bezier(.2,.7,.3,1) both', animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
