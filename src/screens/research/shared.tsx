import { Link } from 'react-router-dom'
import type { CandidateStatus, ResearchCandidate } from '../../data/types'
import { Avatar, cx } from '../../components/ui'
import { useChartColors } from '../../components/charts'
import { SegmentPill } from '../../components/domain'
import { findAccount, findTheme, useDb } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

export const CAND_FLOW: CandidateStatus[] = ['suggested', 'invited', 'scheduled', 'completed']

export const candStatusMeta: Record<CandidateStatus, { label: string; cls: string }> = {
  suggested: { label: 'Suggested', cls: 'bg-paper-sunken text-ink-mute' },
  invited: { label: 'Invited', cls: 'bg-[#E4EAF0] text-[#3B5878]' },
  scheduled: { label: 'Scheduled', cls: 'bg-rust-wash text-rust-dark' },
  completed: { label: 'Completed', cls: 'bg-sentiment-pos-tint text-sentiment-pos' },
  declined: { label: 'Declined', cls: 'bg-sentiment-neg-tint text-sentiment-neg' },
}

export function CandStatusPill({ status }: { status: CandidateStatus }) {
  return <span className={cx('pill', candStatusMeta[status].cls)}>{candStatusMeta[status].label}</span>
}

export function MatchScore({ score, size = 44 }: { score: number; size?: number }) {
  const c = useChartColors()
  const color = score >= 88 ? c.pos : score >= 76 ? c.rust : c.watch
  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: `conic-gradient(${color} ${score * 3.6}deg, ${c.track} 0deg)` }}
    >
      <div className="flex items-center justify-center rounded-full bg-paper-raised" style={{ width: size - 8, height: size - 8 }}>
        <span className="text-xs font-semibold tabular-nums" style={{ color }}>{score}</span>
      </div>
    </div>
  )
}

export function CandidateCard({ c }: { c: ResearchCandidate }) {
  const db = useDb()
  const acc = findAccount(db, c.accountId)
  const themes = c.themeIds.map((t) => findTheme(db, t)).filter(Boolean)
  return (
    <Link to={`/research/${c.id}`} className="card block p-4 transition-shadow hover:shadow-raised">
      <div className="flex items-start gap-3">
        <MatchScore score={c.matchScore} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Avatar initials={acc?.logoInitials ?? '—'} size={22} />
            <span className="truncate text-sm font-medium text-ink">{acc?.name}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-mute">
            {acc && <SegmentPill segment={acc.segment} />}
            {acc && <span>{fmtUSD(acc.arr)}</span>}
          </div>
        </div>
        <CandStatusPill status={c.status} />
      </div>
      <p className="mt-2.5 line-clamp-2 text-[13px] text-ink-soft">{c.reason}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-mute">
        <span>{c.persona}</span>
        <span className="text-ink-faint">·</span>
        <span>AE {c.assignedAE}</span>
      </div>
    </Link>
  )
}
