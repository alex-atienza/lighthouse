import clsx from 'clsx'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { Icon, type IconName } from './icons'
import type { SentimentLabel, Severity } from '../data/types'

export const cx = clsx

// ---- Button --------------------------------------------------------------------
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type BtnSize = 'sm' | 'md' | 'lg'
const btnVariants: Record<BtnVariant, string> = {
  primary: 'fill-rust text-white border border-transparent hover:brightness-110',
  secondary: 'bg-paper-raised text-ink border border-line hover:bg-paper-sunken',
  ghost: 'bg-transparent text-ink-soft hover:bg-paper-sunken border border-transparent',
  danger: 'bg-transparent text-sentiment-neg border border-sentiment-neg/30 hover:bg-sentiment-neg-tint',
}
const btnSizes: Record<BtnSize, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-3.5 py-2 gap-2 rounded-lg',
  lg: 'text-base px-5 py-2.5 gap-2 rounded-lg',
}
export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  className,
  children,
  ...props
}: {
  variant?: BtnVariant
  size?: BtnSize
  icon?: IconName
  iconRight?: IconName
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 ease-spring will-change-transform hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0',
        btnVariants[variant],
        btnSizes[size],
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={iconSize} className="shrink-0" />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} className="shrink-0" />}
    </button>
  )
}

// ---- Pill / Badge --------------------------------------------------------------
type Tone = 'default' | 'rust' | 'positive' | 'neutral' | 'negative' | 'info'
const toneStyles: Record<Tone, string> = {
  default: 'bg-paper-sunken text-ink-soft',
  rust: 'bg-rust-wash text-rust-dark',
  positive: 'bg-sentiment-pos-tint text-sentiment-pos',
  neutral: 'bg-sentiment-neu-tint text-ink-soft',
  negative: 'bg-sentiment-neg-tint text-sentiment-neg',
  info: 'bg-[#E4EAF0] text-[#3B5878]',
}
export function Pill({
  tone = 'default',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return <span className={cx('pill', toneStyles[tone], className)}>{children}</span>
}

// ---- Sentiment + Severity ------------------------------------------------------
export function SentimentDot({ value }: { value: SentimentLabel }) {
  const c = value === 'positive' ? 'bg-sentiment-pos' : value === 'negative' ? 'bg-sentiment-neg' : 'bg-sentiment-neu'
  return <span className={cx('inline-block h-2 w-2 rounded-full', c)} />
}
export function SentimentPill({ value }: { value: SentimentLabel }) {
  const tone: Tone = value === 'positive' ? 'positive' : value === 'negative' ? 'negative' : 'neutral'
  return (
    <Pill tone={tone} className="capitalize">
      <SentimentDot value={value} />
      {value}
    </Pill>
  )
}
const severityStyle: Record<Severity, string> = {
  critical: 'bg-sentiment-neg-tint text-sentiment-neg',
  high: 'bg-rust-wash text-rust-dark',
  medium: 'bg-[#F4E8CE] text-[#8A6414]',
  low: 'bg-paper-sunken text-ink-mute',
}
export function SeverityBadge({ value }: { value: Severity }) {
  return <span className={cx('pill capitalize', severityStyle[value])}>{value}</span>
}

// ---- Trend badge ---------------------------------------------------------------
export function TrendBadge({ pct }: { pct: number }) {
  const up = pct >= 0
  return (
    <span
      className={cx(
        'inline-flex items-center gap-0.5 text-xs font-semibold',
        up ? 'text-sentiment-neg' : 'text-sentiment-pos', // rising complaint volume reads negative
      )}
      title="Change vs. prior period"
    >
      <Icon name={up ? 'trending-up' : 'trending-down'} size={13} strokeWidth={2.25} />
      {up ? '+' : ''}
      {Math.round(pct)}%
    </span>
  )
}

// ---- Avatar --------------------------------------------------------------------
export function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-ink text-paper font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  )
}

