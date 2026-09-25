import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, EmptyState, Screen, StatTile, cx } from '../../components/ui'
import { FeedbackQuote, ThemeChip } from '../../components/domain'
import { Icon } from '../../components/icons'
import { OPP_STATUSES, oppStatusMeta } from './shared'
import { findTheme, useActions, useDb, useOpportunity } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'
import type { OppStatus } from '../../data/types'

export function OpportunityDetail() {
  const { id } = useParams()
  const o = useOpportunity(id)
  const db = useDb()
  const navigate = useNavigate()
  const { setOppStatus } = useActions()

  if (!o) {
    return (
      <Screen>
        <EmptyState icon="target" title="Opportunity not found" action={<Button onClick={() => navigate('/prioritize')}>Back to board</Button>} />
      </Screen>
    )
  }

  const themes = o.themeIds.map((t) => findTheme(db, t)).filter(Boolean)
  const evidence = db.feedback.filter((f) => themes.some((t) => t!.feedbackItemIds.includes(f.id))).slice(0, 4)

  return (
    <Screen width="max-w-4xl">
      <button onClick={() => navigate('/prioritize')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" /> Board
      </button>

      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-mute">Opportunity · {o.owner}</div>
          <h1 className="font-display text-title text-ink">{o.title}</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">{o.summary}</p>
        </div>
        <Button variant="secondary" icon="external" onClick={() => navigate('/prioritize/sync')}>
          {o.jiraKey ?? 'Sync to Jira'}
        </Button>
      </div>

      {/* status changer */}
      <div className="mt-5 flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-mute">Stage</span>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-paper-raised p-1">
          {OPP_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setOppStatus(o.id, s as OppStatus)}
              className={cx('rounded-md px-2.5 py-1 text-xs font-medium transition-colors', o.status === s ? 'bg-ink text-paper' : 'text-ink-mute hover:text-ink')}
            >
              {oppStatusMeta[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Impact" value={o.impact} hint="0–100" icon="zap" />
        <StatTile label="Effort" value={o.effort} hint="0–100" icon="sliders" />
        <StatTile label="ARR reach" value={fmtUSD(o.arrReach)} hint={`${o.reachAccounts} accounts`} icon="target" />
        <StatTile label="RICE" value={o.rice} hint={o.quarter} icon="trending-up" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-2 text-sm font-semibold text-ink">Grounded in themes</div>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <ThemeChip key={t!.id} theme={t!} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold text-ink">Supporting evidence</div>
          <div className="flex flex-col gap-2.5">
            {evidence.map((f) => (
              <FeedbackQuote key={f.id} item={f} compact />
            ))}
          </div>
        </div>
      </div>
    </Screen>
  )
}
