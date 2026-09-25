import { Link } from 'react-router-dom'
import type { Signal, SignalStatus, SignalType } from '../../data/types'
import { Icon, type IconName } from '../../components/icons'
import { SeverityBadge, cx } from '../../components/ui'
import { relTime } from '../../lib/format'

export const typeMeta: Record<SignalType, { label: string; icon: IconName }> = {
  spike: { label: 'Spike', icon: 'trending-up' },
  'emerging-theme': { label: 'Emerging', icon: 'sparkles' },
  'churn-risk': { label: 'Churn risk', icon: 'alert-triangle' },
  'sentiment-drop': { label: 'Sentiment drop', icon: 'trending-down' },
  'competitor-mention': { label: 'Competitor', icon: 'flag' },
}

export const statusMeta: Record<SignalStatus, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-rust-wash text-rust-dark' },
  acknowledged: { label: 'Acknowledged', cls: 'bg-[#F4E8CE] text-[#8A6414]' },
  routed: { label: 'Routed', cls: 'bg-[#E4EAF0] text-[#3B5878]' },
  resolved: { label: 'Resolved', cls: 'bg-sentiment-pos-tint text-sentiment-pos' },
}

export function StatusPill({ status }: { status: SignalStatus }) {
  return <span className={cx('pill', statusMeta[status].cls)}>{statusMeta[status].label}</span>
}

const severityBar: Record<Signal['severity'], string> = {
  critical: 'bg-sentiment-neg',
  high: 'bg-rust',
  medium: 'bg-[#C9A227]',
  low: 'bg-line-strong',
}

export function SignalRow({ signal }: { signal: Signal }) {
  const meta = typeMeta[signal.type]
  return (
    <Link to={`/signals/${signal.id}`} className="card group relative flex items-start gap-3 overflow-hidden p-4 pl-5 transition-shadow hover:shadow-raised">
      <span className={cx('absolute inset-y-0 left-0 w-1', severityBar[signal.severity])} />
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper-sunken text-ink-soft">
        <Icon name={meta.icon} size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-mute">{meta.label}</span>
          <SeverityBadge value={signal.severity} />
          {signal.metricDeltaPct != null && (
            <span className={cx('text-xs font-semibold', signal.metricDeltaPct >= 0 ? 'text-sentiment-neg' : 'text-sentiment-pos')}>
              {signal.metricDeltaPct > 0 ? '+' : ''}
              {signal.metricDeltaPct}%
            </span>
          )}
        </div>
        <div className="mt-0.5 font-medium text-ink">{signal.title}</div>
        <div className="mt-0.5 line-clamp-1 text-sm text-ink-mute">{signal.detail}</div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusPill status={signal.status} />
        <span className="text-xs text-ink-mute">{relTime(signal.detectedISO)}</span>
      </div>
    </Link>
  )
}
