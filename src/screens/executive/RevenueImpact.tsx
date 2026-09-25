import { PageHeader, Screen, StatTile, Card } from '../../components/ui'
import { Avatar } from '../../components/ui'
import { BarList, Figure, useHealthColor } from '../../components/charts'
import { SegmentPill } from '../../components/domain'
import { useExecutiveMetrics, useRoi, useThemes } from '../../store/hooks'
import { fmtUSD, relTime } from '../../lib/format'

export function RevenueImpact() {
  const m = useExecutiveMetrics()
  const roi = useRoi()
  const byArr = [...useThemes({})].sort((a, b) => b.arrImpact - a.arrImpact).slice(0, 8)
  const segRisk = (['Enterprise', 'Mid-Market', 'SMB'] as const).map((seg) => ({
    seg,
    arr: m.atRiskAccounts.filter((a) => a.segment === seg).reduce((s, a) => s + a.arr, 0),
  }))
  const healthColor = useHealthColor()

  return (
    <Screen>
      <PageHeader
        kicker="Executive · Command Center"
        title="Revenue impact"
        subtitle="How customer sentiment maps to dollars — what's exposed, and what feedback-driven work has protected."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Total ARR" value={fmtUSD(m.totalArr)} icon="target" hint={`${m.segments.reduce((s, x) => s + x.accounts, 0)} accounts`} />
        <StatTile label="ARR at risk" value={fmtUSD(m.arrAtRisk)} deltaKind="up-bad" icon="alert-triangle" hint={`${m.atRiskAccounts.length} accounts`} />
        <StatTile label="ARR protected" value={fmtUSD(roi.churnPreventedArr)} deltaKind="up-good" icon="circle-check" hint="churn prevented" />
        <StatTile label="Expansion influenced" value={fmtUSD(roi.expansionInfluencedArr)} deltaKind="up-good" icon="trending-up" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Figure title="ARR touched by theme" subtitle="Revenue associated with each theme's accounts">
          <BarList items={byArr.map((t) => ({ label: t.title, value: t.arrImpact, display: fmtUSD(t.arrImpact), to: `/themes/${t.id}` }))} />
        </Figure>

        <Card className="p-5">
          <div className="mb-3 text-sm font-semibold text-ink">At-risk accounts</div>
          <div className="flex flex-col gap-3">
            {m.atRiskAccounts.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-center gap-3">
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
      </div>

      <div className="mt-5">
        <Figure title="ARR at risk by segment" subtitle="Where the exposure concentrates">
          <BarList items={segRisk.map((s) => ({ label: s.seg, value: s.arr, display: fmtUSD(s.arr) }))} />
        </Figure>
      </div>
    </Screen>
  )
}
