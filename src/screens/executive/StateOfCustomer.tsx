import { useNavigate } from 'react-router-dom'
import { Button, Card, PageHeader, Screen, StatTile } from '../../components/ui'
import { BarList, Figure, LegendSwatches, SentimentArea, SentimentSplitBar, useChartColors, useHealthColor } from '../../components/charts'
import { SegmentPill } from '../../components/domain'
import { Avatar } from '../../components/ui'
import { CountUp } from '../../components/motion'
import { useExecutiveMetrics, useFeedbackTimeseries, useThemes } from '../../store/hooks'
import { fmtNum, fmtUSD } from '../../lib/format'

export function StateOfCustomer() {
  const m = useExecutiveMetrics()
  const ts = useFeedbackTimeseries(12)
  const themes = useThemes({ sort: 'impact' })
  const navigate = useNavigate()
  const healthColor = useHealthColor()
  const cc = useChartColors()

  return (
    <Screen>
      <PageHeader
        kicker="Executive · Command Center"
        title="State of the Customer"
        subtitle="One page on how customers feel, what's driving it, and where the revenue risk sits — as of August 2026."
        actions={
          <Button variant="primary" icon="file-text" onClick={() => navigate('/executive/narrative')}>
            Board narrative
          </Button>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Insights analyzed" value={<CountUp end={m.total} delay={0} format={fmtNum} />} hint={`${fmtNum(m.ingested)} ingested`} icon="activity" />
        <StatTile label="Positive" value={<CountUp end={m.posPct} delay={90} format={(n) => `${Math.round(n)}%`} />} delta={`${m.negPct}% negative`} deltaKind="neutral" icon="trending-up" />
        <StatTile label="NPS proxy" value={<CountUp end={m.npsProxy} delay={180} />} deltaKind={m.npsProxy >= 0 ? 'up-good' : 'up-bad'} hint="pos − neg" icon="compass" />
        <StatTile label="ARR at risk" value={<CountUp end={m.arrAtRisk} delay={270} format={fmtUSD} />} deltaKind="up-bad" hint={`${m.atRiskAccounts.length} accounts`} icon="alert-triangle" />
        <StatTile label="Critical signals" value={<CountUp end={m.criticalSignals} delay={360} />} deltaKind="up-bad" icon="bell" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* left 2/3 */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Figure
            title="Feedback sentiment · last 12 weeks"
            subtitle="Weekly volume by sentiment"
            legend={<LegendSwatches items={[{ label: 'Negative', color: cc.neg }, { label: 'Neutral', color: cc.neu }, { label: 'Positive', color: cc.pos }]} />}
          >
            <SentimentArea data={ts} />
          </Figure>

          <Figure title="Top themes by impact" subtitle="Impact score 0–100 · click to drill in">
            <BarList
              items={themes.slice(0, 6).map((t) => ({ label: t.title, value: t.impact, display: `${t.impact}`, to: `/themes/${t.id}`, sub: fmtUSD(t.arrImpact) }))}
              max={100}
            />
          </Figure>
        </div>

        {/* right 1/3 */}
        <div className="flex flex-col gap-5">
          <Figure title="Sentiment mix" subtitle={`${fmtNum(m.total)} insights`}>
            <SentimentSplitBar pos={m.pos} neu={m.neu} neg={m.neg} />
          </Figure>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-ink">Where ARR is at risk</div>
              <button onClick={() => navigate('/executive/revenue')} className="text-xs font-medium text-rust hover:text-rust-dark">
                Details
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {m.atRiskAccounts.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <Avatar initials={a.logoInitials} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{a.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-mute">
                      <SegmentPill segment={a.segment} /> {fmtUSD(a.arr)}
                    </div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: healthColor(a.health) }}>{a.health}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 text-sm font-semibold text-ink">By segment</div>
            <div className="flex flex-col gap-3">
              {m.segments.map((s) => (
                <div key={s.segment}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-ink">{s.segment}</span>
                    <span className="text-ink-mute">{fmtUSD(s.arr)} · {s.accounts} accts</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-paper-sunken">
                    <div className="h-full rounded-full" style={{ width: `${s.avgHealth}%`, background: healthColor(s.avgHealth) }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Screen>
  )
}
