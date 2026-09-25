import { useNavigate } from 'react-router-dom'
import { Avatar, Card, PageHeader, Screen, StatTile } from '../../components/ui'
import { Icon } from '../../components/icons'
import { SegmentPill } from '../../components/domain'
import { useHealthColor } from '../../components/charts'
import { useExecutiveMetrics, useRoi } from '../../store/hooks'
import { fmtUSD, relTime } from '../../lib/format'

export function ChurnPrevented() {
  const navigate = useNavigate()
  const roi = useRoi()
  const m = useExecutiveMetrics()
  const protectedAccts = m.atRiskAccounts.slice(0, 8)
  const healthColor = useHealthColor()

  return (
    <Screen>
      <button onClick={() => navigate('/executive/value')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" /> Value & ROI
      </button>
      <PageHeader kicker="Executive · Value & ROI" title="Churn prevented" subtitle="Revenue retained by catching at-risk accounts early and acting on their feedback." />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile label="ARR retained" value={fmtUSD(roi.churnPreventedArr)} deltaKind="up-good" icon="circle-check" hint="this half" />
        <StatTile label="Accounts saved" value={roi.churnPreventedAccounts} icon="users" />
        <StatTile label="Avg per account" value={fmtUSD(Math.round(roi.churnPreventedArr / roi.churnPreventedAccounts))} icon="target" />
      </div>

      <Card className="p-5">
        <div className="mb-1 text-sm font-semibold text-ink">Accounts under active protection</div>
        <div className="mb-4 text-xs text-ink-mute">Flagged by churn-risk signals and being worked by CS.</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {protectedAccts.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-lg border border-line p-3">
              <Avatar initials={a.logoInitials} size={30} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink">{a.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-ink-mute">
                  <SegmentPill segment={a.segment} /> {fmtUSD(a.arr)} · renews {relTime(a.renewalISO).replace(' ago', '')}
                </div>
              </div>
              <span className="text-sm font-semibold" style={{ color: healthColor(a.health) }}>{a.health}</span>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-4 text-xs text-ink-mute">
        Attribution model: at-risk ARR where a Lighthouse signal drove a documented CS intervention before renewal. A seeded assumption in this prototype.
      </p>
    </Screen>
  )
}
