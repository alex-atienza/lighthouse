import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Card, EmptyState, Kv, Screen, cx } from '../../components/ui'
import { FeedbackQuote, SegmentPill, ThemeChip } from '../../components/domain'
import { MatchScore, CAND_FLOW, candStatusMeta } from './shared'
import { useHealthColor } from '../../components/charts'
import { Icon } from '../../components/icons'
import { findAccount, findTheme, useActions, useCandidate, useDb } from '../../store/hooks'
import { fmtUSD, relTime } from '../../lib/format'
import type { CandidateStatus } from '../../data/types'

export function CandidateProfile() {
  const { id } = useParams()
  const c = useCandidate(id)
  const db = useDb()
  const navigate = useNavigate()
  const { setCandidateStatus } = useActions()
  const healthColor = useHealthColor()

  if (!c) {
    return (
      <Screen>
        <EmptyState icon="users" title="Candidate not found" action={<Button onClick={() => navigate('/research')}>Back to pipeline</Button>} />
      </Screen>
    )
  }

  const acc = findAccount(db, c.accountId)
  const themes = c.themeIds.map((t) => findTheme(db, t)).filter(Boolean)
  const feedback = db.feedback.filter((f) => f.accountId === c.accountId).slice(0, 5)

  return (
    <Screen width="max-w-4xl">
      <button onClick={() => navigate('/research')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" /> Pipeline
      </button>

      <div className="flex items-start gap-4">
        <MatchScore score={c.matchScore} size={60} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Avatar initials={acc?.logoInitials ?? '—'} size={26} />
            <h1 className="font-display text-title text-ink">{acc?.name}</h1>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-ink-mute">
            <span>{c.persona}</span>
            {acc && <SegmentPill segment={acc.segment} />}
            <span>· {c.matchScore} match</span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="primary" icon="mail" onClick={() => navigate(`/research/${c.id}/notify`)}>Notify AE</Button>
        </div>
      </div>

      {/* status flow */}
      <div className="mt-5 flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-mute">Stage</span>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-paper-raised p-1">
          {CAND_FLOW.map((s) => (
            <button key={s} onClick={() => setCandidateStatus(c.id, s as CandidateStatus)} className={cx('rounded-md px-2.5 py-1 text-xs font-medium transition-colors', c.status === s ? 'bg-ink text-paper' : 'text-ink-mute hover:text-ink')}>
              {candStatusMeta[s].label}
            </button>
          ))}
          <button onClick={() => setCandidateStatus(c.id, 'declined')} className={cx('rounded-md px-2.5 py-1 text-xs font-medium transition-colors', c.status === 'declined' ? 'bg-sentiment-neg text-white' : 'text-ink-mute hover:text-sentiment-neg')}>
            Declined
          </button>
        </div>
      </div>

      <p className="mt-5 rounded-lg border border-line bg-rust-wash/40 p-4 text-sm text-ink-soft">
        <span className="font-medium text-ink">Why this account: </span>{c.reason}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 text-sm font-semibold text-ink">What they've told us</div>
          <div className="flex flex-col gap-2.5">
            {feedback.length === 0 && <div className="text-sm text-ink-mute">No feedback on file for this account.</div>}
            {feedback.map((f) => (
              <FeedbackQuote key={f.id} item={f} compact />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {themes.map((t) => (
              <ThemeChip key={t!.id} theme={t!} />
            ))}
          </div>
        </div>

        {acc && (
          <Card className="h-fit p-5">
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-mute">Account</div>
            <div className="flex flex-col gap-3">
              <Kv label="ARR">{fmtUSD(acc.arr)}</Kv>
              <Kv label="Health"><span style={{ color: healthColor(acc.health) }} className="font-semibold">{acc.health}</span></Kv>
              <Kv label="Industry">{acc.industry}</Kv>
              <Kv label="CSM">{acc.csm}</Kv>
              <Kv label="Account exec">{c.assignedAE}</Kv>
              <Kv label="Renews">{relTime(acc.renewalISO).replace(' ago', '')}</Kv>
              {c.lastContactISO && <Kv label="Last contact">{relTime(c.lastContactISO)}</Kv>}
            </div>
          </Card>
        )}
      </div>
    </Screen>
  )
}
