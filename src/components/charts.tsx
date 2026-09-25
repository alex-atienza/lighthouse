import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from './ui'
import { useFx } from './fx'

// Chart palette — magnitude uses single-hue rust (sequential); sentiment/health
// use a diverging triad (warm red ↔ neutral gray ↔ cool green). Validated per dataviz skill.
// These literals are the light-theme fallback; useChartColors() resolves the live
// values from CSS variables so the palette tracks the active theme.
export const CHART = {
  rust: '#B4451F',
  rustSoft: 'rgba(180,69,31,0.12)',
  neg: '#C0442A',
  neu: '#A99C8B',
  pos: '#2F7D5A',
  watch: '#B07D18',
  grid: '#E7DFD3',
  axis: '#8A7F72',
  track: '#EFE9DF',
}

export interface ChartColors {
  rust: string
  rustSoft: string
  neg: string
  neu: string
  pos: string
  watch: string
  grid: string
  axis: string
  track: string
}

// Read the semantic palette straight from CSS custom properties (RGB triplets),
// so light/dark share one source of truth with the Tailwind token utilities.
function resolveChartColors(): ChartColors {
  if (typeof document === 'undefined') return { ...CHART }
  const cs = getComputedStyle(document.documentElement)
  const rgb = (name: string, fallback: string, alpha?: number) => {
    const v = cs.getPropertyValue(name).trim()
    if (!v) return fallback
    const [r, g, b] = v.split(/\s+/)
    return alpha != null ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`
  }
  return {
    rust: rgb('--rust', CHART.rust),
    rustSoft: rgb('--rust', CHART.rustSoft, 0.14),
    neg: rgb('--sent-neg', CHART.neg),
    neu: rgb('--sent-neu', CHART.neu),
    pos: rgb('--sent-pos', CHART.pos),
    watch: rgb('--watch', CHART.watch),
    grid: rgb('--line', CHART.grid),
    axis: rgb('--ink-mute', CHART.axis),
    track: rgb('--paper-sunken', CHART.track),
  }
}

// Live chart colors, re-resolved whenever the theme flips. Subscribing to useFx
// re-renders the host so Recharts (which needs concrete color strings) recolors
// instantly on toggle rather than waiting for the next navigation.
export function useChartColors(): ChartColors {
  const { theme } = useFx()
  const [colors, setColors] = useState<ChartColors>(resolveChartColors)
  useEffect(() => {
    setColors(resolveChartColors())
  }, [theme])
  return colors
}

// Diverging health-score color (red → amber → green), theme-aware.
export function useHealthColor(): (score: number) => string {
  const c = useChartColors()
  return useCallback((score: number) => (score < 50 ? c.neg : score < 68 ? c.watch : c.pos), [c])
}

export function Figure({
  title,
  subtitle,
  legend,
  children,
  className,
}: {
  title?: string
  subtitle?: string
  legend?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx('card p-5', className)}>
      {(title || legend) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <div className="text-sm font-semibold text-ink">{title}</div>}
            {subtitle && <div className="text-xs text-ink-mute">{subtitle}</div>}
          </div>
          {legend}
        </div>
      )}
      {children}
    </div>
  )
}

export function LegendSwatches({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5 text-xs text-ink-mute">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}

interface SentiPoint {
  label: string
  pos: number
  neu: number
  neg: number
}
function SentiTooltip({ active, payload, label }: any) {
  const c = useChartColors()
  if (!active || !payload?.length) return null
  const get = (k: string) => payload.find((p: any) => p.dataKey === k)?.value ?? 0
  const rows = [
    { k: 'neg', label: 'Negative', color: c.neg },
    { k: 'neu', label: 'Neutral', color: c.neu },
    { k: 'pos', label: 'Positive', color: c.pos },
  ]
  return (
    <div className="rounded-lg border border-line bg-paper-raised px-3 py-2 shadow-pop">
      <div className="mb-1 text-xs font-medium text-ink">Week of {label}</div>
      {rows.map((r) => (
        <div key={r.k} className="flex items-center gap-2 text-xs text-ink-soft">
          <span className="h-2 w-2 rounded-sm" style={{ background: r.color }} />
          {r.label}
          <span className="ml-auto font-medium tabular-nums text-ink">{get(r.k)}</span>
        </div>
      ))}
    </div>
  )
}

// Stacked sentiment volume over time. One y-axis (counts), diverging triad.
export function SentimentArea({ data, height = 220 }: { data: SentiPoint[]; height?: number }) {
  const c = useChartColors()
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -18 }}>
        <CartesianGrid vertical={false} stroke={c.grid} strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={{ fill: c.axis, fontSize: 11 }} tickLine={false} axisLine={{ stroke: c.grid }} />
        <YAxis tick={{ fill: c.axis, fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<SentiTooltip />} cursor={{ stroke: c.axis, strokeWidth: 1, strokeDasharray: '3 3' }} />
        <Area type="monotone" dataKey="neg" stackId="1" stroke={c.neg} strokeWidth={2} fill={c.neg} fillOpacity={0.18} isAnimationActive={false} />
        <Area type="monotone" dataKey="neu" stackId="1" stroke={c.neu} strokeWidth={2} fill={c.neu} fillOpacity={0.16} isAnimationActive={false} />
        <Area type="monotone" dataKey="pos" stackId="1" stroke={c.pos} strokeWidth={2} fill={c.pos} fillOpacity={0.18} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Horizontal magnitude bars — single hue, direct value labels, optional links.
export interface BarItem {
  label: string
  value: number
  display?: string
  to?: string
  sub?: string
}
export function BarList({ items, max }: { items: BarItem[]; max?: number }) {
  const top = max ?? Math.max(...items.map((i) => i.value), 1)
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((it, idx) => {
        const pct = Math.max(2, (it.value / top) * 100)
        const Row = (
          <div className="group flex items-center gap-3">
            <div className="w-40 shrink-0 truncate text-sm text-ink" title={it.label}>
              {it.label}
              {it.sub && <span className="ml-1 text-xs text-ink-faint">{it.sub}</span>}
            </div>
            <div className="relative h-5 flex-1 overflow-hidden rounded bg-paper-sunken well">
              <div
                className="h-full rounded fill-rust animate-[bar-grow_.6s_ease-out_both]"
                style={{ width: `${pct}%`, transformOrigin: 'left', animationDelay: `${idx * 40}ms` }}
                title={`${it.value}`}
              />
            </div>
            <div className="w-16 shrink-0 text-right text-sm font-medium tabular-nums text-ink-soft">
              {it.display ?? it.value}
            </div>
          </div>
        )
        return it.to ? (
          <Link key={it.label} to={it.to} className="rounded transition-opacity hover:opacity-80">
            {Row}
          </Link>
        ) : (
          <div key={it.label}>{Row}</div>
        )
      })}
    </div>
  )
}

// Single stacked bar for a sentiment mix, with a labelled legend row.
export function SentimentSplitBar({ pos, neu, neg }: { pos: number; neu: number; neg: number }) {
  const c = useChartColors()
  const total = pos + neu + neg || 1
  const seg = (v: number, color: string) => ({ flex: v, background: color })
  return (
    <div>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full">
        <div style={seg(neg, c.neg)} />
        <div style={seg(neu, c.neu)} />
        <div style={seg(pos, c.pos)} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        {[
          { label: 'Negative', v: neg, c: c.neg },
          { label: 'Neutral', v: neu, c: c.neu },
          { label: 'Positive', v: pos, c: c.pos },
        ].map((r) => (
          <span key={r.label} className="inline-flex items-center gap-1.5 text-ink-mute">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: r.c }} />
            {r.label} <span className="font-medium text-ink">{Math.round((r.v / total) * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}