// ---- Sparkline -----------------------------------------------------------------
export function Sparkline({
  data,
  width = 100,
  height = 30,
  tone = '#B4451F',
  fill = true,
}: {
  data: number[]
  width?: number
  height?: number
  tone?: string
  fill?: boolean
}) {
  if (!data.length) return null
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const step = width / (data.length - 1 || 1)
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2])
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${width} ${height} L0 ${height} Z`
  return (
    <svg width={width} height={height} className="overflow-visible">
      {fill && <path d={area} fill={tone} opacity={0.1} />}
      <path
        d={line}
        fill="none"
        stroke={tone}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 600, strokeDashoffset: 600, animation: 'draw-in .8s ease forwards' }}
      />
    </svg>
  )
}

// ---- Meter ---------------------------------------------------------------------
export function Meter({ value, max = 100, tone = 'fill-rust', track = 'bg-paper-sunken', className }: { value: number; max?: number; tone?: string; track?: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cx('h-2 overflow-hidden rounded-full well', track, className)}>
      <div className={cx('h-full rounded-full transition-[width] duration-500 ease-spring', tone)} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ---- StatTile ------------------------------------------------------------------
export function StatTile({
  label,
  value,
  delta,
  deltaKind = 'neutral',
  icon,
  hint,
}: {
  label: string
  value: ReactNode
  delta?: string
  deltaKind?: 'up-good' | 'up-bad' | 'down-good' | 'down-bad' | 'neutral'
  icon?: IconName
  hint?: string
}) {
  const deltaColor =
    deltaKind === 'up-good' || deltaKind === 'down-good'
      ? 'text-sentiment-pos'
      : deltaKind === 'up-bad' || deltaKind === 'down-bad'
        ? 'text-sentiment-neg'
        : 'text-ink-mute'
  return (
    <div className="card p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between text-ink-mute">
        <span className="text-xs font-medium uppercase tracking-caps">{label}</span>
        {icon && <Icon name={icon} size={16} />}
      </div>
      <div className="stat-value font-display text-title leading-none text-ink mt-1 tabular-nums">{value}</div>
      <div className="flex items-center gap-2 mt-0.5 min-h-[18px]">
        {delta && <span className={cx('text-xs font-semibold', deltaColor)}>{delta}</span>}
        {hint && <span className="text-xs text-ink-mute">{hint}</span>}
      </div>
    </div>
  )
}

// ---- Card ----------------------------------------------------------------------
export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('card', className)} {...rest}>
      {children}
    </div>
  )
}

// ---- Tabs ----------------------------------------------------------------------
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: T; label: string; count?: number }[]
  value: T
  onChange: (k: T) => void
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const [rail, setRail] = useState({ left: 0, width: 0 })
  useLayoutEffect(() => {
    const el = railRef.current?.querySelector<HTMLElement>(`[data-tab="${value}"]`)
    if (el) setRail({ left: el.offsetLeft, width: el.offsetWidth })
  }, [value, tabs])
  return (
    <div ref={railRef} className="relative flex items-center gap-1 border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.key}
          data-tab={t.key}
          onClick={() => onChange(t.key)}
          className={cx(
            'relative px-3 py-2 text-sm font-medium transition-colors -mb-px',
            value === t.key ? 'text-ink' : 'text-ink-mute hover:text-ink-soft',
          )}
        >
          {t.label}
          {t.count != null && <span className="ml-1.5 text-xs text-ink-faint">{t.count}</span>}
        </button>
      ))}
      <span
        className="absolute -bottom-px h-0.5 rounded-full bg-rust transition-all duration-300 ease-spring"
        style={{ left: rail.left + 8, width: Math.max(0, rail.width - 16) }}
      />
    </div>
  )
}

// ---- SearchInput ---------------------------------------------------------------
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cx('relative', className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none">
        <Icon name="search" size={16} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-paper-raised pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-rust/25 focus:border-rust/40"
      />
    </div>
  )
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-rust/25 focus:border-rust/40',
        className,
      )}
      {...props}
    />
  )
}

// ---- Select --------------------------------------------------------------------
export function Select<T extends string>({
  value,
  onChange,
  options,
  className,
  ariaLabel,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  className?: string
  ariaLabel?: string
}) {
  return (
    <div className={cx('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={ariaLabel}
        className="appearance-none w-full rounded-lg border border-line bg-paper-raised pl-3 pr-8 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-rust/25 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none">
        <Icon name="chevron-down" size={15} />
      </span>
    </div>
  )
}

// ---- Toggle --------------------------------------------------------------------
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx('relative h-5 w-9 rounded-full transition-colors shrink-0', checked ? 'bg-rust' : 'bg-line-strong')}
    >
      <span
        className={cx(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-spring',
          checked ? 'translate-x-4' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

// ---- Drawer --------------------------------------------------------------------
export function Drawer({
  open,
  onClose,
  title,
  children,
  width = 'max-w-2xl',
}: {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  width?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/25 backdrop-blur-[1px] animate-fade-in" onClick={onClose} />
      <div className={cx('relative w-full bg-paper shadow-pop h-full overflow-y-auto animate-[fade-in_0.25s_ease]', width)}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/95 backdrop-blur px-6 py-4">
          <div className="font-display text-heading text-ink pr-6">{title}</div>
          <Button variant="ghost" size="sm" icon="x" onClick={onClose} aria-label="Close" />
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ---- EmptyState ----------------------------------------------------------------
export function EmptyState({
  icon = 'search',
  title,
  body,
  action,
}: {
  icon?: IconName
  title: string
  body?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <svg width="116" height="116" viewBox="0 0 116 116" fill="none" className="mb-4" aria-hidden="true">
        <line x1="10" y1="88" x2="106" y2="88" stroke="#E7DFD3" strokeWidth="2" strokeLinecap="round" />
        <g className="animate-[glow-pulse_3.5s_ease-in-out_infinite]" style={{ transformOrigin: '58px 36px' }}>
          <path d="M58 36 L108 18 L108 32 Z" fill="#C9A227" opacity="0.22" />
          <path d="M58 36 L108 40 L108 54 Z" fill="#C9A227" opacity="0.13" />
        </g>
        <path d="M50 42 L66 42 L70 88 L46 88 Z" fill="#F7F3EC" stroke="#1C1815" strokeWidth="2" strokeLinejoin="round" />
        <path d="M48.6 60 L67.4 60 L68 68 L48 68 Z" fill="#B4451F" />
        <rect x="51" y="32" width="14" height="10" rx="1" fill="#1C1815" />
        <circle cx="58" cy="37" r="2.4" fill="#C9A227" />
        <path d="M49 32 L67 32 L58 23 Z" fill="#B4451F" />
        <path d="M36 88 Q42 81 58 81 Q74 81 80 88 Z" fill="#EFE9DF" stroke="#1C1815" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <div className="font-display text-heading text-ink">{title}</div>
      {body && <p className="text-sm text-ink-mute mt-1 max-w-sm">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ---- PageHeader + Screen -------------------------------------------------------
export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
}: {
  kicker?: string
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-6 mb-6">
      <div>
        {kicker && (
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-caps text-rust">
            <span className="h-px w-4 bg-rust/50" />
            {kicker}
          </div>
        )}
        <h1 className="font-display text-title text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-ink-soft mt-1.5 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

export function Screen({ children, width = 'max-w-content' }: { children: ReactNode; width?: string }) {
  return <div className={cx('mx-auto px-8 py-8 animate-fade-in', width)}>{children}</div>
}

// ---- KeyValue / small helpers --------------------------------------------------
export function Kv({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-caps text-ink-mute mb-0.5">{label}</div>
      <div className="text-sm text-ink">{children}</div>
    </div>
  )
}
