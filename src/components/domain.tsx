import { Link } from 'react-router-dom'
import type { FeedbackItem, SentimentLabel, Theme } from '../data/types'
import { useDb, findAccount, findSource } from '../store/hooks'
import { cx, Pill, SentimentDot, Sparkline, TrendBadge } from './ui'
import { Icon } from './icons'
import { fmtUSD, relTime } from '../lib/format'

// Render text with **bold** spans.
export function Rich({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p className={className}>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="font-semibold text-ink">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  )
}

export function ConfidencePill({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const tone = pct >= 80 ? 'positive' : pct >= 65 ? 'neutral' : 'negative'
  return <Pill tone={tone}>{pct}% confidence</Pill>
}

const segmentTone: Record<string, string> = {
  Enterprise: 'bg-[#E4EAF0] text-[#3B5878]',
  'Mid-Market': 'bg-rust-wash text-rust-dark',
  SMB: 'bg-paper-sunken text-ink-mute',
}
export function SegmentPill({ segment }: { segment: string }) {
  return <span className={cx('pill', segmentTone[segment] ?? 'bg-paper-sunken text-ink-mute')}>{segment}</span>
}

// A single cited/quoted piece of feedback.
export function FeedbackQuote({ item, compact = false }: { item: FeedbackItem; compact?: boolean }) {
  const db = useDb()
  const acc = findAccount(db, item.accountId)
  const src = findSource(db, item.sourceId)
  return (
    <div className="relative rounded-lg border border-line bg-paper-raised p-3.5 pl-6">
      <span aria-hidden className="pointer-events-none absolute left-2 top-1 font-display leading-none text-rust/25" style={{ fontSize: 40 }}>
        “
      </span>
      <div className="flex items-start gap-2.5">
        <span className="mt-1.5">
          <SentimentDot value={item.sentiment} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cx('font-display text-ink leading-snug', compact ? 'text-[14px]' : 'text-[15px]')}>{item.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-mute">
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>{src?.icon}</span> {src?.name}
            </span>
            <span className="text-ink-faint">·</span>
            <span className="text-ink-soft">{acc?.name}</span>
            {acc && <SegmentPill segment={acc.segment} />}
            <span className="text-ink-faint">·</span>
            <span>{relTime(item.createdISO)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const sentimentWord: Record<SentimentLabel, string> = {
  positive: 'Positive',
  neutral: 'Mixed',
  negative: 'Negative',
}

// Compact theme chip (inline citation).
export function ThemeChip({ theme }: { theme: Theme }) {
  return (
    <Link
      to={`/themes/${theme.id}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-3 py-1 text-[13px] text-ink-soft transition-all duration-200 ease-spring hover:-translate-y-px hover:border-rust/40 hover:text-rust"
    >
      <SentimentDot value={theme.sentiment} />
      {theme.title}
      <span className="text-ink-faint">{theme.volume}</span>
    </Link>
  )
}

// Full theme card for explorer / library grids.
export function ThemeCard({ theme }: { theme: Theme }) {
  return (
    <Link
      to={`/themes/${theme.id}`}
      className="card block p-4 transition-[transform,box-shadow] duration-200 ease-spring hover:-translate-y-0.5 hover:shadow-raised active:translate-y-0 active:shadow-card"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-caps text-ink-mute">
          <Icon name="layers" size={13} />
          {theme.category}
        </div>
        <TrendBadge pct={theme.volumeTrendPct} />
      </div>
      <div className="font-display text-[17px] leading-snug text-ink">{theme.title}</div>
      <p className="mt-1 line-clamp-2 text-[13px] text-ink-mute">{theme.summary}</p>
      <div className="mt-3 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <Pill tone={theme.sentiment === 'positive' ? 'positive' : theme.sentiment === 'negative' ? 'negative' : 'neutral'}>
              {sentimentWord[theme.sentiment]}
            </Pill>
            <span className="text-ink-mute">{theme.volume} mentions</span>
          </div>
          <div className="text-xs text-ink-mute">
            {fmtUSD(theme.arrImpact)} ARR · impact {theme.impact}
          </div>
        </div>
        <Sparkline data={theme.sparkline} width={84} height={30} tone={theme.sentiment === 'positive' ? '#3E7D5A' : '#B4451F'} />
      </div>
    </Link>
  )
}

// Small labelled impact/volume bar for lists.
export function ImpactBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-paper-sunken well">
        <div className="h-full rounded-full fill-rust transition-[width] duration-500 ease-spring" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs tabular-nums text-ink-mute">{label ?? value}</span>
    </div>
  )
}
