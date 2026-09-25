import { Link } from 'react-router-dom'
import type { OppStatus, Opportunity } from '../../data/types'
import { cx } from '../../components/ui'

export const OPP_STATUSES: OppStatus[] = ['backlog', 'planned', 'in-progress', 'shipped']

export const oppStatusMeta: Record<OppStatus, { label: string; cls: string; dot: string }> = {
  backlog: { label: 'Backlog', cls: 'bg-paper-sunken text-ink-mute', dot: 'bg-ink-faint' },
  planned: { label: 'Planned', cls: 'bg-[#E4EAF0] text-[#3B5878]', dot: 'bg-[#3B5878]' },
  'in-progress': { label: 'In progress', cls: 'bg-rust-wash text-rust-dark', dot: 'bg-rust' },
  shipped: { label: 'Shipped', cls: 'bg-sentiment-pos-tint text-sentiment-pos', dot: 'bg-sentiment-pos' },
}

export function OppStatusPill({ status }: { status: OppStatus }) {
  const m = oppStatusMeta[status]
  return <span className={cx('pill', m.cls)}>{m.label}</span>
}

export function MiniBars({ impact, effort }: { impact: number; effort: number }) {
  return (
    <div className="flex items-center gap-3 text-[11px] text-ink-mute">
      <span className="inline-flex items-center gap-1">
        <span className="text-ink-faint">Impact</span>
        <span className="h-1.5 w-10 overflow-hidden rounded-full bg-paper-sunken">
          <span className="block h-full rounded-full bg-rust" style={{ width: `${impact}%` }} />
        </span>
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="text-ink-faint">Effort</span>
        <span className="h-1.5 w-10 overflow-hidden rounded-full bg-paper-sunken">
          <span className="block h-full rounded-full bg-ink-mute" style={{ width: `${effort}%` }} />
        </span>
      </span>
    </div>
  )
}

export function OppCard({ o, onClick }: { o: Opportunity; onClick?: () => void }) {
  return (
    <div className="card p-3.5">
      <Link to={`/prioritize/${o.id}`} onClick={onClick} className="block">
        <div className="text-sm font-medium leading-snug text-ink hover:text-rust">{o.title}</div>
      </Link>
      <div className="mt-2">
        <MiniBars impact={o.impact} effort={o.effort} />
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-mute">
        <span className="font-medium text-ink-soft">RICE {o.rice}</span>
        <span className="text-ink-faint">·</span>
        <span>{o.quarter}</span>
        {o.jiraKey && (
          <>
            <span className="text-ink-faint">·</span>
            <span className="font-mono">{o.jiraKey}</span>
          </>
        )}
      </div>
    </div>
  )
}
